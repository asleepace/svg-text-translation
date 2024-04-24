import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser()

/**
 * Pass in a path to an SVG file and get back the text content of the SVG file
 * as a JavaScript object.
 */
export async function extractTextFromSVG(pathToSVG: string | URL): Promise<SVGTree> {
  const file = Bun.file(pathToSVG)
  const text = await file.text()
  const data = parser.parse(text)
  // console.log('rawData', rawData)
  return data as SVGTree
}
