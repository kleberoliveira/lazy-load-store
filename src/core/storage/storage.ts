import { resolve } from "path";
import { FileManager } from "../file/";
import { PropertyHandler } from "../handlers";

/**
 * Classe Storage responsável por armazenar dados com suporte a arquivos para valores grandes.
 * Implementa o padrão Singleton com Proxy para interceptar operações de get e set.
 * O diretório de armazenamento será relativo ao local onde a instância da classe Storage for criada.
 */
export class Storage {
  private static instance: Storage | null = null;
  private fileManager: FileManager;
  private propertyHandler: PropertyHandler;
  public data: Record<string, unknown>;

  /**
   * Cria uma instância do Storage utilizando o diretório do processo atual como local de armazenamento.
   * @param basePath - Caminho base para salvar os arquivos (por padrão, o diretório onde o processo foi iniciado).
   */
  private constructor(basePath: string) {
    const storagePath = resolve(basePath, "storage");
    this.data = {};
    this.fileManager = new FileManager(storagePath);
    this.propertyHandler = new PropertyHandler(this.fileManager);
  }

  /**
   * Retorna a instância singleton do Storage.
   * Se não existir, cria uma nova instância com o diretório do processo atual ou um fornecido.
   * @param basePath - Caminho base opcional para salvar os arquivos (padrão: diretório do processo atual).
   */
  public static getInstance(basePath: string = process.cwd()): Storage {
    if (!this.instance) {
      const storage = new Storage(basePath);
      this.instance = new Proxy(storage, storage.createProxyHandler());
    }
    return this.instance;
  }

  /**
   * Cria o handler para o Proxy, interceptando operações de get e set.
   */
  private createProxyHandler(): ProxyHandler<Storage> {
    return {
      set: (target, prop: string, value: unknown): boolean => {
        target.data[prop] = this.propertyHandler.handleSet(prop, value);
        return true;
      },
      get: (target, prop: string): unknown => {
        if (prop in target) {
          // @ts-expect-error: Accessing dynamic properties of the class
          return target[prop];
        }

        if (prop === "getFileName") {
          return (property: string) => target.data[property];
        }

        return this.propertyHandler.handleGet(prop, target.data[prop]);
      },
    };
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
    const filesToDelete = this.collectFiles(this.data);
    const promisesToDelete = filesToDelete.map((file) => this.fileManager.deleteFile(file));
    await Promise.all(promisesToDelete);
    Storage.instance = null;
  }
}
