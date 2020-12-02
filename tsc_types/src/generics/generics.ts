import {Person, Product} from './types';

/* Problem: you have some types you need to work with, you can do type union.  */
function problemWithUnion() {
  type PeopleType = Person | Product;

  class PeopleCollection {
    private items: PeopleType[] = [];

    constructor(initialItems: PeopleType[]) {
      this.items.push(...initialItems);
    }

    add = (newItem: PeopleType) => this.items.push(newItem)
    getNames = (): string[] => this.items.map(item => item.name)
    getItem = (index: number): PeopleType => this.items[index]
  }

  let people = [new Person("Bob Smith", "London"), new Person("Dora Peters", "New York")];
  let products = [new Product("Running Shoes", 100), new Product("Hat", 25)];

  let peopleData = new PeopleCollection(people);
  console.log(`Names: ${peopleData.getNames().join(", ")}`);
  let firstSomething = peopleData.getItem(0);
  if (firstSomething instanceof Product) {
    console.log(`First Product: ${firstSomething.name}, ${firstSomething.price}`);
  } else {
    console.log(`First Person: ${firstSomething.name}, ${firstSomething.city}`);
  }
}


function genericSolution() {
  class DataCollection<T> {
    private items: T[] = [];
    constructor(initialItems: T[]) { this.items.push(...initialItems); }
    add = (newItem: T) => this.items.push(newItem);
    getItem = (index: number): T => this.items[index]
  }
  let people = [new Person("Bob Smith", "London"), new Person("Dora Peters", "New York")];
  let products = [new Product("Running Shoes", 100), new Product("Hat", 25)];
  let peopleData = new DataCollection<Person>(people);
  let productsData = new DataCollection<Product>(products);
  let firstPerson = peopleData.getItem(0);
  let firstProduct = productsData.getItem(0);
  // console.log(`First Person: ${firstPerson.name}, ${firstPerson.city}`);
  // console.log(`First Product: ${firstProduct.name}, ${firstProduct.price}`);
}

// genericSolution();

function typeGuard(){
  class DataCollection<T> {
    protected items: T[] = [];

    constructor(initialItems: T[]) {
      this.items.push(...initialItems);
    }

    filter<V extends T>(checkType: (item) => item is V): V[] {
      return this.items.filter(item => checkType(item)) as V[];
    }
  }

  const isPerson = (item): item is Person => {
    return item instanceof Person;
  }

  let people = [new Person("Bob Smith", "London"), new Person("Dora Peters", "New York")];
  let products = [new Product("Running Shoes", 100), new Product("Hat", 25)];
  let mixedData = new DataCollection<Person | Product>([...people, ...products]);
  let filteredProducts = mixedData.filter<Person>(isPerson);
  filteredProducts.forEach(p => console.log(`Person: ${ p.name}, ${p.name}`));
}

