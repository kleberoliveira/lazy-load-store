import { existsSync, readFileSync, rmSync } from "fs";
import { join, resolve } from "path";
import { Storage } from "../../../src/core/storage";

jest.mock("../../../src/utils/filename-generator", () => ({
  generateFilename: (prop: string) => `${prop}_mocked.txt`,
}));

interface StorageWithDynamicProps extends Storage {
  [key: string]: unknown;
  getFileName?: (property: string) => string | Record<string, string>;
}

describe("Storage", () => {
  const storageDir = resolve(__dirname, "../../../storage");
  const largeString = "A".repeat(1500);
  let storage: StorageWithDynamicProps;

  beforeEach(() => {
    storage = new Storage() as StorageWithDynamicProps;
  });

  afterEach(() => {
    storage.destroy();
    if (existsSync(storageDir)) {
      rmSync(storageDir, { recursive: true, force: true });
    }
  });

  it("should set and get a small value directly", () => {
    storage.smallValue = "test";
    expect(storage.smallValue).toBe("test");
  });

  it("should save a large string to a file and retrieve it", () => {
    storage.largeValue = largeString;

    const getFileName = storage.getFileName as (property: string) => string | undefined;
    const fileName = getFileName?.("largeValue");
    const filePath = fileName ? join(storageDir, fileName) : "";

    expect(fileName).toBe("largeValue_mocked.txt");
    expect(existsSync(filePath)).toBe(true);
    expect(readFileSync(filePath, "utf-8")).toBe(largeString);
    expect(storage.largeValue).toBe(largeString);
  });

  it("should handle nested objects with large strings", () => {
    storage.nested = {
      key1: largeString,
      key2: "small value",
    };

    const getFileName = storage.getFileName as (property: string) => Record<string, string> | undefined;
    const fileName = getFileName?.("nested")?.key1;
    const filePath = fileName ? join(storageDir, fileName) : "";

    expect(fileName).toBe("nested_key1_mocked.txt");
    expect(existsSync(filePath)).toBe(true);
    expect((storage.nested as Record<string, string>).key1).toBe(largeString);
    expect((storage.nested as Record<string, string>).key2).toBe("small value");
  });

  it("should collect all stored file references", () => {
    storage.data = {
      file1: "file1_mocked.txt",
      file2: "file2_mocked.txt",
      nested: {
        file3: "file3_mocked.txt",
      },
    };

    const collectedFiles = storage.collectFiles(storage.data);

    expect(collectedFiles).toEqual([
      "file1_mocked.txt",
      "file2_mocked.txt",
      "file3_mocked.txt",
    ]);
  });

  it("should delete all files when destroy is called", () => {
    storage.toDelete = largeString;

    const getFileName = storage.getFileName as (property: string) => string | undefined;
    const fileName = getFileName?.("toDelete");
    const filePath = fileName ? join(storageDir, fileName) : "";

    expect(fileName).toBe("toDelete_mocked.txt");
    expect(existsSync(filePath)).toBe(true);

    storage.destroy();

    expect(existsSync(filePath)).toBe(false);
  });
});
