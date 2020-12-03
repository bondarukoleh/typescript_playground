#Advanced Generic Types
###Generic Collections
TypeScript provides support for using the JavaScript collections with generic type parameters, allowing a generic class
to safely use collections

|Name|Description|
|:---|:---|
|Map< K, V >|This describes a Map whose key type is K and whose value type is V.|
|ReadonlyMap< K, V >|This describes a Map that cannot be modified.|
|Set< T>|This describes a Set whose value type is T.|
|ReadonlySet< T>|This describes a Set that cannot be modified.|

```typescript
class DataCollection<T> {
  private items: Set<T>;
  constructor(initialCollection:T[] = []) {
    this.items = new Set<T>(initialCollection)
  };
  add(...newItems: T[]): void {
    newItems.forEach(newItem => this.items.add(newItem));
  }
  get(name: string): T {
    return [...this.items.values()].find(item => item.name === name);
  }
  get count(): number {
    return this.items.size;
  }
}
```
###Generic Iterators
iterators allow a sequence of values to be enumerated, and support for iterators is a common feature for classes that
operate on other types, such as collections. TypeScript provides the interfaces:

|Name|Description|
|:---|:---|
|Iterator<T>| This interface describes an iterator whose next method returns IteratorResult<T> objects.|
|IteratorResult<T>| This interface describes a result produced by an iterator, with done and value properties.|
|Iterable<T>| This interface defines an object that has a Symbol.iterator property and that supports iteration directly.|
|IterableIterator<T>| This interface combines the Iterator<T> and Iterable<T> interfaces to describe an object that has a Symbol.iterator property and that defines a next method and a result property.|

```typescript
class DataCollection<T> {
  private items: Map<string, T>;
  ...
  values(): Iterator<T> {
    return this.items.values();
  }
}
let productCollection: Collection<Product> = new Collection([new Product("Running Shoes", 100), new Product("Hat", 25)]);
let iterator: Iterator<Product> = productCollection.values();
let result: IteratorResult<Product> = iterator.next();
while (!result.done) {
  console.log(`Product: ${result.value.name}, ${ result.value.price}`);
  result = iterator.next();
}
```

>Iterators were introduced in the ES6 standard. If you use iterators in your project and are targeting earlier
> versions of JS, then you must set the TypeScript downlevelIteration compiler property to true.

####Combining an Iterable and an Iterator
With `IterableIterator<T>` you can iterate in more common manner.
```typescript
class DataCollection<T> {
  private items: Map<string, T>;
  ...
  values(): IterableIterator<T> {
    return this.items.values();
  }
}
let productCollection: Collection<Product> = new Collection([new Product("Running Shoes", 100), new Product("Hat", 25)]);
for (const product of productCollection.values()) {
  console.log(product)
}
// or
[...productCollection.values()].forEach(p => console.log(`Product: ${p.name}, ${ p.price}`));
```

####Iterable Class
Classes that define a Symbol.iterator property can implement the `Iterable<T>` interface
```typescript
class Collection<T extends shapeType> implements Iterable<T> {
  [Symbol.iterator](): Iterator<T> {
    return this.items.values();
  }
}
/*...*/
[...productCollection].forEach(p => console.log(`Product: ${p.name}, ${ p.price}`));
```

###Using Index Types
The `Collection<T>` class restricts the types it can accept using a shape type. TypeScript provides a set of related
features that allow any property defined by an object to be used as a key while preserving type safety.
####Using the Index Type Query
The `keyof` keyword, known as the _index type query operator_, returns a union of the property names of a type,
using the literal value type feature. \
The type annotation for the myVar variable is `keyof Product`, which will be the **union** of the property keys (names)
defined by the Product class/type, myVar can be assigned only the values that are keys in specified type.
```typescript
type SomeType = {
  keyName1: string,
  keyName2: number
}

let keyOfSomeTypeOnly: keyof SomeType;
keyOfSomeTypeOnly = "keyName1";
keyOfSomeTypeOnly = "keyName2";
// keyOfSomeTypeOnly = "keyName3"; /* Error: Type '"keyName3"' is not assignable to type '"keyName1" | "keyName2"'. */
```
The `keyof` keyword can be used to narrow generic type parameters so that they can only be typed to match the properties
of another type.
```typescript
function getValue<T, K extends keyof T>(item: T, keyname: K) {
  console.log(`Value: ${item[keyname]}`);
}
let p = new Product("Running Shoes", 100);
getValue(p, "name");
getValue(p, "price");
let e = new Employee("Bob Smith", "Sales");
getValue(e, "name");
getValue(e, "role");
```

####Explicitly Providing Generic Type Parameters for Index Types