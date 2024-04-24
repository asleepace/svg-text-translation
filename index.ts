import pathToSVG from './assets/example.svg'
import { extractTextFromSVG } from './src/extract'
import { isTextSpan } from './src/selectors'
import { walkTree } from './src/walkTree'
import { translate } from './src/translate'

const options = {
  ignoreAttributes: false,
  // attributeNamePrefix : "@_",
  allowBooleanAttributes: true
};

const data = await extractTextFromSVG(pathToSVG, options)

walkTree(data, async (node) => {

  if (!isTextSpan(node)) return // skip if not a text span

  node.tspan = await translate(node.tspan)
})


console.log('finished!')