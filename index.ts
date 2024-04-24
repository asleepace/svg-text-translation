import pathToSVG from './assets/example.svg'
import { extractTextFromSVG } from './src/extract'
import { isTextSpan } from './src/selectors'
import { walkTree } from './src/walkTree'
import { translate } from './src/translate'
import { XMLBuilder } from 'fast-xml-parser'
import { XMLParser, validationOptions as ValidationOptions } from 'fast-xml-parser'

const parser = new XMLParser()

function writeDataToSVGFile(data: string) {
  Bun.write(`./generated/translated_fr_${+new Date}.svg`, data)
}

function replaceTextInSVG(copy: string, pairs: string[][]) {
  pairs.forEach(([original, translation]) => {
    console.log(`[translate] "${original}" => "${translation}"`)
    copy = copy.replace(original, translation)
  })
  return copy
}

function estimatedNewFontSize(copy: string, ratio: number, newNumberOfChars: number) {
  const fontSizeRegex = new RegExp(/font-size="(.*?)"/)
  const originalFontSize = copy.match(fontSizeRegex)
  if (originalFontSize && originalFontSize.length > 1) {
    const newFontSize = (+originalFontSize[1] * ratio) + newNumberOfChars
    console.log('newFontSize', newFontSize)
    copy = copy.replace(fontSizeRegex, `font-size="${newFontSize}"`)
  }
  return copy
}

const options = {
  ignoreAttributes: false,
  // attributeNamePrefix : "@_",
  allowBooleanAttributes: true
};

// Step 1: Load the SVG file and extract the text content
const { data, text } = await extractTextFromSVG(pathToSVG, options)

// Step 2: Walk the SVG tree and find text spans
const results = await walkTree(data, async (node) => {

  if (!isTextSpan(node)) return // skip if not a text span

  return node.tspan

  // Step 3: Translate the text span and attempt to match word lengths
  const { pairs, ratio, newNumberOfChars } = await translate(node.tspan, { targetLocale: 'fr' })

  // Step 4: Replace the text in the SVG file
  const copy = replaceTextInSVG(text, pairs)

  // Step 5: Resize the font size based on the new number of characters
  const resizedCopy = estimatedNewFontSize(copy, ratio, newNumberOfChars)

  // Step 6: Write the new SVG file to disk
  writeDataToSVGFile(resizedCopy)
})

console.log('results', results)