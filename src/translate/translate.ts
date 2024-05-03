import { fetchTranslations } from "./fetchTranslations"
import { findBestFit } from "../logic/findBestFit"

export type TranslationTask = {
  message: string
  args?: Record<string, string>
}

export type TranslationBatch = {
  tasks: TranslationTask[]
  targetLocale: string
  translator: 'human' | 'machine' | 'any'
}

/**
 * Translates an array of words into another language, and attempts to match pairs of words
 * between the original and translated phrases.
 */
export async function translate(phrase: string[], options: Partial<TranslationBatch>) {
  const arity = phrase.length
  const sentence = phrase.join(' ').trim()

  console.log("+ - ".repeat(20))
  console.log("[translate] translating ", sentence)

  const translation = await fetchTranslations(sentence, {
    targetLocale: 'fr',
    translator: 'any',
    ...options,
  })

  const translatedWords = translation.split(' ')
  const translatedSentence = translatedWords.join(' ')

  const output = findBestFit({ currentWords: translatedWords, targetSizes: phrase.map((word) => word.length) })
  console.log("[translate] best fit: ", output)

  const pairs = phrase.map((word, index) => [word, output[index]])

  console.log('[translation] original length: ', sentence.length)
  console.log('[translation] translated length: ', translatedSentence.length)

  const ratio = sentence.length / translatedSentence.length
  console.log('[translation] ration: ', ratio)


  // const pairs = phrase.map((word, index) => {

  //   let numberOfCharactersToMatch = word.length
  //   let replacement = translatedWords.shift()

  //   if (!replacement) {
  //     console.warn("[translate] no translation found for ", word)
  //     return [word, ""]
  //   }

  //   while (replacement.length < numberOfCharactersToMatch) {
  //     console.log("[translate] trying to match ", [word, replacement])
  //     const nextWord = translatedWords.shift()
  //     if (!nextWord) return [word, replacement]
  //     replacement += ` ${nextWord}`
  //   }

  //   return [word, replacement]
  // })

  return {
    pairs,
    ratio,
    originalLength: sentence.length,
    translatedLength: translatedSentence.length,
    newNumberOfChars: (translatedSentence.length - sentence.length) * ratio,
  }
}