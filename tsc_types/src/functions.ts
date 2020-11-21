export function calculateTax(arg1 = false, arg2, format, message?: string, ...rest): number | string {
  const res = arg1 + arg2;
  return format ? res : `${res} ${message}`
}

export const someFunc = (...rest): boolean | undefined => {
  if (rest.length) {
    console.log('This is rest params')
    console.log(rest)
    return true
  }
  return undefined;
}