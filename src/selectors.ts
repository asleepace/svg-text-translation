


export function isTextSpan(node: unknown): node is SVGPhrase {
  if (!node || typeof node !== 'object') return false
  if ('tspan' in node && Array.isArray(node.tspan)) {
    return node.tspan.some(phrase => typeof phrase === 'string' && phrase.length > 0)
  }
  return false
}
