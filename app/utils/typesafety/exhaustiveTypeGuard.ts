export const exhaustiveTypeGuard = (input: never) => {
  throw new Error(`unexpected default fallback for type ${input}`)
}