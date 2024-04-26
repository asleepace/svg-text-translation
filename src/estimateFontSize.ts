

export function estimateFontSize(copy: string, ratio: number, newNumberOfChars: number) {
  const fontSizeRegex = new RegExp(/font-size="(.*?)"/)
  const originalFontSize = copy.match(fontSizeRegex)
  if (originalFontSize && originalFontSize.length > 1) {
    const newFontSize = (+originalFontSize[1] * ratio) + newNumberOfChars
    console.log('newFontSize', newFontSize)
    copy = copy.replace(fontSizeRegex, `font-size="${newFontSize}"`)
  }
  return copy
}
