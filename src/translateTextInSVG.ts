import { XMLParser } from "fast-xml-parser"
import { walk } from "./walk";
import { getFileName } from "./getFileName"
import { translate } from './translate'

import { replaceWithTemplate } from "./replaceWithTemplate";

export type Transformer<T> = (node: T) => string
export type PhraseSelector = (node: unknown) => node is SVGPhrase
export type PhraseTransform = (node: SVGPhrase[]) => string[]

export type SVGTranslationOptions<T> = {
  pathToFile: string | URL
  outputPath?: string | URL
  targetLocale: string
  selectors: PhraseSelector[]
  fontSize?: number
}

export type Write = {
  original: string
  translation: string
}

export async function translateTextInSVG<T>({ pathToFile, selectors, targetLocale, outputPath, fontSize }: SVGTranslationOptions<T>) {
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

  // NOTE: this will generally only loop once, but is setup to handle multiple different
  // segments of text if needed.
  for await (const phrase of selections) {
    const { pairs, scale, numberOfDifferentCharacters } = await translate(phrase.tspan, { targetLocale, translator: 'any' })
    const newLines = pairs.map(([_, translation]) => translation)
    console.log('[translations] maxCharacterDifference:', numberOfDifferentCharacters)
    console.log('[translations] translations:', newLines)

    const calculatedFontSize = defaultFontSizeForCharacterDifference(numberOfDifferentCharacters)
    console.log('[translations] calculatedFontSize:', calculatedFontSize, fontSize)

    copy = replaceWithTemplate(copy, newLines, { fontSize: fontSize ?? calculatedFontSize })
  }

  Bun.write(fileName, copy)
  return fileName
}


function defaultFontSizeForCharacterDifference(numberOfDifferentCharacters: number): number {
  if (numberOfDifferentCharacters <= -30) return 90
  if (numberOfDifferentCharacters <= -20) return 98
  if (numberOfDifferentCharacters <= -10) return 100
  if (numberOfDifferentCharacters <= -8) return 105
  if (numberOfDifferentCharacters <= -5) return 115
  if (numberOfDifferentCharacters === 0) return 120
  if (numberOfDifferentCharacters <= 5) return 125
  if (numberOfDifferentCharacters <= 10) return 130
  return 140
 }  