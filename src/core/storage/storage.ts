import { resolve } from "path";
import { FileManager } from "../file/";
import { PropertyHandler } from "../handlers";
import { isObject } from "../../utils/type-guards";

/**
 * Classe Storage responsável por armazenar dados com suporte a arquivos para valores grandes.
 * Implementa o padrão Singleton com Proxy para interceptar operações de get e set.
 * O diretório de armazenamento será relativo ao local onde a instância da classe Storage for criada.
 */
export class Storage {
  private static instance: Storage | null = null;
  private fileManager!: FileManager;
  private propertyHandler!: PropertyHandler;
  private __data__: Record<string, unknown> = {};

  /**
   * Construtor da classe que retorna sempre a instância singleton.
   * Ao chamar "new Storage()", o método getInstance é automaticamente utilizado.
   * @param basePath - Caminho base para salvar os arquivos (padrão: diretório do processo atual).
   */
  constructor(basePath: string = process.cwd(), data: Record<string, unknown> = {}) {

    const storagePath = resolve(basePath, "storage");
    this.__data__ = data;
    this.fileManager = new FileManager(storagePath);
    this.propertyHandler = new PropertyHandler(this.fileManager);

    return new Proxy(this, this.createProxyHandler());
  }

  /**
   * Cria o handler para o Proxy, interceptando operações de get e set.
   */
  private createProxyHandler(): ProxyHandler<Storage> {
    return {
      set: this.setHandler.bind(this),
      get: this.getHandler.bind(this),
    };
  }

  private setHandler(target: Storage, prop: string, value: unknown): boolean {
    target.__data__[prop] = this.propertyHandler.handleSet(prop, value);
    return true;
  }

  private getHandler(target: Storage, prop: string): unknown {
    if (this.isPropertyOfTarget(target, prop)) {
      return this.getPropertyFromTarget(target, prop);
    }

    if (prop === "getFileName") {
      return this.createGetFileNameMethod(target);
    }

    return this.getProcessedValue(target, prop);
  }

  private isPropertyOfTarget(target: Storage, prop: string): boolean {
    return prop in target;
  }

  private getPropertyFromTarget(target: Storage, prop: string): unknown {
    // @ts-expect-error: Accessing dynamic properties of the class
    return target[prop];
  }

  private createGetFileNameMethod(target: Storage): (property: string) => unknown {
    return (property: string) => target.__data__[property];
  }

  private getProcessedValue(target: Storage, prop: string): unknown {
    const value = this.propertyHandler.handleGet(prop, target.__data__[prop]);
    if (isObject(value)) {
      return new Proxy(new Storage(process.cwd(), value), this.createProxyHandler());
    }
    return value;
  }

  /**
   * Coleta todos os arquivos referenciados no objeto fornecido.
   * @param data - Dados a serem inspecionados.
   * @returns Array de nomes de arquivos encontrados.
   */
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

  /**
   * Destroi a instância do Storage e remove os arquivos associados.
   */
  public async destroy(): Promise<void> {
    const filesToDelete = this.collectFiles(this.__data__);
    const promisesToDelete = filesToDelete.map((file) => this.fileManager.deleteFile(file));
    await Promise.all(promisesToDelete);
    Storage.instance = null;
  }
}
