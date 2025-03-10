import { PropertyHandler, FileManager } from "../../../src/core";
import { join } from "path";
import { existsSync, readFileSync, unlinkSync, rmdirSync } from "fs";

jest.mock("../../../src/utils/filename-generator", () => ({
  generateFilename: (prop: string) => `${prop}_mocked.txt`,
}));

describe("PropertyHandler", () => {
  const testDir = join(__dirname, "test-storage");
  const fileContent = "A".repeat(1500);
  let propertyHandler: PropertyHandler;

  beforeAll(() => {
    const fileManager = new FileManager(testDir);
    propertyHandler = new PropertyHandler(fileManager);
  });

  afterAll(() => {
    if (existsSync(testDir)) {
      const files = [
        "prop_mocked.txt",
        "array_prop_0_mocked.txt",
        "object_prop_key_mocked.txt",
      ];
      files.forEach((file) => {
        const filePath = join(testDir, file);
        if (existsSync(filePath)) unlinkSync(filePath);
      });
      rmdirSync(testDir);
    }
  });

  describe("handleSet", () => {
    it("should save large string values to a file and return the filename", () => {
      const result = propertyHandler.handleSet("prop", fileContent);
      const filePath = join(testDir, "prop_mocked.txt");

      expect(result).toBe("prop_mocked.txt");
      expect(existsSync(filePath)).toBe(true);
      expect(readFileSync(filePath, "utf-8")).toBe(fileContent);
    });

    it("should handle arrays and save large strings inside them", () => {
      const arrayWithLargeString = [fileContent, "small"];
      const result = propertyHandler.handleSet(
        "array_prop",
        arrayWithLargeString
      ) as string[];

      expect(result[0]).toBe("array_prop_0_mocked.txt");
      expect(result[1]).toBe("small");
      expect(existsSync(join(testDir, "array_prop_0_mocked.txt"))).toBe(true);
    });

    it("should handle objects and save large strings inside them", () => {
      const objectWithLargeString = { key: fileContent };
      const result = propertyHandler.handleSet(
        "object_prop",
        objectWithLargeString
      ) as Record<string, string>;

      expect(result.key).toBe("object_prop_key_mocked.txt");
      expect(existsSync(join(testDir, "object_prop_key_mocked.txt"))).toBe(
        true
      );
    });

    it("should return the value as-is if it doesn't meet the save criteria", () => {
      const smallString = "small value";
      const result = propertyHandler.handleSet("smallProp", smallString);
      expect(result).toBe(smallString);
    });
  });

  describe("handleGet", () => {
    it("should read content from stored file references", () => {
      propertyHandler.handleSet("prop", fileContent);
      const result = propertyHandler.handleGet("prop", "prop_mocked.txt");
      expect(result).toBe(fileContent);
    });

    it("should handle arrays and retrieve content from file references", () => {
      const arrayWithFile = ["array_prop_0_mocked.txt", "small"];
      const result = propertyHandler.handleGet(
        "array_prop",
        arrayWithFile
      ) as string[];

      expect(result[0]).toBe(fileContent);
      expect(result[1]).toBe("small");
    });

    it("should handle objects and retrieve content from file references", () => {
      const objectWithFile = { key: "object_prop_key_mocked.txt" };
      const result = propertyHandler.handleGet(
        "object_prop",
        objectWithFile
      ) as Record<string, string>;

      expect(result.key).toBe(fileContent);
    });

    it("should return the value as-is if it's not a file reference", () => {
      const result = propertyHandler.handleGet("prop", "small value");
      expect(result).toBe("small value");
    });
  });
});
