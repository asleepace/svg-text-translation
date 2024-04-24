
export type TranslationTask = {
  message: string
  args?: Record<string, string>
}

export type TranslationBatch = {
  tasks: TranslationTask[]
  targetLocale: string
  translator: 'human' | 'machine' | 'any'
}

export type TranslationResult = {
  data: Translations
}

export type Translations = {
  translations: string[]
}

export async function fetchTranslations(message: string, options = { targetLocale: 'fr', translator: 'any' }): Promise<string> {
  const response = await fetch('https://rosetta.padlet.com/translations/2/batch-translate', {
    headers: { 
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      'Content-Type': 'application/json',
      'Accept': '*/*',
    },
    method: 'POST',
    body: JSON.stringify({
      "tasks": [{ message }],
      ...options,
    })
  })

  console.log(`[translation] status: ${response.status} ${response}`)
  const { data } = await response.json() as TranslationResult
  console.log(`[translation] data: `, data?.translations)
  const [firstTranslation] = data.translations
  return firstTranslation
}


export async function translate(phrase: string[], options: Partial<TranslationBatch>): Promise<string[]> {
  const arity = phrase.length
  const sentence = phrase.join(' ').trim()

  console.log("+ - ".repeat(20))
  console.log(`[translate] translating "${sentence}"\n`)

  const translation = await fetchTranslations(sentence, {
    targetLocale: 'fr',
    translator: 'any',
    ...options,
  })

  const translatedWords = translation.split(' ')

  return phrase.map((word, index) => {

    let numberOfCharactersToMatch = word.length
    
    let replacement = translatedWords.shift()

    if (!replacement) {
      console.warn(`[translate] no translation found for "${word}"`)
      return ''
    }

    while (replacement.length < numberOfCharactersToMatch) {
      console.log(`[translate] trying to match "${word}" with "${replacement}"`)
      const nextWord = translatedWords.shift()
      if (!nextWord) return replacement
      replacement += ` ${nextWord}`
    }

    return replacement
  })
}