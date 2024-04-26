import { XMLParser } from "fast-xml-parser"
import { isTextSpan } from "./selectors";
import { walk, Selector } from "./walk";
import { fetchTranslations } from "./translate";
import { estimateFontSize } from "./estimateFontSize";
import { writeDataToSVGFile } from "./writeDataToSVG";
import { translate } from './translate'

export type Transformer<T> = (node: T) => string

export type PhraseSelector = (node: unknown) => node is SVGPhrase
export type PhraseTransform = (node: SVGPhrase[]) => string[]

export type SVGTranslationOptions<T> = {
  pathToFile: string | URL
  outputPath?: string | URL
  targetLocale: string
  selectors: PhraseSelector[]
}

function textSpanToString({ tspan }: SVGPhrase) {
  return tspan.join(' ')
}

function matchPairs(original: string, translation: string): string[][] {
  return [[original, translation]]
}

function replaceTextInSVG(copy: string, pairs: string[][]) {
  pairs.forEach(([original, translation]) => {
    console.log(`[translate] "${original}" => "${translation}"`)
    copy = copy.replace(original, translation)
  })
  return copy
}

export type Write = {
  original: string
  translation: string
}

export async function translateSVG<T>({ pathToFile, selectors, targetLocale }: SVGTranslationOptions<T>) {
  const file = Bun.file(pathToFile)
  const parser = new XMLParser()
  const text = await file.text()
  const data = parser.parse(text)

  // walk tree and extract nodes, transform to string, fetch translations & replace
  const selections = walk(data, selectors)
  console.log('[translations] found selections:', selections)

  let copy = text, fileName = ''

  selections.forEach(async (phrase) => {
    const { pairs, ratio, newNumberOfChars } = await translate(phrase.tspan, { targetLocale, translator: 'any' })
    copy = replaceTextInSVG(text, pairs)
    const resizedCopy = estimateFontSize(copy, ratio, newNumberOfChars)
    fileName = writeDataToSVGFile(resizedCopy)
  })

  return fileName
}
