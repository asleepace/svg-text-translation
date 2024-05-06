const partitions = (items: number[], n: number, curr: number[][], solutions: number[][][] = []) => {

  if (n === 0) {
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

function calculateDistance(arr1: number[], arr2: number[]) {
  return arr1.reduce((average, current, index) => {
    const diff = Math.abs(arr2[index] - current)
    return average + diff
  }, 0)
}


export type BestFitParams = {
  currentWords: string[]
  targetSizes: number[]
}

/**
 * Attempts to match the current word lengths to the target sizes. This is an expensive operation
 * and should be used sparingly, as it will try every possible combination of partitions to find 
 * the best fit.
 */
export function findBestFit({ currentWords, targetSizes }: BestFitParams): string[] {
  const currentWordLengths = currentWords.map((word) => word.length)
  let shortedDistance: number = Infinity
  let bestFitSolution: number[][] = []
  let bestFitSum: number[] = []
  const results = partitions(currentWordLengths, targetSizes.length, [])
  results.forEach((line) => {
    const totalSum = line.map((arr) => arr.reduce((p, c) => p + c, 0))
    const distance = calculateDistance(targetSizes, totalSum)
    if (distance < shortedDistance) {
      shortedDistance = distance
      bestFitSolution = line
      bestFitSum = totalSum
    }
  })
  
  console.log('[findBestFit] best fit sum: ', bestFitSum)
  const output: string[][] = [[]]

  let targetLength = bestFitSum[0]
  let index = 0
  
  currentWords.forEach((word) => {
    console.log('[findBestFit] target length: ', targetLength, 'word: ', word)
    targetLength -= word.length
    output[index].push(word)

    if (targetLength <= 0) {
      index++
      targetLength = bestFitSum[index]
      output.push([])
    }
  })

  console.log('[findBestFit] best fit: ', output)
  return output.map((s) => s.join(' '))
}