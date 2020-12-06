import {City, Person, Product, Employee} from "./dataTypes";

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


function restrictArgs() {
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

function indexedAccessOperator() {
  type PriceT = Product['price'];
  type AllProductT = Product[keyof Product]

  // const onlyPriceT: PriceT = "asd"; /* Type 'string' is not assignable to type 'number'. */
  // const allPriceT: AllProductT = true; /* Type 'boolean' is not assignable to type 'AllProductT'.*/

  function getValue<T, K extends keyof T>(item: T, keyName: K): T[K] {
    return item[keyName];
  }

  let p = new Product("Running Shoes", 100);
  console.log(getValue<Product, "name">(p, "name"));
  console.log(getValue(p, "price"));
  let e = new Employee("Bob Smith", "Sales");
  console.log(getValue(e, "name"));
  console.log(getValue(e, "role"));
}
// indexedAccessOperator()

function collectionIndexType() {
  class Collection<T, K extends keyof T> implements Iterable<T> {
    private items: Map<T[K], T>;

    constructor(initialItems: T[] = [], private propertyName: K) {
      this.items = new Map<T[K], T>();
      this.add(...initialItems);
    }

    add(...newItems: T[]): void {
      newItems.forEach(newItem =>
        this.items.set(newItem[this.propertyName], newItem)); /* Here we saying for the key use propertyName of the T */
    }

    get(key: T[K]): T {
      return this.items.get(key);
    }

    get count(): number {
      return this.items.size;
    }

    [Symbol.iterator](): Iterator<T> {
      return this.items.values();
    }
  }

  // let products = [new Product("Running Shoes", 100), new Product("Hat", 25)];
  // let productCollection: Collection<Product, "name"> = new Collection(products, "name");
  // console.log(`There are ${productCollection.count} products`);
  // let itemByKey = productCollection.get("Hat");
  // console.log(`Item: ${itemByKey.name}, ${itemByKey.price}`);
  let productsNameAsKey: Collection<Product, "name"> = new Collection([new Product("Hat", 25)], "name");
  console.log(productsNameAsKey.get('Hat')) // {hat, 25}
  let productsPriceAsKey: Collection<Product, "price"> = new Collection([new Product("Hat", 25)], "price");
  console.log(productsPriceAsKey.get(25)) // {hat, 25}
}

// collectionIndexType()
export {}