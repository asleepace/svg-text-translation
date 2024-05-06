import { XMLParser } from "fast-xml-parser"
import { walk } from "../logic/walk";
import { estimateFontSize } from "../text/estimateFontSize"
import { getFileName } from "../utilities/getFileName";
import { replaceTextInSVG } from "../text/replaceTextInSVG"
import { translate } from './translate'

import { replaceWithTemplate } from "../text/replaceWithTemplate";
import { origin } from "bun";

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

export async function translateSVG<T>({ pathToFile, selectors, targetLocale, outputPath, fontSize }: SVGTranslationOptions<T>) {
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
    const { pairs, scale } = await translate(phrase.tspan, { targetLocale, translator: 'any' })

    const newLines = pairs.map(([_, translation]) => translation)
    const maxCharacterDifference = pairs.map(([original, translation]) => {
      return Math.abs(original.length - translation.length)
    }).reduce((a, b) => Math.max(a, b), 0)

    console.log('[translations] maxCharacterDifference:', maxCharacterDifference)
    console.log('[translations] translations:', newLines)

    const calculatedFontSize = defaultFontSizeForCharacterDifference(maxCharacterDifference)
    console.log('[translations] calculatedFontSize:', calculatedFontSize)

    copy = replaceWithTemplate(copy, newLines, { fontSize: fontSize ?? calculatedFontSize })
    // copy = replaceTextInSVG(text, pairs)
    // copy = estimateFontSize(copy, pairs, fontScale)
  }

  Bun.write(fileName, copy)
  return fileName
}


function defaultFontSizeForCharacterDifference(numberOfDifferentCharacters: number): number {
  if (numberOfDifferentCharacters === 0) return 120
  if (numberOfDifferentCharacters <= 2) return 118
  if (numberOfDifferentCharacters <= 4) return 112
  if (numberOfDifferentCharacters <= 6) return 104
  if (numberOfDifferentCharacters <= 8) return 100
  if (numberOfDifferentCharacters <= 10) return 98
  if (numberOfDifferentCharacters <= 12) return 96
  return 95
}