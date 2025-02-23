import { FileManager } from "../../../src/core/file/file-manager";
import { existsSync, readFileSync, unlinkSync, rmdirSync } from "fs";
import { join } from "path";

describe("FileManager", () => {
  const testDir = join(__dirname, "test-storage");
  const testFilename = "test-file.txt";
  const testContent = "Hello, FileManager!";
  let fileManager: FileManager;

  beforeAll(() => {
    fileManager = new FileManager(testDir);
  });

  afterAll(() => {
    const filePath = join(testDir, testFilename);
    if (existsSync(filePath)) unlinkSync(filePath);
    if (existsSync(testDir)) rmdirSync(testDir);
  });

  it("should create the storage directory if it does not exist", () => {
    expect(existsSync(testDir)).toBe(true);
  });

  it("should write content to a file", () => {
    const filename = fileManager.writeToFile(testFilename, testContent);
    const filePath = join(testDir, filename);

    expect(existsSync(filePath)).toBe(true);
    expect(readFileSync(filePath, "utf-8")).toBe(testContent);
  });

  it("should read content from a file", () => {
    fileManager.writeToFile(testFilename, testContent);
    const content = fileManager.readFromFile(testFilename);

    expect(content).toBe(testContent);
  });

  it("should return null when reading a non-existent file", () => {
    const content = fileManager.readFromFile("non-existent.txt");
    expect(content).toBeNull();
  });

  it("should delete an existing file", () => {
    fileManager.writeToFile(testFilename, testContent);
    const deleted = fileManager.deleteFile(testFilename);

    expect(deleted).toBe(true);
    expect(existsSync(join(testDir, testFilename))).toBe(false);
  });

  it("should return false when trying to delete a non-existent file", async () => {
    const deleted = await fileManager.deleteFile("non-existent.txt");
    expect(deleted).toBe(false);
  });
});
