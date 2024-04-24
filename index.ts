import logo from './assets/example.svg'
import { extractTextFromSVG } from './src/extract'
import { isTextSpan } from './src/selectors'
import { walkTree } from './src/walkTree'
import { translate } from './src/translate'

const file = Bun.file(logo)
const text = await file.text()

const data = extractTextFromSVG(text)

walkTree(data, (node) => {
  if (isTextSpan(node)) {
    console.log('found text span', node)

    node.tspan = ["Heche Bonita", "Padlets", "esta", "todo bien!"]
  }
})

walkTree(data, (node) => {

  if (isTextSpan(node)) {
    translate(node.tspan)
  }
})

console.log('finished!')