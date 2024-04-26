
export type FileNameParams = {
  pathToFile: string | URL
  outputPath?: string | URL
  targetLocale: string
}

/**
 * This utility function will return the file name for the translated SVG file.
 */
export function getFileName({ pathToFile, outputPath, targetLocale }: FileNameParams) {
  if (outputPath) return outputPath

  const fileName = pathToFile.toString().split("/").pop()
  console.log('[getFileName] fileName:', fileName)
  if (!fileName) throw new Error('File name not found')
  
  const newFileName = fileName.replace('.svg', `-${targetLocale}.svg`)
  return `./generated/${newFileName}`
}
