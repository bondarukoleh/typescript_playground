import {City, Person, Product, Employee} from "./dataTypes";

type shapeType = { name: string };

class Collection<T extends shapeType> {
  private items: Map<string, T>;

  constructor(initialItems: T[] = []) {
    this.items = new Map<string, T>();
    this.add(...initialItems);
  }

  add(...newItems: T[]): void {
    newItems.forEach(newItem => this.items.set(newItem.name, newItem));
  }

  get(name: string): T {
    return this.items.get(name);
  }

  get count(): number {
    return this.items.size;
  }

  values(): Iterator<T> {
    return this.items.values();
  }

  superValues(): IterableIterator<T> {
    return this.items.values();
  }
}

let products = [new Product("Running Shoes", 100), new Product("Hat", 25)];
let productCollection: Collection<Product> = new Collection(products);

function iterateOverIterator() {
  let iterator: Iterator<Product> = productCollection.values();
  let result: IteratorResult<Product> = iterator.next();
  while (!result.done) {
    console.log(`Product: ${result.value.name}, ${result.value.price}`);
    result = iterator.next();
  }
}

function iterateOverIterableIterator() {
  for (const product of productCollection.superValues()) {
    console.log(product)
  }
  // or
  [...productCollection.superValues()].forEach(console.log)
}

// iterateOverIterableIterator()

export {}