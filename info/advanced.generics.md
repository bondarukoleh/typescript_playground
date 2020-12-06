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
We will set the types of method. `getValue<Product, "name">(p, "name");`, `<Product, "name">` _name_ is **Literal value type**
specifies one of the `keyof Product` types and is used by the compiler for type checking. `(p, "name")` _name_ is string
*value* used by the JavaScript runtime when the code is executed.
```typescript
function getValue<T, K extends keyof T>(item: T, keyname: K) {
  console.log(`Value: ${item[keyname]}`);
}
let p = new Product("Running Shoes", 100);
getValue<Product, "name">(p, "name");
```

####Using the Indexed Access Operator
We can use indexed access operator to **get the type** of one or more properties.
```typescript
type PriceT = Product['price'];
// const onlyPriceT: PriceT = "asd"; /* Type 'string' is not assignable to type 'number'. */
type AllProductT = Product[keyof Product]
// const allPriceT: AllProductT = true; /* Type 'boolean' is not assignable to type 'AllProductT'.*/
```
The `keyof Product` expression returns a _literal value type union_ with the property names defined by the Product class,
`"name" | "price"`. The indexed access operator returns the _union of the types_ of those properties, such that 
`Product[keyof Product]` is `string | number`, which is the union of the types of the name and price properties.
>The types returned by the indexed access operator are known as lookup types.

```typescript
function getValue<T, K extends keyof T>(item: T, keyName: K): T[K] {
    return item[keyName];
  }
let p = new Product("Running Shoes", 100);
export const productName = getValue<Product, "name">(p, "name"));
/* because function returns T[K] and we provided the generic type parameters compiler understands it as */
export declare const productName: string;
```

####Using an Index Type for the Collection<T> Class
Allows me to change the `Collection<T>` class to store object of any type specified by user, and use a any object key as
a key to get the object. So it's **super flexible**.
```typescript
class Collection<T, K extends keyof T> implements Iterable<T> {
    private items: Map<T[K], T>; /* Means Map<string, Product> */
    constructor(initialItems: T[] = [], private propertyName: K) { /* it's Product[] and "name" | "price" */
      this.items = new Map<T[K], T>();
      this.add(...initialItems);
    }
    add(...newItems: T[]): void {
      newItems.forEach(newItem => this.items.set(newItem[this.propertyName], newItem)); /* Here we saying for the key use propertyName of the T */
    }
    get(key: T[K]): T { /* (ket: string): Product */
      return this.items.get(key);
    }
    [Symbol.iterator](): Iterator<T> {
      return this.items.values();
    }
  }

let productsNameAsKey: Collection<Product, "name"> = new Collection([new Product("Hat", 25)], "name");
console.log(productsNameAsKey.get('Hat')) // {hat, 25}
let productsPriceAsKey: Collection<Product, "price"> = new Collection([new Product("Hat", 25)], "price");
console.log(productsPriceAsKey.get(25)) // {hat, 25}
```

###Using Type Mapping