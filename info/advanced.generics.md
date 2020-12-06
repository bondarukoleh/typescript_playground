# Advanced Generic Types
### Generic Collections
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
### Generic Iterators
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

#### Combining an Iterable and an Iterator
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

#### Iterable Class
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

### Using Index Types
The `Collection<T>` class restricts the types it can accept using a shape type. TypeScript provides a set of related
features that allow any property defined by an object to be used as a key while preserving type safety.
#### Using the Index Type Query
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

#### Explicitly Providing Generic Type Parameters for Index Types
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

#### Using the Indexed Access Operator
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

#### Using an Index Type for the Collection<T> Class
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

### Using Type Mapping
Mapped types are created by applying a transformation to the properties of an existing type. \
Type mapping is an expression that selects property names to be included in the mapped type and the type for each of them.
`[T in keyof Product]` name selector, `Product[T]` - type selector. The property name selector defines a type parameter,
named `T`, and uses the `in` keyword to enumerate the types in a literal value union. The type union can be expressed
directly, such as `"name"|"price"`, or obtained using keyof. \
The TS compiler creates a new property in the mapped type for each of the types in the union. The type of each property
is determined by the type selector, which can be obtained from the source type using the indexed access operator with 
`T` as the literal value type to look up.
```typescript
type MappedProduct = {
    [T in keyof Product]: Product[T]
  };
let p: MappedProduct = {name: "Kayak", price: 275};
```
The `MappedProduct` type uses `keyof` to select the properties defined by the `Product` class and uses the indexed type
operator to get the type of each of those properties. The result is equivalent to this type:
```typescript
type MappedProduct = {
  name: string;
  price: number;
}
```

#### Using a Generic Type Parameter with a Mapped Type
Mapped types become more useful when they define a generic type parameter, which allows the transformation they describe
to be applied to a broader range of types.
```typescript
type Mapped<T> = {
  [P in keyof T]: T[P]
};

let p: Mapped<Product> = {name: "Kayak", price: 275};
let c: Mapped<City> = {name: "London", population: 8136000};
```

Mapping operates only on properties. When applied to a class, a type mapping produces a `shape type` that contains
properties but omits the constructor and the implementation of methods. 
```typescript
class MyClass {
  constructor(public name: string ) {}
  getName(): string {return this.name;}
}
type Mapping<T> = {
  name: string;
  getName: () => string;  
}
```
Type mapping produces shapes that can be used for object literals, implemented by classes, or extended by interfaces.
Type mapping does not produce a class, however.

#### Changing Property Optionality and Mutability
Mapped types can change properties to make them optional or required and to add or remove the `readonly` keyword
```typescript
type MakeOptional<T> = {
  [P in keyof T]?: T[P]
};
type MakeRequired<T> = {
  [P in keyof T]-?: T[P]
};
type MakeReadOnly<T> = {
  readonly [P in keyof T]: T[P]
};
type MakeReadWrite<T> = {
  -readonly [P in keyof T]: T[P]
};

type optionalType = MakeOptional<Product>;
type requiredType = MakeRequired<optionalType>;
type readOnlyType = MakeReadOnly<requiredType>;
type readWriteType = MakeReadWrite<readOnlyType>;
let p: readWriteType = {name: "Kayak", price: 275};
console.log(`Mapped type: ${p.name}, ${p.price}`);
```
the `?` character after `[P in keyof T]?` (name selector) make the properties in the mapped type *optional* \
the `-?` in `[P in keyof T]-?` used to make properties required \
read-only and read-write by preceding the name selector with `readonly` and `-readonly`. \
Mapped types change **all** properties defined by the type they transform, `MakeOptional<T>` is equivalent to:
```typescript
type optionalType = {
  name?: string;
  price?: number;
}
```
The types produced by mappings can be fed into other mappings, creating a **chain of transformations**.
TypeScript provides built-in mapped types, so they can be changed with:

