##Functions
Couple of new compilerOptions
`noImplicitReturns` - requires all paths in a function to return a result. \
`noUnusedParameters` - causes the compiler to produce a warning if a function defines parameters that are not used.

JavaScript doesn’t support function overloading, so last function will override previous, TS doesn't allow duplicating
functions.
```typescript
function a(){};
function a(){}; /* Duplicate function implementation error */ 
```