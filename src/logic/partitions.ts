
/**
 * This function takes an array of numbers and a number n and returns all the possible ways to partition the array into n parts.
 */
export const partitions = (items: number[], n: number, curr: number[][], solutions: number[][][] = []) => {

  if (n === 0) {
    console.log(curr)
    solutions.push(curr)
    return solutions
  }

  if (n === 1) {
    partitions([], n - 1, [...curr, items], solutions)
    return solutions
  }

  for (let i=1; i<items.length; i++) {
    const first = items.slice(0, i)
    partitions(items.slice(i), n - 1, [...curr, first], solutions)
  }

  return solutions
}
