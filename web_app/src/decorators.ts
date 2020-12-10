export const minimumValue = (propName: string, min: number) =>
  (constructor: any, methodName: string, descriptor: PropertyDescriptor): any => {
    const origFunction = descriptor.value;
    descriptor.value = async function wrapper(...args) {
      let results = await origFunction.apply(this, args);
      return results.map(r => ({...r, [propName]: r[propName] < min ? min : r[propName]}));
    }
  }