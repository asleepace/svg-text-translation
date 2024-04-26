

export function estimateFontSize(copy: string, pairs: string[][], fontScale?: number) {

  console.log('[estimateFontSize] fontScale:', fontScale)

  // calculate ratio
  const ratio = fontScale ?? pairs.reduce((acc, [original, translation]) => {
    const originalLength = original.length
    const translationLength = translation.length

    console.log('[estimateFontSize] original:', [originalLength, translationLength, originalLength / translationLength])

    if (originalLength === 0) return acc
    if (translationLength === 0) return acc

    const ratio = (originalLength / translationLength)
    return Math.min(acc, ratio)
  }, 1)

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
