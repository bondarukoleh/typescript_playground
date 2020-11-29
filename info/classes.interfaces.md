#Classes and Interfaces
###Using Constructor Functions
We can use old style constructor function, but compiler will treat return type from `new ConstructorFuntion` as `any`.
Compiler doesn't understand the Constructor functions properly, so you shouldn't use them, `instanceof` also won't help
you with type guard.
 
###Using Classes
TS has better support of classes then constructor function.
Objects are created from classes using the standard `new` keyword, and the compiler understands the use of the `instanceof`
keyword for type narrowing when classes are used.

####the Access Control Keywords
Name Description \
`public` - free access to a property or method and is the **default** if no keyword is used. \
`private` - restricts access to the property or method. \
`protected` - restricts access to the property or method except its subclasses.

But you should remember that it's only about the TS code and developing. After TS code with private variables transpiled
all private variables became regular JS accessible variables, so you shouldn't hide some sensitive user's data behind
the private vars, use old fashion closures.

When the `strictPropertyInitialization` configuration option is set to true, compiler reports an error if a class
defines a property that is not assigned a value, `strictNullChecks` option must also be enabled for this feature to work.

####Read-Only Properties
The `readonly` keyword can be used to create instance properties whose value is assigned by the constructor but cannot
otherwise be changed. Same stuff as for `private` it's only for TS - in JS code it will be same old variable.

###Class Inheritance
If you `extend` the class - you forced to call the `super()` from the constructor.
```typescript
class A { constructor(public a: string) {} }
class B extends A { constructor(public a: string, public b: string) { super(a) } }
export const arr = [new A("a"), new B("a", "b")];
// arr will be 
export declare const arr: A[];
```
You might reasonably assume that the compiler has realized that **B** is a subclass of **A** and that all the objects
in the array can be treated as **A** objects. In reality, the compiler creates a **union** of the types the array
contains, which would be `A | B`, and determines that this is equivalent to **A** since a union only presents the
features that are common to all types. It is important to remember that the compiler pays attention to **object
shapes**, even if the developer is paying attention to classes. This can appear to be an unimportant difference,
but it has consequences when using objects that share a common superclass.
```typescript
class A { constructor(public a: string) {} }
class B extends A { constructor(public a: string, public b: string) { super(a) } }
class C extends A { constructor(public a: string, public c: string) { super(a) } }
class D extends A { constructor(public a: string, public d: string) { super(a) } }
export const arr = [new B("a", "b"), new C("a", "c")];
// arr will be 
export declare const arr: (B | C)[];
// So you cannot add D to this
arr.push(new D()) // because compiler treat arr not like arr: A[], the parent class but as a union B | C;
/* you need */ const arr: A[] = [new B("a", "b"), new C("a", "c")];
```

###Abstract Class
Abstract classes cannot be instantiated directly and are used to describe common functionality that must be implemented
by subclasses, forcing subclasses to adhere to a specific shape but allowing class-specific implementations of specific
methods. When a class extends an abstract class, it must implement all the abstract methods. We can use `instanceof` for
type guard to check that some object is instance of abstract class. You can provide the implementation of the methods
comparing to interfaces.

##Using Interfaces
Interfaces are used to describe the shape of an object, which a class that implements the interface must conform to.
They are very similar to `type` but has little differences. \
Unlike abstract classes, interfaces don’t implement methods or define a constructor and just define a shape. \
Interfaces can be used for type annotations.

####Multiple Interfaces
A class can implement more than one interface, meaning it must define the methods and properties defined by all of them.
>class can implement multiple interfaces only if there are no overlapping properties with conflicting types. 
>if interface IA has id: string, and interface IB has id: number, you cannot class A implements IA, IB {}

####Extending Interfaces
Interfaces can be extended, just like classes with same result.
> interfaces can extend types, types can be implemented as interfaces 🦿😰
```typescript
type AType = {some: string}
interface IA extends AType {other: string}
class A implements AType {some: string}
```
You can force to do something optional from the interface by implement it with abstract class and make those vars abstract
```typescript
interface IA {opt?: string}
abstract class AA implements IA { abstract opt: string}
class A implements AA {opt: string}
```

####Type Guarding an Interface
Same as with `private` or `readonly`, interfaces is TS stuff, you cannot use `instanceof` to check the type of the object,
only be checking the properties.

###Dynamically Creating Properties
The TypeScript compiler only allows values to be assigned to properties that are part of an object’s type, which means
that interfaces and classes have to define all the properties that the application requires. \
To add such ability we can use _index signature_ `any` by default unless `noImplicitAny` enabled.
The property name type can be only string or number, but the property value type can be any type.
```typescript
class A {
  [dynamicProp: string]: number | string
}
const a  = new A();
a.somesthing = 1;
a.anythig = 3;
a.aaa = "123";
console.log(Object.entries(a)) /* [ [ 'somesthing', 1 ], [ 'anythig', 3 ], [ 'aaa', '123' ] ] */
```

