import { translateSVG, isTextSpan, openImagePreview, processArgs } from "./src"

// Step 1: Load the SVG file and extract the text content
const args = processArgs()

// Step 3: Translate the SVG file
const output = await translateSVG({ ...args, selectors: [isTextSpan] })

// Step 4: Open the image preview
await openImagePreview(output)