|Name|Description|
|:---|:---|
|`Partial<T>`| this mapping makes properties optional|
|`Required<T>`| required|
|`Readonly<T>`| you've got it|
|`Pick<T, K>`| selects specific properties to create a new type|
|`Record<T, K>`| creates a type without transforming an existing one|

```typescript
type optionalType = Partial<Product>;
type requiredType = Required<optionalType>;
type readOnlyType = Readonly<requiredType>;
type MakeReadWrite<T> = { /* There no type build-in type for removing readonly */
  -readonly [P in keyof T] : T[P]
};
type readWriteType = MakeReadWrite<readOnlyType>;
let p: readWriteType = { name: "Kayak", price: 275};
```

#### Mapping Specific Properties
The index type query for a mapped type can be expressed as a generic type parameter, which can then be used to select
specific properties to map by name
```typescript
type SelectProperties<T, K extends keyof T> = {
  [P in K]: T[P]
};
let p1: SelectProperties<Product, "name"> = {name: "Kayak"};
let p2: Pick<Product, "name" | "price"> = {name: "Lifejacket", price: 48.95};
console.log(`Custom mapped type: ${p1.name}`);
console.log(`Built-in mapped type: ${p2.name}, ${p2.price}`);
```

#### Combining Transformations in a Single Mapping
```typescript
type CustomMapped<T, K extends keyof T> = {
  readonly [P in K]?: T[P]
};
type BuiltInMapped<T, K extends keyof T> = Readonly<Partial<Pick<T, K>>>;
let p1: CustomMapped<Product, "name"> = {name: "Kayak"};
let p2: BuiltInMapped<Product, "name" | "price"> = {name: "Lifejacket", price: 48.95};
console.log(`Custom mapped type: ${p1.name}`);
console.log(`Built-in mapped type: ${p2.name}, ${p2.price}`);
```

#### Creating Types with a Type Mapping
The final feature provided by type mappings is the ability to create new types, rather than transform a specific one
```typescript
type CustomMapped<K extends keyof any, T> = {
  [P in K]: T
};
let p1: CustomMapped<"name" | "city", string> = {name: "Bob", city: "London"};
// or we can use build in Record
let p2: Record<"name" | "city", string> = {name: "Alice", city: "Paris"};
console.log(`Custom mapped type: ${p1.name}, ${p1.city}`);
console.log(`Built-in mapped type: ${p2.name}, ${p2.city}`);
```

### Using Conditional Types
Conditional types are expressions containing generic type parameters that are evaluated to select new types
`<T extends boolean>` - type parameter, `T extends true` - expression, `string : number` - result types.
A conditional type is a placeholder for one of its result types, which isn’t chosen until the generic type
parameter is used, which allows the expression to be evaluated using one of the result types selected.
```typescript
type resultType<T extends boolean> = T extends true ? string : number;
let firstVal: resultType<true> = "String Value";
let secondVal: resultType<false> = 100;
// let mismatchCheck: resultType<false> = "String Value"; /* Type 'string' is not assignable to type 'number'. */
```
#### Nesting Conditional Types
```typescript
type references = "London" | "Bob" | "Kayak";
type nestedType<T extends references> = T extends "London" ? City : T extends "Bob" ? Person : Product;
let firstVal: nestedType<"London"> = new City("London", 8136000);
let secondVal: nestedType<"Bob"> = new Person("Bob", "London");
let thirdVal: nestedType<"Kayak"> = new Product("Kayak", 275);
```

#### Conditional Types in Generic Classes
Conditional types can be used to express the relationship between a method or function’s parameter types and the results
it produces. This is a more concise alternative to the function type overloading.
```typescript
type resultType<T extends boolean> = T extends true ? string : number;
class Collection<T> {
  private items: T[];
  constructor(...initialItems: T[]) {
    this.items = initialItems || [];
  }
  total<P extends keyof T, U extends boolean>(propName: P, format: U): resultType<U> {
    let totalValue = this.items.reduce((t, item) => t += Number(item[propName]), 0);
    return format ? `$${totalValue.toFixed()}` : totalValue as any; /* Without as any - Type 'string | number' is not
     assignable to type 'resultType<U>'. Compiler has difficulty correlating the data type of values returned
     by methods and functions when conditional types are used */
  }
}

let data = new Collection<Product>(new Product("Kayak", 275), new Product("Lifejacket", 48.95));
let firstVal: string = data.total("price", true);
console.log(`Type of formatted value: ${typeof firstVal}`); // string
let secondVal: number = data.total("price", false);
console.log(`Type of unformatted value: ${typeof secondVal}`); // number
```

