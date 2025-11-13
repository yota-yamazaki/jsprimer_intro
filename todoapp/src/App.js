import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { element, render } from "./view/html-util.js";

export class App {
  // 1. TodoListModelの初期化
  #todoListModel = new TodoListModel();

  mount() {
    const formElement = document.querySelector("#js-form");
    const inputElement = document.querySelector("#js-form-input");
    const containerElement = document.querySelector("#js-todo-list");
    const todoItemCountElement = document.querySelector("#js-todo-count");
    // 2. TodoListModelの状態が更新されたら表示を更新する
    this.#todoListModel.onChange(() => {
      const todoListElement = element`<ul></ul>`;
      const todoItems = this.#todoListModel.getTodoItems();
      todoItems.forEach(item => {
        // 完了済みならchecked属性をつけ、未完了ならchecked属性を外す
        const todoItemElement = item.completed
          ? element`<li><input type="checkbox" class="checkbox" checked><s>${item.title}</s></li>`
          : element`<li><input type="checkbox" class="checkbox">${item.title}</li>`;
        // チェックボックスがトグルしたときのイベントにリスナー関数を登録
        const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
        inputCheckboxElement.addEventListener("change", () => {
          // 指定したTodoアイテムの完了状態を反転させる
          this.#todoListModel.updateTodo({
            id: item.id,
            completed: !item.completed
          });
        });
        todoListElement.appendChild(todoItemElement);
      });
      render(todoListElement, containerElement);
      todoItemCountElement.textContent = `Todoアイテム数: ${this.#todoListModel.getTotalCount()}`;
    });

    // 3. フォームを送信したら、新しいTodoItemModelを追加する
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      // 新しいTodoItemをTodoListへ追加する
      this.#todoListModel.addTodo(new TodoItemModel({
        title: inputElement.value,
        completed: false
      }));
      inputElement.value = "";
    });
  }
}
