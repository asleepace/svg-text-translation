

export function replaceTextInSVG(copy: string, pairs: string[][]) {
  pairs.forEach(([original, translation]) => {
    console.log(`[translate] "${original}" => "${translation}"`)
    copy = copy.replace(original, translation)
  })
  return copy
}
