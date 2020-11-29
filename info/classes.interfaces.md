#Classes and Interfaces
###Using Constructor Functions
We can use old style constructor function, but compiler will treat return type from `new ConstructorFuntion` as `any`.
Compiler doesn't understand the Constructor functions properly, so you shouldn't use them, `instanceof` also won't help
you with type guard.
 
###Using Classes