import { openImagePreview } from "./src/openImagePreview"
import { translateTextInSVG } from "./src/translateTextInSVG"
import { processArgs } from "./src/processArgs"
import { isTextSpan } from "./src/isTextSpan"
import { locales } from "./src/locales"

//  Process Arguments
//
//  This function will parse the command line arguments and return the result, a sample command
//  may look like the following:
//
//  bun run translate ./assets/example.svg --locale all
//
const args = processArgs()


//  Translate All
// 
//  if the targetLocale is 'all', then we will translate the SVG file to all supported locales
//  this process may take a while. This will also open all the images at the end in the browser
//  which may be overwhelming. 
//
if (args.targetLocale === 'all') {

  const operations = locales.map(async ({ locale: targetLocale, fontSize }) => {
    const output = await translateTextInSVG({ ...args, targetLocale, fontSize, selectors: [isTextSpan] })
    return openImagePreview(output)
  })

  const result = await Promise.allSettled(operations)
  result.forEach((task, index) => {
    if (task.status === 'fulfilled') return
    const option = locales[index]
    console.error(`[error] failed translating to ${option.language} (${option.locale})`, task.reason)
  })

//  Single Translation
//  If the targetLocale is not 'all', then we will translate the SVG file to the target locale
//  and open the image in the browser
} else {
  const output = await translateTextInSVG({ ...args, selectors: [isTextSpan] })
  await openImagePreview(output)
}

//  Exit the process
console.log('finished!')
process.exit(0)