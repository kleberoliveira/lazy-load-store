import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  unlinkSync,
} from "fs";
import { join } from "path";

/**
 * Classe responsável por gerenciar operações de arquivos.
 */
export class FileManager {
  private storagePath: string;

  constructor(storagePath: string) {
    this.storagePath = storagePath;
    this.ensureStorageDirectoryExists();
  }

  /**
   * Garante que o diretório de armazenamento exista.
   */
  private ensureStorageDirectoryExists(): void {
    if (!existsSync(this.storagePath)) {
      mkdirSync(this.storagePath, { recursive: true });
    }
  }

  /**
   * Escreve conteúdo em um arquivo.
   * @param filename - Nome do arquivo.
   * @param content - Conteúdo a ser escrito (string ou Buffer).
   * @returns O nome do arquivo.
   */
  public writeToFile(filename: string, content: string | Buffer): string {
    writeFileSync(join(this.storagePath, filename), content, "utf-8");
    return filename;
  }

  /**
   * Lê conteúdo de um arquivo.
   * @param filename - Nome do arquivo.
   * @returns O conteúdo do arquivo ou null se não existir.
   */
  public readFromFile(filename: string): string | null {
    const filePath = join(this.storagePath, filename);
    return existsSync(filePath) ? readFileSync(filePath, "utf-8") : null;
  }

  /**
   * Deleta um arquivo.
   * @param filename - Nome do arquivo.
   * @returns True se o arquivo foi deletado, false caso contrário.
   */
  public deleteFile(filename: string): boolean {
    const filePath = join(this.storagePath, filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      return true;
    }
    return false;
  }
}
