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

export function returnNumOrStr (arg: number): number;
export function returnNumOrStr (arg: string): string;
export function returnNumOrStr (arg: string | number): string | number {
  return typeof arg == 'number' ? 100 : `100`;
}