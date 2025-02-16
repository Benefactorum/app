export function numberInput (input: string): number | undefined {
  if (input.trim() === '') {
    return undefined
  }
  return Number(input)
}
