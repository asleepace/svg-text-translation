import { XMLParser, validationOptions as ValidationOptions } from 'fast-xml-parser'

const parser = new XMLParser()

/**
 * Pass in a path to an SVG file and get back the text content of the SVG file
 * as a JavaScript object.
 */
export async function extractTextFromSVG(pathToSVG: string | URL, options?: ValidationOptions) {
  const file = Bun.file(pathToSVG)
  const text = await file.text()
  const data = parser.parse(text, options)
  // console.log('rawData', rawData)
  return { data, text } as { data: SVGTree, text: string }
}
