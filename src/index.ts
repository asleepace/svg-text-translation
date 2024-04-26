import { XMLParser } from "fast-xml-parser"
import { isTextSpan } from "./selectors";
import { walk, Selector } from "./walk";
import { fetchTranslations } from "./translate";
import { estimateFontSize } from "./estimateFontSize";
import { writeDataToSVGFile } from "./writeDataToSVG";
import { getFileName } from "./getFileName";
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

export async function translateSVG<T>({ pathToFile, selectors, targetLocale, outputPath }: SVGTranslationOptions<T>) {
  const file = Bun.file(pathToFile)
  const parser = new XMLParser()
  const text = await file.text()
  const data = parser.parse(text)

  // walk tree and extract nodes, transform to string, fetch translations & replace
  const selections = walk(data, selectors)
  console.log('[translations] found selections:', selections)

  // Generate output file name
  const fileName = getFileName({ pathToFile, outputPath, targetLocale })

  // copy of the original text and output file name
  let copy = text

  for await (const phrase of selections) {
    const { pairs, ratio, newNumberOfChars } = await translate(phrase.tspan, { targetLocale, translator: 'any' })
    copy = replaceTextInSVG(text, pairs)
    copy = estimateFontSize(copy, ratio, newNumberOfChars)
  }

  Bun.write(fileName, copy)

  return fileName
}
