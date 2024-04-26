


export function writeDataToSVGFile(data: string) {
  const fileName = `./generated/translated_fr_${+new Date}.svg`
  Bun.write(fileName, data)
  return fileName
}
