import { resolve } from "path";
import { FileManager } from "../file/";
import { PropertyHandler } from "../handlers";
import { isObject } from "../../utils/type-guards";

const contextMap = new WeakMap<object, StorageContext>();

export class Storage {
  constructor(
    basePath: string = process.cwd(),
    data?: Record<string, unknown>,
    callback?: (
      target: Storage,
      prop: string,
      value: unknown,
      receiver: unknown
    ) => void
  ) {
    const instance = Object.create(Storage.prototype);
    const context = new StorageContext(basePath, data, callback);

    const proxy = new Proxy(instance, context.createProxyHandler());
    contextMap.set(proxy, context);

    return proxy;
  }

  public collectFiles(data: unknown): string[] {
    const context = contextMap.get(this);
    if (!context) throw new Error("Context not found.");
    return context.collectFiles(data);
  }

  public async destroy(): Promise<void> {
    const context = contextMap.get(this);
    if (!context) throw new Error("Context not found.");
    await context.destroy();
  }

  public toJSON(): Record<string, unknown> {
    const context = contextMap.get(this);
    if (!context) throw new Error("Context not found.");
    return context.getAllData();
  }
}

class StorageContext {
  private fileManager: FileManager;
  private propertyHandler: PropertyHandler;
  private __data__: Record<string, unknown>;
  private callback?: (
    target: Storage,
    prop: string,
    value: unknown,
    receiver: unknown
  ) => void;

  private objectCache = new WeakMap<object, Storage>();

  constructor(
    basePath: string,
    data?: Record<string, unknown>,
    callback?: (
      target: Storage,
      prop: string,
      value: unknown,
      receiver: unknown
    ) => void
  ) {
    const storagePath = resolve(basePath, "storage");
    this.__data__ = data ?? {};
    this.fileManager = new FileManager(storagePath);
    this.propertyHandler = new PropertyHandler(this.fileManager);
    this.callback = callback;
  }

  public createProxyHandler(): ProxyHandler<Storage> {
    return {
      set: (target, prop, value) => this.setHandler(target, prop, value),
      get: (target, prop, receiver) => this.getHandler(target, prop, receiver),
    };
  }

  private setHandler(
    target: Storage,
    prop: string | symbol,
    value: unknown
  ): boolean {
    if (typeof prop !== "string") return false;
    this.__data__[prop] = this.propertyHandler.handleSet(prop, value);
    return true;
  }

  private getHandler(
    target: Storage,
    prop: string | symbol,
    receiver: unknown
  ): unknown {
    if (typeof prop !== "string") return undefined;

    if (this.isPropertyOfTarget(target, prop)) {
      return this.getPropertyFromTarget(target, prop);
    }

    if (prop === "getFileName") {
      return this.createGetFileNameMethod();
    }

    const value = this.getProcessedValue(prop);
    if (this.callback) {
      return this.callback(target, prop, value, receiver);
    }
    return value;
  }

  private isPropertyOfTarget(target: Storage, prop: string): boolean {
    return prop in target;
  }

  private getPropertyFromTarget(target: Storage, prop: string): unknown {
    // @ts-expect-error: Accessing dynamic properties of the class
    return target[prop];
  }

  private createGetFileNameMethod(): (property: string) => unknown {
    return (property: string) => this.__data__[property];
  }

  private getProcessedValue(prop: string): unknown {
    const value = this.propertyHandler.handleGet(prop, this.__data__[prop]);

    if (isObject(value)) {
      if (this.objectCache.has(value)) {
        return this.objectCache.get(value);
      }

      const storageInstance = new Storage(process.cwd(), value, this.callback);
      this.objectCache.set(value, storageInstance);
      return storageInstance;
    }

    return value;
  }

  public collectFiles(data: unknown): string[] {
    if (!data || typeof data !== "object") return [];

    return Object.values(data).reduce<string[]>((files, value) => {
      if (this.propertyHandler.isStoredInFile(value)) {
        files.push(value as string);
      } else if (typeof value === "object") {
        files.push(...this.collectFiles(value));
      }
      return files;
    }, []);
  }

  public getAllData(): Record<string, unknown> {
    return JSON.parse(JSON.stringify(this.__data__));
  }

  public async destroy(): Promise<void> {
    const filesToDelete = this.collectFiles(this.__data__);
    const promisesToDelete = filesToDelete.map((file) =>
      this.fileManager.deleteFile(file)
    );
    await Promise.all(promisesToDelete);
  }
}
