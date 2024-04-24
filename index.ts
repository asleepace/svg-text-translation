import pathToSVG from './assets/example.svg'
import { extractTextFromSVG } from './src/extract'
import { isTextSpan } from './src/selectors'
import { walkTree } from './src/walkTree'
import { translate } from './src/translate'
import { XMLBuilder } from 'fast-xml-parser'
import { XMLParser, validationOptions as ValidationOptions } from 'fast-xml-parser'

const parser = new XMLParser()


async function main() {
  const options = {
    ignoreAttributes: false,
    // attributeNamePrefix : "@_",
    allowBooleanAttributes: true
  };

  const file = Bun.file(pathToSVG)
  const text = await file.text()
  const data = parser.parse(text, options)

  walkTree(data, async (node) => {

    if (!isTextSpan(node)) return // skip if not a text span

    const { pairs, ratio } = await translate(node.tspan, { targetLocale: 'fr' })

    let copy = text

    pairs.forEach(([original, translation]) => {
      console.log(`[translate] "${original}" => "${translation}"`)
      copy = copy.replace(original, translation)
    })

    // console.log(copy)
    const fontSizeRegex = new RegExp(/font-size="(.*?)"/)

    const originalFontSize = copy.match(fontSizeRegex)

    if (originalFontSize && originalFontSize.length > 1) {
      const newFontSize = +originalFontSize[1] * ratio
      console.log('newFontSize', newFontSize)
      copy = copy.replace(fontSizeRegex, `font-size="${newFontSize}"`)
    }
    
    console.log('originalFontSize', originalFontSize)

    // Bun.write(`output_${+new Date}.svg`, copy)
  })
}



main()