




export async function translate(phrase: string[]): Promise<string[]> {
  const arity = phrase.length
  const sentence = phrase.join(' ')
  console.log('[translate] translating phrase: "', sentence, `" (${arity} words)`)

  const output = new Array(arity).fill('translated')
  return output
}