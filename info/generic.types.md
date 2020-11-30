#Generic Types
Generic types are placeholders for types that are resolved when a class or function is used, this allows type-safe code
that can deal with a range of different types, such as collection or classes. \
Problem: you have some types you need to work with, you can do type union or use interfaces or abstract classes - you 
still get the monstro class that works with everything, which is not the thing you need sometimes.

###Generic class
A generic class is a class that has a **generic type parameter** it is a placeholder for a `type` that is specified when
the class is used to create a new object. Generic type parameters allow classes to be written that operate on a specific
type **without knowing what that type** will be in advance.

```typescript
class DataCollection<T> {
  private collection: T[] = [];
  constructor(T[] initialCollection) {
    this.collection.push(...iniinitialCollection);
  };
}
```

**Generic Type Arguments** \
A **generic type parameter** `<T>` is resolved to a specific type using a **generic type argument** `<String>` when an 
instance of the `DataCollection<T>` class is created with the `new` keyword `new DataCollection<String>`.

**Different Type Arguments** \
The value of a generic type parameter affects only a single object, and a different type can be used for the next one.

####Limit (Constrain) Generic Type Values
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

####Defining Multiple Type Parameters
