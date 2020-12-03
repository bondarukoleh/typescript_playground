import {Person} from "./dataTypes";

type shapeType = { name: string };

function simplestExample() {
  interface Collection<T extends shapeType> {
    add(...newItems: T[]): void;

    get(name: string): T;

    count: number;
  }

  class Person {
    public name: string
  }

  class Something implements Collection<Person> {
    count: number;

    add(...newItems: Person[]): void {
    }

    get(name: string): Person {
      return undefined;
    }
  }
}

function implementWithoutChanges() {
  interface Collection<T extends shapeType> {
    add(...newItems: T[]): void;
    get(name: string): T;
    count: number;
  }

  class ArrayCollection<DataType extends shapeType> implements Collection<DataType> {
    private items: DataType[] = [];
    add(...newItems): void {this.items.push(...newItems)}
    get(name: string): DataType {return this.items.find(item => item.name === name);}
    get count(): number {return this.items.length;}
  }

  let peopleCollection: Collection<Person> = new ArrayCollection<Person>();
  peopleCollection.add(new Person("Bob Smith", "London"), new Person("Dora Peters", "New York"));
  console.log(`Collection size: ${peopleCollection.count}`);
}


export {}