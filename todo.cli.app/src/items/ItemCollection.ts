import {ToDoItem} from './Item'

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

  removeItem(item: ToDoItem): void {
    this.toDoItems.delete(item.id);
  }

  static generateID(): number {
    return Math.floor(Math.random() * 1000)
  }
}
