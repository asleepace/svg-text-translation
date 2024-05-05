import { XMLParser } from "fast-xml-parser"
import { walk } from "../logic/walk";
import { estimateFontSize } from "../text/estimateFontSize"
import { getFileName } from "../utilities/getFileName";
import { replaceTextInSVG } from "../text/replaceTextInSVG"
import { translate } from './translate'

export type Transformer<T> = (node: T) => string
export type PhraseSelector = (node: unknown) => node is SVGPhrase
export type PhraseTransform = (node: SVGPhrase[]) => string[]

export type SVGTranslationOptions<T> = {
  pathToFile: string | URL
  outputPath?: string | URL
  targetLocale: string
  selectors: PhraseSelector[]
  fontScale?: number
}

export type Write = {
  original: string
  translation: string
}

export async function translateSVG<T>({ pathToFile, selectors, targetLocale, outputPath, fontScale }: SVGTranslationOptions<T>) {
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
    const { pairs } = await translate(phrase.tspan, { targetLocale, translator: 'any' })
    copy = replaceTextInSVG(text, pairs)
    copy = estimateFontSize(copy, pairs, fontScale)
  }

  Bun.write(fileName, copy)

  return fileName
}

