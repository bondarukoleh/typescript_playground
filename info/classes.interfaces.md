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
