import { City, Person, Product, Employee } from "./types";

class DataCollection<T extends { name: string }> {
  private items: T[] = [];
  constructor(initialItems: T[]) {
    this.items.push(...initialItems);
  }
  collate<U>(targetData: U[], itemProp: string, targetProp: string): (T & U)[] {
    let results = [];
    this.items.forEach(item => {
      let match = targetData.find(d => d[targetProp] === item[itemProp]);
      if (match !== undefined) {
        results.push({ ...match, ...item });
      }
    });
    return results;
  }

  static reverse<ArrayType>(arr: ArrayType[]): ArrayType[] {
    return arr.reverse();
  }
}

let people = [new Person("Bob Smith", "London"), new Person("Dora Peters", "New York")];
let products = [new Product("Running Shoes", 100), new Product("Hat", 25)];
let cities = [new City("London", 8136000), new City("Paris", 2141000)];
let employees = [new Employee("Bob Smith", "Sales"),  new Employee("Alice Jones", "Sales")];
let peopleData = new DataCollection<Person>(people);
let collatedData = peopleData.collate<City>(cities, "city", "name");
let empData = peopleData.collate<Employee>(employees, "name", "name");
let reversedCities = DataCollection.reverse<Employee>(employees);
// collatedData.forEach(c => console.log(`${c.name}, ${c.city}, ${c.population}`));
// empData.forEach(c => console.log(`${c.name}, ${c.city}, ${c.role}`));
