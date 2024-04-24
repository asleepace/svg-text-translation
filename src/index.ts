import { XMLParser } from "fast-xml-parser"
import { isTextSpan } from "./selectors";
import { walk, Selector } from "./walk";
import { fetchTranslations } from "./translate";

export type Transformer<T> = (node: T) => string

export type SVGTranslationOptions<T> = {
  pathToFile: string | URL
  outputPath?: string | URL
  targetLocale: string
  process: Process<T>
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

export type Process<A, B extends A> = [
  (node: unknown) => node is A,
  (nodes: B[], index?: number) => string,
  (phrase: string) => Promise<string>,
  () => string
]

export async function translateSVG<T>({ pathToFile, process, targetLocale }: SVGTranslationOptions<T>) {
  const file = Bun.file(pathToFile)
  const parser = new XMLParser()
  const text = await file.text()
  const data = parser.parse(text)

  // walk tree and extract nodes, transform to string, fetch translations & replace
  const [selectors, transformers, translators, writers] = process
  const selections = walk(data, [selectors])
  const [original] = selections.map<string>(transformers)

  console.log(original)

  const translations = await translators(original, { targetLocale, translator: 'any' })


  return selections
}


translateSVG({
  pathToFile: './assets/example.svg',
  outputPath: './output/fr_example.svg',
  targetLocale: 'fr',
  process: [
    isTextSpan,
    textSpanToString,
    fetchTranslations,
    matchPairs,
  ],
})