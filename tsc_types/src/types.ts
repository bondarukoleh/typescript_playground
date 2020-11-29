type SomeType = {
  propertyStr: string,
  innerObj: {
    num: number,
    combined: [string | boolean, number]
  },
  optional?: string,
  func: () => void;
}

const some: SomeType = {propertyStr: 'asd', innerObj: {combined: ["asdas", 1], num: 1}, func() {}}

export {}