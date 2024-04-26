


export async function writeDataToSVGFile(data: string, outputFilePath: string | URL | undefined) {
  const filePath = outputFilePath?.toString() ?? `./generated/translation-${+new Date}.svg`
  await Bun.write(filePath, data).catch((error) => {
    console.error('[writeDataToSVGFile] error:', error)
  })
  return filePath
}
