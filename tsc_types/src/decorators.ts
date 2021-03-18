function decorateFunction(name: string) {
  return (parentClass: object, decoratedPropertyName: string, descriptor: PropertyDescriptor) => {
    console.log(`This is a decorator "${name}" for method named "${decoratedPropertyName}" from "%s" class`, parentClass);
    const originalFunction = descriptor.value

    descriptor.value = function (...args) {
      try {
        return originalFunction.bind(this, ...args);
      } catch (e) {
        console.log('Error in function');
        console.error(e);
        throw e;
      }
    }
    return descriptor;
  }
}

function decorateClass(name: string) {
  return function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
    console.log('Hello from class decorator');
    return class extends constructor {
      propertyFromDecorator = 'decoratorProperty'
    };
  }
}

@decorateClass('Adding some stuff to class SomeClass')
class SomeClass {
  private variable = 'Private_thing';

  @decorateFunction('This is the name of the decorated function')
  someMethod(some: string, second: object){
    console.log(`It's from m. I have arguments %s %o secret: "%s"`, some, second, this.variable);
    /* console.log(this.propertyFromDecorator) - won't work, assume that this is because of .apply in decorator */
  }

  otherMethod() {
    // @ts-ignore
    console.log(this.propertyFromDecorator); /* TS doesn't see this stuff from decorator */
  }
}

export {SomeClass}
