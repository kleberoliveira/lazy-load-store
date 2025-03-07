import { FileManager } from "../file";
import { generateFilename } from "../../utils/filename-generator";
import { isObject } from "../../utils/type-guards";

/**
 * Classe responsável por lidar com a configuração (set) e recuperação (get) de propriedades.
 */
export class PropertyHandler {
  private fileManager: FileManager;

  constructor(fileManager: FileManager) {
    this.fileManager = fileManager;
  }

  /**
   * Manipula a operação de set em uma propriedade.
   * @param prop - Nome da propriedade.
   * @param value - Valor a ser definido.
   * @returns O valor processado ou referência ao arquivo.
   */
  public handleSet(prop: string, value: unknown): unknown {
    return this.processValueForSet(prop, value);
  }

  /**
   * Manipula a operação de get em uma propriedade.
   * @param prop - Nome da propriedade.
   * @param value - Valor a ser recuperado.
   * @returns O valor recuperado ou conteúdo do arquivo.
   */
  public handleGet(prop: string, value: unknown): unknown {
    return this.processValueForGet(value);
  }

  /**
   * Processa o valor para a operação de set.
   * Se o valor for grande, salva em um arquivo e retorna a referência.
   * @param prop - Nome da propriedade.
   * @param value - Valor a ser processado.
   * @returns O valor processado.
   */
  private processValueForSet(prop: string, value: unknown): unknown {
    if (this.shouldSaveToFile(value)) {
      const filename = generateFilename(prop);
      this.fileManager.writeToFile(filename, value as string);
      return filename;
    }

    if (Array.isArray(value)) {
      return value.map((item, index) => this.processValueForSet(`${prop}_${index}`, item));
    }

    if (isObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, this.processValueForSet(`${prop}_${key}`, val)])
      );
    }

    return value;
  }

  /**
   * Processa o valor para a operação de get.
   * Se for uma referência de arquivo, lê e retorna o conteúdo.
   * @param value - Valor a ser processado.
   * @returns O valor processado.
   */
  private processValueForGet(value: unknown): unknown {
    if (this.isStoredInFile(value)) {
      return this.fileManager.readFromFile(value as string);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.processValueForGet(item));
    }

    if (isObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, this.processValueForGet(val)])
      );
    }

    return value;
  }

  /**
   * Verifica se o valor deve ser salvo em arquivo.
   * @param value - Valor a ser verificado.
   * @returns True se o valor deve ser salvo.
   */
  private shouldSaveToFile(value: unknown): value is string {
    return typeof value === "string" && value.length > 1000;
  }

  /**
   * Verifica se o valor é uma referência de arquivo.
   * @param value - Valor a ser verificado.
   * @returns True se for uma referência de arquivo.
   */
  public isStoredInFile(value: unknown): value is string {
    return typeof value === "string" && value.endsWith(".txt");
  }
}
