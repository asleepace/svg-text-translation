
export type Selector<T> = (node: unknown) => node is T


/**
 * This function recursively walks a tree of nodes and returns all nodes that match the given selectors.
 * This uses for...of loops to walk the tree, and will append any matching nodes to the output array.
 * The output is passed by reference, so the function will return the same array that was passed in.
 * 
 *```ts
 * const output = walk(treeData, [isTextSpan])
 */
export function walk<T>(node: unknown, selectors: Selector<T>[], output: T[] = []): T[] {

  // check if the node matches any of the selectors
  for (const selector of selectors) {
    const selection = selector(node)
    if (Boolean(selection)) {
      output.push(node as T)
      break
    }
  }
  
  // if no node is found, return the current output
  if (!node) return output

  // if node is an array, walk each child
  if (Array.isArray(node)) {
    for (const child of node) {
      walk(child, selectors, output)
    }
  }

  // if node is an object, walk each value
  if (typeof node === 'object') {
    for (const value of Object.values(node)) {
      walk(value, selectors, output)
    }
  }

  // return the output
  return output
}
