import {ToDoItem} from './Item'

type ItemsCount = {
  total: number,
  incomplete: number
}

export class ItemCollection {
  constructor(public name: string, public toDoItems: Map<number, ToDoItem> = new Map<number, ToDoItem>()) {
  }

  addItem(task: string, id?: number): number {
    id = id ? id : ItemCollection.generateID();
    const item = new ToDoItem(id, task);
    this.toDoItems.set(item.id, item);
    return id;
  }

  getItemById(id: number): ToDoItem {
    return this.toDoItems.get(id);
  }

  completeTask(id: number): void {
    const item = this.toDoItems.get(id);
    if (item) {
      item.complete = true;
    }
  }

  getItems(completedOnly: boolean = true): ToDoItem[] {
    return [...this.toDoItems.values()].filter(item => completedOnly && !item.complete);
  }

  removeCompleted() {
    this.toDoItems.forEach((item, key) => {
      if(item.complete) {
        this.toDoItems.delete(key);
      }
    })
  }

  removeItem(item: ToDoItem): void {
    this.toDoItems.delete(item.id);
  }

  getCount(): ItemsCount {
    return {
      incomplete: this.getItems().length,
      total: this.toDoItems.size
    };
  }

  static generateID(): number {
    return Math.floor(Math.random() * 1000)
  }
}
