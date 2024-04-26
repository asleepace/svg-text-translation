
export type TranslationResult = {
  data: Translations
}

export type Translations = {
  translations: string[]
}

const HEADERS = {
  'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
  'Content-Type': 'application/json',
  'Accept': '*/*',
}

/**
 * Fetch translations from the rosetta API for a given string, target locale and translator.
 */
export async function fetchTranslations(message: string, options = { targetLocale: 'fr', translator: 'any' }): Promise<string> {
  const response = await fetch('https://rosetta.padlet.com/translations/2/batch-translate', {
    headers: HEADERS,
    method: 'POST',
    body: JSON.stringify({
      "tasks": [{ message }],
      ...options,
    })
  })

  console.log("[translation] status:", response.status)
  const { data } = await response.json() as TranslationResult
  const [firstTranslation] = data.translations
  return firstTranslation
}