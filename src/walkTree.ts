
export type Selector = (node: unknown) => void

export function walkTree(node: unknown | unknown[], selector: Selector) {
  if (!node) return

  selector(node)

  if (Array.isArray(node)) {
    node.forEach(n => walkTree(n, selector))
    return
  }

  if (typeof node === 'object') {
    Object.values(node).forEach(n => walkTree(n, selector))
    return
  }
}