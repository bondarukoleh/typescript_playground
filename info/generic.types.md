# Generic Types
Generic types are placeholders for types that are resolved when a class or function is used, this allows type-safe code
that can deal with a range of different types, such as collection or classes. \
Problem: you have some types you need to work with, you can do type union or use interfaces or abstract classes - you 
still get the monstro class that works with everything, which is not the thing you need sometimes.

### Generic class
A generic class is a class that has a **generic type parameter** it is a placeholder for a `type` that is specified when
the class is used to create a new object. Generic type parameters allow classes to be written that operate on a specific
type **without knowing what that type** will be in advance.

```typescript
class DataCollection<T> {
  private collection: T[] = [];
  constructor(initialCollection:T[]) {
    this.collection.push(...iniinitialCollection);
  };
}
```

**Generic Type Arguments** \
A **generic type parameter** `<T>` is resolved to a specific type using a **generic type argument** `<String>` when an 
instance of the `DataCollection<T>` class is created with the `new` keyword `new DataCollection<String>`.

**Different Type Arguments** \
The value of a generic type parameter affects only a single object, and a different type can be used for the next one.

#### Limit (Constrain) Generic Type Values
Generic type can be anything, to explain a little more about it to compiler we can `extend` it. Type after `extends` is
narrow type for the compiler. Of course compiler realize when you're initializing with some specific type - it will 
treat object with specified type. So the `extends` keyword narrows the types that can be assigned to the **type parameter**,
and the type parameter restricts the types that can be used by a **specific instance** of the class.
```typescript
class DataCollection<T extends Person | Product> {
  private collection: T[] = [];
  getItemName(): string {
    return this.collection[0].name; /* Compiler understands that item has name */
  }
}
```

Constraining Generic Types Using a Shape \
Using a **type union** to constrain generic type parameters is useful, but the union must be extended for each new type 
that is required. An alternative approach is to use a **shape** to constrain the type parameter, which will allow only 
the properties that the generic class relies on to be described.
```typescript
/* can be instantiated using any type that has a name property that returns a string.*/
class DataCollection<T extends {name: string}> { 
  private collection: T[] = [];
  getItemName(): string {
    return this.collection[0].name;
  }
}
```
>Generic type parameters can also be constrained using type aliases and interfaces.

#### Defining Multiple Type Parameters
You can add some types to generics.
```typescript
class DataCollection<T extends { name: string }, U> {
  private items: T[] = [];
  doSomething(data: U[]): (T & U)[] {}
}
```

#### Applying a Type Parameter to a Method
When you need more flexible method, you can provide the generic type in method. The type parameter can be moved from
the class declaration and applied directly to the method, allowing a different type to be specified each time the method
is invoked
```typescript
class DataCollection<T extends { name: string }> {
  private items: T[] = [];
  doSomething<U>(data: U[]): (T & U)[] {}
}
new DataCollection<String>().doSomething<Number>([1, 2, 3])
```

#### Allowing the Compiler to Conclude (Infer) Type Arguments
The TypeScript compiler is able to infer generic type arguments based on the way that objects are created or methods
are invoked. You can write less code, but it can bring more confusion.
```typescript
class DataCollection<T extends { name: string }> {
  private items: T[] = [];
  constructor(initialItems: T[]) {this.items.push(...initialItems);}
  doSomething<U>(data: U[]): (T & U)[] {}
}
new DataCollection<>(["str", "str2"]).doSomething<>([1, 2, 3]); /* Compiler understands that T - string, U - nimber */
```

### Extending Generic Classes
Extending generic class the subclass can choose to deal with the generic type parameters in several ways.
1. The first approach is to simply add features to those defined by the superclass using the same generic types:
```typescript
class DataCollection<T extends { name: string }> {
  private items: T[] = [];
  constructor(initialItems: T[]) {this.items.push(...initialItems);}
  doSomething<U>(data: U[]): (T & U)[] {}
}
class DataCollectionExtended<T extends { name: string }> extends DataCollection<T>{
  constructor(initialItems: T[]) {
    super(initialItems);
  }
  doSomethingElse<U>(data: U[]): T | undefined {
    this.doSomething<U>(data)
  }
}
```

2. Narrowing down generics for subclasses. Fixed generic type.
```typescript
class DataCollection<T extends { name: string }> {
  private items: T[] = [];
  constructor(initialItems: T[]) {this.items.push(...initialItems);}
  doSomething<U>(data: U[]): (T & U)[] {}
}
class DataCollectionExtended extends DataCollection<string>{ // for DataCollectionExtended instances there will be always String.  
  constructor(initialItems: string[]) {
    super(initialItems);
  }
  doSomethingElse<U>(data: U[]): T | undefined {
    this.doSomething<U>(data)
  }
}
```