#### Conditional Types with Type Unions
Conditional types can be used to filter type unions, allowing types to be easily selected or excluded from the set that
the union contains
```typescript
type Filter<T, U> = T extends U ? never : T;
function filterArray<T, U>(data: T[], predicate: (item) => item is U): Filter<T, U>[] {
  return data.filter(item => !predicate(item)) as any;
}

const isProduct = (item: any): item is Product  => item instanceof Product
let dataArray = [new Product("Kayak", 275), new Person("Bob", "London"), new Product("Lifejacket", 27.50)];
let filteredData: Person[] = filterArray(dataArray, isProduct);
filteredData.forEach(item => console.log(`Person: ${item.name}`)); //Person: Bob
```
When a conditional type is provided with a type union, the compiler distributes the condition over each type in the union,
creating what is known as a **distributive conditional** type. This effect is applied when a conditional type is used
like a type union, like this, for example:
```typescript
type Filter<T, U> = T extends U ? never : T;
type filteredUnion = Filter<Product | Person, Product> /* Ends up with type filteredUnion = Person */
/* compiler applies the conditional type to each type in the union separately and then creates result like */
type filteredUnion = Filter<Product, Product> | Filter<Person, Product>
/* The Filter<T, U> conditional type evaluates to never when the first type parameter is the same as the second */
type filteredUnion = never | Person
/* It isn’t possible to have a union with never, so the compiler omits it from the union, and results with */
type filteredUnion = Person
```
The conditional type filters out any type that cannot be assigned to Person and returns the remaining types in the union.
The `FilterArray<T, U>` method does the work of filtering an array using a predicate function and returns the `Filter<T, U>`
type.

#### Built-in Distributive Conditional Types
TypeScript provides a set of built-in conditional types that are used to filter unions

|Name|Description|
|:---|:---|
|`Exclude<T, U>`|This type excludes the types that can be assigned to U from T (same as `Filter<T, U>` type above)|
|`Extract<T, U>`|selects the types that can be assigned to U from T.|
|`NonNullable<T>`|This type excludes null and undefined from T|

#### Conditional Types in Type Mappings
Conditional types can be combined with type mappings, allowing different transformations to be applied to the properties
in a type, which can provide greater flexibility than using either feature alone
```typescript
type changeProps<T, U, V> = {
  [P in keyof T]: T[P] extends U ? V : T[P]
};
type modifiedProduct = changeProps<Product, number, string>;

function convertProduct(p: Product): modifiedProduct {
  return {name: p.name, price: `$${p.price.toFixed(2)}`};
}

let kayak = convertProduct(new Product("Kayak", 275));
console.log(`Product: ${kayak.name}, ${kayak.price}`);
```

#### Identifying Properties of a Specific Type
Common requirement is to limit a type parameter so that it can be used only to specify a property that has a specific 
type, the `Collection<T>` class defined a total method that accepts a property name and that should be restricted to
`number` properties.
```typescript
type unionOfTypeNames<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
};
type propertiesOfType<T, U> = unionOfTypeNames<T, U>[keyof T];
function total<T, P extends propertiesOfType<T, number>>(data: T[], propName: P): number {
  return data.reduce((t, item) => t += Number(item[propName]), 0);
}
let products = [new Product("Kayak", 275), new Product("Lifejacket", 48.95)];
console.log(`Total: ${total(products, "price")}`);
```
The conditional statement checks the type of each property. If a property doesn’t have the target type, then its type
is changed to `never`. If a property does have the expected type, then its type is changed to the literal value that is
the property *name*. This means that the mapping `unionOfTypeNames<Product, number>` produces the following mapped type:
```typescript
{
  name: never,
  price: "price"
}
```
because of the `[keyof T]` For the mapped type created by `unionOfTypeNames<Product, number>`, the indexed access 
operator produces the following union:
```typescript
never | "price"
```
Never is omitted, the `propName` parameter of the total function can be used only with the names of the `number` properties
in the type T, like this:
```typescript
console.log(`Total: ${total(products, "price")}`); //Total: 323.95
```

