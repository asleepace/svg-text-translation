import { parseArgs } from "util";


export function processArgs() {
  const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
      locale: {
        type: 'string',
        short: 'l',
      },
      outputPath: {
        type: 'string',
        short: 'o'
      },
      verbose: {
        type: 'boolean',
        short: 'v',
      }
    },
    strict: true,
    allowPositionals: true,
  });

  if (!values.verbose) {
    console.log = () => {}
  }

  if (!values.locale) {
    throw new Error('Missing required argument: --locale')
  }

  const [_0, _1, pathToFile] = positionals

  return {
    pathToFile,
    targetLocale: values.locale,
    outputPath: values.outputPath,
  }
}