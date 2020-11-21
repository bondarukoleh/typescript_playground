import {sum, runAsync, weirFunc} from './calc'
import * as inquirer from "inquirer";

function tryFewThings() {
  function printMsg(message: string): void {
    console.log(`This is your message asdasd: "${message}"`);
  }

  const msg = 'Hello TypeScript';
  printMsg(msg);

  const addresses = new Map<string, string>();
  addresses.set('Bob', 'Paris');
  addresses.forEach((name: string, city: string) => console.log(`${name} lives in ${city}`));

  const result = sum(1, 2);
  console.log(result);

  runAsync().then(console.log)

  const res: string | number | null = weirFunc(1) as string;
  console.log(res.toString());
}

function checkUnknown() {
  let someVar: unknown = weirFunc(1);
  let num: number;
  // num = someVar; /* Error Type 'unknown' is not assignable to type 'number' */
  num = someVar as number /* type assertion */

  if (typeof someVar == 'number') { /* type guard */
    num = someVar;
  }
}
// checkUnknown()

function checkNull() {
  let someVar: string | number = weirFunc(0)!;
  console.log(someVar)

  // const num: number = null;
  // const num1: number = undefined;
}
checkNull()

