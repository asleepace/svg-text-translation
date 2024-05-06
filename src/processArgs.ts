import { parseArgs } from "util";

export type ProgramArguments = {
  pathToFile: string
  targetLocale: string
  outputPath?: string
  fontSize?: number
}

export function processArgs(): ProgramArguments {
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
      fontSize: {
        type: 'string',
        short: 'f',
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
    fontSize: values.fontSize ? parseFloat(values.fontSize) : undefined,
  }
}