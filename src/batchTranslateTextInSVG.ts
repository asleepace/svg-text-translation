import { locales } from "./locales"
import { translateTextInSVG } from "./translateTextInSVG"
import { openImagePreview } from "./openImagePreview"
import { isTextSpan } from "./isTextSpan"
import { ProgramArguments } from "./processArgs"


export async function batchTranslateTextInSVG(args: ProgramArguments) {
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
}