3. Restricting the Generic Type Parameter. Users still have some freedom, but they are still restricted. 
```typescript
class DataCollection<T extends { name: string }> {
  private items: T[] = [];
  constructor(initialItems: T[]) {this.items.push(...initialItems);}
  doSomething<U>(data: U[]): (T & U)[] {}
}
class DataCollectionExtended<T extends String | Number> extends DataCollection<T>{  
  constructor(initialItems: T[]) {
    super(initialItems);
  }
  doSomethingElse<U>(data: U[]): T | undefined {
    this.doSomething<U>(data)
  }
}
```

### Type Guarding Generic Types
You **cannot** use `instansof` to understand the generic type you are working with since `instanceof` is JS and Generics
is a TS stuff and it doesn't produce any value for JS to check. You need predicate with `is`.
```typescript
class DataCollection<T> {
  /*filter<V extends T>(): V[] => items.filter(item => item instanceof V) as V[];*/ /* ERROR */
  filter<V extends T>(checkType: (item) => item is V): V[] { /* Predicate to ensure the type */
    return this.items.filter(item => checkType(item)) as V[];
  }
}

const isPerson = (item): item is Person => {
  return item instanceof Person;
}
let mixedData = new DataCollection<Person | Product>([...people, ...products]);
let filteredProducts = mixedData.filter<Person>(isPerson);
filteredProducts.forEach(p => console.log(`Person: ${ p.name}, ${p.name}`));
```

### Defining a Static Method on a Generic Class
Static methods can define their own generic type parameters
```typescript
class DataCollection<T> {
  static reverse<ArrayType>(arr: ArrayType[]): ArrayType[] {
    return arr.reverse();
  }
}

let reversedArr = DataCollection.reverse<string>(['asd1', 'asd2']);
```

### Defining Generic Interfaces
Interfaces can be defined with generic type parameters, allowing functionality to be defined without specifying
individual types
```typescript
type shapeType = { name: string };
interface Collection<T extends shapeType> {
  add(...newItems: T[]): void;
  get(name: string): T;
  count: number;
}
class PersonCollection implements Collection<Person> {
  count: number;
  add(...newItems: Person[]): void {}
  get(name: string): Person { return null }
}
```

Extending Generic Interfaces \
Generic interfaces can be extended just like regular interfaces, behavior same as extending generic class.
simply duplicate the type, narrowing type to some specific, or restrict type with union. 
```typescript
type shapeType = { name: string };
interface Collection<T extends shapeType> {
  add(...newItems: T[]): void;
  get(name: string): T;
  count: number;
}
interface SearchableCollection<T extends shapeType> extends Collection<T> {
  find(name: string): T | undefined;
}
interface ProductCollection extends Collection<Product> {
  sumPrices(): number;
}
interface PeopleCollection<T extends Product | Employee> extends Collection<T> {
  getNames(): string[];
}
```

### Implementing a Generic Interface
When a class implements a generic interface, it must implement all the required interface properties and methods, but it
has some choices about how to deal with type parameters.
#### Passing on the Generic Type Parameter
1. The simplest - implement the interface properties and methods without changing the type parameter;
```typescript
interface Collection<T extends shapeType> {}
class ArrayCollection<DataType extends shapeType> implements Collection<DataType> {}
let peopleCollection: Collection<Person> = new ArrayCollection<Person>(); /* pay attention that instanse interface typed */
```
2. Restricting or Fixing the Generic Type Parameter
   Classes can provide an implementation of an interface that is specific to a type or a subset of the types supported
   by the interface
```typescript
interface Collection<T extends shapeType> {}
class PersonCollection implements Collection<Person> {} /* Fixed instances to Person type */
let peopleCollection: Collection<Person> = new PersonCollection();

class MixedCollection<T extends Person | Employee> implements Collection<T> {} /* Restriction */
let mixedCollection: Collection<Person> = new MixedCollection();
```

####Creating an Abstract Interface Implementation
An abstract class can provide a partial implementation of an interface, which can be completed by subclasses.
The abstract class has the same set of options for dealing with type parameters as regular classes:
pass it on to subclasses unchanged, apply further restrictions, or fix for specific types.
```typescript
abstract class ArrayCollection<T extends shapeType> implements Collection<T> {
  add(...newItems: T[]): void {}
  abstract get(searchTerm: string): T;
}
abstract class ArrayCollection implements Collection<Person> {}
abstract class ArrayCollection <T extends Person | Employee> implements Collection<T> {}
```
