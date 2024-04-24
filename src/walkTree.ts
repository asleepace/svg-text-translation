
export type Selector<T> = (node: unknown) => Promise<T>

export async function walkTree<T>(node: unknown | unknown[], selector: Selector<T>): Promise<Awaited<T>[]> {
  if (!node) return []

  const value = await selector(node)
  const current = [value]

  if (Array.isArray(node)) {
    const children = await Promise.all(node.map((child) => walkTree(child, selector)))
    return current.concat(...children)
  }

  if (typeof node === 'object') {
    const children = Object.values(node).map((child) => walkTree(child, selector))
    const values = await Promise.all(children)
    return current.concat(...values)
  }

  return current
}