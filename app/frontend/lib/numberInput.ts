export function numberInput (input: string | undefined): number | undefined {
  if (input === undefined || (typeof input === 'string' && input.trim() === '')) {
    return undefined
  }
  return Number(input)
}
