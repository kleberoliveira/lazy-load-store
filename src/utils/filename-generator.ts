/**
 * Gera um nome de arquivo com base na propriedade e no timestamp atual.
 * @param prop - Nome da propriedade.
 * @returns Nome do arquivo gerado.
 */
export function generateFilename(prop: string): string {
  return `${prop}_${Date.now()}.txt`;
}
