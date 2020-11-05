export class ToDoItem {
  public complete: boolean = false;

  public constructor(public id: number, public task: string) {
  }

  public printDetails(): void {
    console.log(`Todo item:\tid: ${this.id}; task: ${this.task}; completed? ${this.complete ? 'Yes' : 'No'};`);
  }
}