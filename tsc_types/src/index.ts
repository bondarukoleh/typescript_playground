import {sum, runAsync, weirFunc} from './calc'
import {someFunc, calculateTax, returnNumOrStr} from './functions'
import * as arrays from './arrays';
import * as types from './types';
import * as objects from './objects';
import * as classesConstructor from './classes/constructor.func';
import * as classes from './classes/classes';
import * as inheritance from './classes/inheritanse';
import * as abstract from './classes/abstract';
import * as interfaces from './classes/interfaces';
import * as generics from './generics';
import * as decorators from './decorators'

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

  if (typeof someVar === 'number') { /* type guard */
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
// checkNull()

const tscImplicitAssertions = () => {
  function calculateSomeTax(amount: number) {
    return amount * 1.2;
  }

  function dumb(arg: any): any {
    return arg.toFixed();
  }
  const price = 100;
  const taxAmount = calculateSomeTax(price);

  const res = dumb("qwe");
  const reset: number = res;
}
// tscImplicitAssertions()

function checkArgs () {
  someFunc();
}
// checkArgs();

function checkOverLoaded() {
  const num: number = returnNumOrStr(1);
  const str: string = returnNumOrStr("");
}

function runEverything(){
  console.log(arrays, objects, classesConstructor, classes, inheritance, abstract, interfaces, generics)
}

function tryDecorators() {
  const {SomeClass} = decorators;
  const someClass = new SomeClass();
  someClass.someMethod('asd', {a: 123});
  someClass.otherMethod();
}
tryDecorators();
