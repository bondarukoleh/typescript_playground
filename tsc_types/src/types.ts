type SomeType = {
  propertyStr: string,
  innerObj: {
    num: number,
    combined: [string | boolean, number]
  },
  optional?: string
}

const some: SomeType = {propertyStr: 'asd', innerObj: {combined: ["asdas", 1], num: 1}}

export {}