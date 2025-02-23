import { generateFilename } from "../../src/utils/filename-generator";

describe("generateFilename", () => {
  const originalDateNow = Date.now;

  beforeAll(() => {
    jest.spyOn(Date, "now").mockImplementation(() => 1700000000000);
  });

  afterAll(() => {
    Date.now = originalDateNow;
  });

  it("should generate a filename with the given property and a timestamp", () => {
    const prop = "testProp";
    const expectedFilename = "testProp_1700000000000.txt";
    expect(generateFilename(prop)).toBe(expectedFilename);
  });

  it("should return a string ending with .txt", () => {
    const filename = generateFilename("example");
    expect(filename.endsWith(".txt")).toBe(true);
  });

  it("should include the provided property in the filename", () => {
    const prop = "myProperty";
    const filename = generateFilename(prop);
    expect(filename.startsWith(prop)).toBe(true);
  });
});
