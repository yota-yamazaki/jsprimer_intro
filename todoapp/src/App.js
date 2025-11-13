import { render } from "./view/html-util.js";
import { TodoListView } from "./view/TodoListView.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { TodoListModel } from "./model/TodoListModel.js";

export class App {
  #todoListView = new TodoListView();
  #todoListModel = new TodoListModel([]);

  /**
  * Todoを追加するときに呼ばれるリスナー関数
  * @param {string} title
  */
  handleAdd(title) {
    this.#todoListModel.addTodo(new TodoItemModel({ title, completed: false }));
  }

  /**
  * Todoの状態を更新したときに呼ばれるリスナー関数
  * @param {{ id:number, completed: boolean }}
  */
  handleUpdate({ id, completed }) {
    this.#todoListModel.updateTodo({ id, completed });
  }

  /**
  * Todoを削除したときに呼ばれるリスナー関数
  * @param {{ id: number }}
  */
  handleDelete({ id }) {
    this.#todoListModel.deleteTodo({ id });
  }

  #formElement = document.querySelector("#js-form");
  #inputElement = document.querySelector("#js-form-input");
  #todoItemCountElement = document.querySelector("#js-todo-count");
  #containerElement = document.querySelector("#js-todo-list");

  // todoリストを取得して、レンダリングする関数
  #render_list = () => {
    const todoItems = this.#todoListModel.getTodoItems();
    const todoListElement = this.#todoListView.createElement(todoItems, {
      // Appに定義したリスナー関数を呼び出す
      onUpdateTodo: ({ id, completed }) => {
        this.handleUpdate({ id, completed });
      },
      onDeleteTodo: ({ id }) => {
        this.handleDelete({ id });
      }
    });

    render(todoListElement, this.#containerElement);
    this.#todoItemCountElement.textContent = `Todoアイテム数: ${this.#todoListModel.getTotalCount()}`;
  }

  mount(){
    // 登録
    this.#todoListModel.onChange(this.#render_list);

    this.#formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleAdd(this.#inputElement.value);
      this.#inputElement.value = "";
    });
  }

  unmount(){
    this.#todoListModel.offChange(this.#render_list);

    this.#formElement.removeEventListener("submit", (event) => {
      event.preventDefault();
      this.handleAdd(this.#inputElement.value);
      this.#inputElement.value = "";
    });
  }
}
