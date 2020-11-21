export function sum(a: number, b: number): number {
  return a + b;
}

export function someFunc(arg: any) {
  return arg;
}

export async function runAsync(): Promise<string> {
  debugger;
  return `Pinky promise`;
}

export const weirFunc = (arg: string | number): string | number | null => {
  if (arg === 0) {
    return null;
  }
  return typeof arg === 'string' ? 'some' : 1;
}