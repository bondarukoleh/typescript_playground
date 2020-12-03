import { City, Person, Product, Employee } from "./dataTypes";
let myVar: keyof Product;
myVar = "price";
// myVar = "someOtherName";

type SomeType = {
  keyName1: string,
  keyName2: number
}

let keyOfSomeTypeOnly: keyof SomeType;
keyOfSomeTypeOnly = "keyName1";
keyOfSomeTypeOnly = "keyName2";
// keyOfSomeTypeOnly = "keyName3"; /* Type '"keyName3"' is not assignable to type '"keyName1" | "keyName2"'. */


function restrictArgs(){
  function getValue<T, K extends keyof T>(item: T, keyName: K) {
    console.log(`Value: ${item[keyName]}`);
  }
  let p = new Product("Running Shoes", 100);
  getValue(p, "name");
  getValue(p, "price");
  let e = new Employee("Bob Smith", "Sales");
  getValue(e, "name");
  getValue(e, "role");
}

export {}