#### Inferring Additional Types in Conditions
There can be a tension between the need to accept a wide range of types through a generic type parameter and the need
to know the details of those types.
```typescript
/* WON'T COMPILE function getValue<T, P extends keyof T>(data: T, propName: P): T[P] {
  if (Array.isArray(data)) {
    return data[0][propName];
  } else {
    return data[propName];
  }
}*/

type targetKeys<T> = T extends (infer U)[] ? keyof U: keyof T;
function getValue<T, P extends targetKeys<T>>(data: T, propName: P): T[P] {
  if (Array.isArray(data)) {
    return data[0][propName];
  } else {
    return data[propName];
  }
}
let products = [new Product("Kayak", 275), new Product("Lifejacket", 48.95)];
console.log(`Array Value: ${getValue(products, "price")}`);
console.log(`Single Total: ${getValue(products[0], "price")}`);
```
Types are inferred with the infer keyword, and they introduce a generic type whose type will be inferred by the compiler
when the conditional type is resolved.


#### Inferring Types of Functions
The compiler can also infer types in generic types that accept functions
```typescript
type Result<T> = T extends (...args: any) => infer R ? R : never;

function processArray<T, Func extends (T) => any>(data: T[], func: Func): Result<Func>[] {
  return data.map(item => func(item));
}

let selectName = (p: Product) => p.name;
let products = [new Product("Kayak", 275), new Product("Lifejacket", 48.95)];
let names: string[] = processArray(products, selectName);
names.forEach(name => console.log(`Name: ${name}`));
```
The `Result<T>` conditional type uses `infer` keyword to obtain the result type for a function that accepts an object
of type `T` and produces an `any` result. The use of type inference allows functions that process a specific type to be
used while ensuring that the result of the processArray function is a specific type, based on the result of the function
provided for the `func` parameter. The `selectName` function returns the `string` value of the *name* property of a
`Product` object, and the inference means that `Result<(...args:Product) => string>` is correctly identified as `string`,
allowing the processArray function to return a `string[]` result. \
Type inference in conditional types can be difficult to figure out, and TypeScript provides a series of built-in
conditional types that are useful for dealing with functions

|Name|Description|
|:---|:---|
|`Parameters<T>`|This conditional type selects the types of each function parameter, expressed as a tuple|
|`ReturnType<T>`|selects the function result type, equivalent to `Result<T>` above|
|`ConstructorParameters<T>`|selects the types of each parameter of a constructor function, expressed as a tuple|
|`InstanceType<T>`|returns the result type of a constructor function|

The `ConstructorParameters<T>` and `InstanceType<T>` conditional types operate on constructor functions and are most
useful when describing the types of functions that create objects whose type is specified as a generic type parameter
```typescript
function makeObject<T extends new (...args: any) => any>(constructor: T, ...args: ConstructorParameters<T>): InstanceType<T> {
  return new constructor(...args as any[]);
}

let prod: Product = makeObject(Product, "Kayak", 275);
let city: City = makeObject(City, "London", 8136000);
[prod, city].forEach(item => console.log(`Name: ${item.name}`));
```
`makeObject` function creates objects from classes without advanced knowledge of which class is required.
The `ConstructorParameters<T>` and `InstanceType<T>` conditional types infer (conclude) the parameters and result for
the constructor of the class provided as the first generic type parameter, ensuring that the `makeObject` function 
receives the correct types for creating an object and whose type accurately reflects the type of the object that is
created.