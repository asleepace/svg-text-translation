

export function estimateFontSize(copy: string, pairs: string[][], fontScale?: number) {

  // calculate ratio
  const ratio = fontScale ?? 0.9
  console.log('[estimateFontSize] ratio:', ratio)

  const fontSizeRegex = new RegExp(/font-size="(.*?)"/)
  const matches = copy.match(fontSizeRegex)

  // scale font size
  if (matches && matches.length > 1) {
    const originalFontSize = Math.round(parseFloat(matches[1]))
    const newFontSize = Math.round(originalFontSize * ratio)
    console.log('[estimateFontSize] originalFontSize:', originalFontSize)
    console.log('[estimateFontSize] ratio', ratio)
    console.log('[estimateFontSize] newFontSize', newFontSize)
    copy = copy.replace(fontSizeRegex, `font-size="${newFontSize}"`)
  }

  // translate font position
  const fontPositionRegex = new RegExp(/<tspan x="(.*?)"/g)
  const positions = copy.match(fontPositionRegex)

  // translate each position
  positions?.forEach((position, index) => {
    if (index >= pairs.length) return

    const currentSpanPosition = position.match(/<tspan x="(.*?)"/)
    if (!currentSpanPosition) return

    const [originalPosition, originalXPosition] = currentSpanPosition
    const xPosition = Math.round(parseFloat(originalXPosition))
    const newPosition = Math.round(xPosition * ratio)

    console.log('[estimateFontSize] translating:', [xPosition, newPosition])
    copy = copy.replace(originalPosition, `<tspan x="${newPosition}"`)
  })

  return copy
}
