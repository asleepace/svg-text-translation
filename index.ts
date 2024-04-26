import { translateSVG } from "./src"
import { isTextSpan } from "./src/selectors"
import { parseArgs } from "util";

// Step 1: Load the SVG file and extract the text content
const [_0, _1, pathToFile, ...params ] = Bun.argv

console.log('[svg-text-translation] translating', pathToFile, params)

let targetLocale = 'es'

// Step 2: Check for locale
let localeIndex = params.indexOf('--locale')
if (localeIndex !== -1) {
  targetLocale = params[localeIndex + 1]
  console.log('[svg-text-translation] target locale:', targetLocale)
}


const output = await translateSVG({
  pathToFile,
  outputPath: './output/fr_example.svg',
  targetLocale,
  selectors: [isTextSpan],
})

// console.log(output)