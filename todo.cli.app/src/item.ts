interface IToDoItem {
  id: number;
  task: string;
  complete: boolean;
}

export class ToDoItem {
  public id: number;
  public task: string;
  public complete: boolean = false;

  public constructor({id, complete, task}: IToDoItem) {
  }

  public printDetails(): void {
    console.log(`Todo item:\tid: ${this.id}; task: ${this.task}; completed? ${this.complete ? 'Yes' : 'No'};`);
  }
}