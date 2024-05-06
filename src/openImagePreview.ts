import { $ } from 'bun'

/**
 * This function will open the image preview of the file path provided.
 */
export function openImagePreview(filePath: string | URL) {
  console.log('[svg-text-translation] output:', filePath)
  return $`open ${filePath}`
}
