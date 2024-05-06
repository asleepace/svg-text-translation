/**
 * Matches the first text element in an SVG.
 */
const SVG_TEXT_REGEX = /<text[^>]*>.*?<\/text>/s

/**
 * Options for replacing the text in the SVG.
 */
export type ReplacementOptions = Partial<{
  lineHeight?: number,
  fontSize?: number,
  y?: number,
}>

/**
 * This method replaces the text in the SVG with a template that is centered
 * as spaced out vertically.
 */
export function replaceWithTemplate(svg: string, lines: string[], options: ReplacementOptions = {}): string {
  const { y = 15, fontSize = 100, lineHeight = 5 } = options

  console.log('[replaceWithTemplate] lines:', lines)
  console.log('[replaceWithTemplate] options:', options)


  const spans = lines.filter(Boolean).map((line, index) => `<tspan x="50%" y="${y + (index * lineHeight)}%">${line}</tspan>`).join("\n")
  const template = `<text x="50%" y="50%" letter-spacing="-3.5px" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle" fill="#111111" font-family="Inter" font-weight="bold">${spans}</text>`

  return svg.replace(SVG_TEXT_REGEX, template)
}
