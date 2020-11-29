type Person = {
  id: string,
  name: string,
  city: string
};

class Employee {
  public somePrivate;

  constructor(public id, public name: string, public dept: string, public city: string) {
  }

  writeDept() {
    console.log(`${this.name} works in ${this.dept}. With id ${this.id}`);
  }
}

let salesEmployee = new Employee("fvega", "Fidel Vega", "Sales", "Paris");
let data: (Person | Employee)[] = [
  {id: "bsmith", name: "Bob Smith", city: "London"},
  {id: "ajones", name: "Alice Jones", city: "Paris"},
  {id: "dpeters", name: "Dora Peters", city: "New York"},
  salesEmployee
];
data.forEach(item => {
  if (item instanceof Employee) {
    item.writeDept();
  } else {
    console.log(`${item.id} ${item.name}, ${item.city}`);
  }
});

export {}