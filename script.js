/** INITIALIZATION */
function main() {
  render();
  minMaxDateinput();
  todoMaker();
}

function minMaxDateinput() {
  const dateInput = document.querySelector('input[type="date"]');
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  dateInput.setAttribute("min", currentDate.toLocaleDateString("en-CA"));
  dateInput.setAttribute("value", currentDate.toLocaleDateString("en-CA"));
}

// ADD NEW TODO FORM
const addNewBtn = document.querySelector("#add-new-btn");
const addNewFormCont = document.querySelector(".add-new-form-container");
// if the form isn't hidden, this will add 'hidden' (display: none) class to the form container and vice versa.
addNewBtn.addEventListener("click", () => {
  showHide(addNewFormCont, addNewBtn);
});

// CONSTRUCTORS
class Todo {
  constructor(title, notes, date, isCompleted) {
    this.title = title;
    this.notes = notes;
    this.date = date;
    this.isCompleted = isCompleted;
  }
}

// HTML template for todos
function todoTemplate(todo) {
  const article = document.createElement("article");
  const completeIndicator = todo.isCompleted
    ? "rgb(79, 236, 132)"
    : "rgb(64, 65, 64)";

  article.classList.add("todo");
  article.innerHTML = `
    <header class='todo-header'>
        <h1>${todo.title}</h1>
        <div class="complete-indicator" style='background-color: ${completeIndicator}'></div>
    </header>
    <section class="about-todo">
        <div class="l-side">
          <p>
              ${todo.notes}
          </p>
        </div>
        <div class="r-side">
          <div class="due">
            <span class="end-date">${todo.date}</span>
          </div>
          <div class="options">
            <button onclick='completeTodo(${todo.id})' class='btn btn-sky'>${
    todo.isCompleted ? "Incomplete" : "Complete"
  }</button>
            <button onclick='deleteTodo(${
              todo.id
            })' class='btn btn-red'>Delete</button>
          </div>
        </div>
    </section>
  `;
  return article;
}

//Add new task functionality
function todoMaker() {
  const submitBtn = document.querySelector("#add-task-btn");

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createTodo();
    render();
  });

  function createTodo() {
    const title = document.querySelector('input[name="title"]');
    const notes = document.querySelector('input[name="notes"]');
    const date = document.querySelector('input[name="date"]');
    const formErrorMsg = document.querySelector("#form-error-msg");
    const erroMsgDuration = 5000;
    if (title.value === "" || notes.value === "" || date.value === "") {
      formErrorMsg.classList.remove("hidden");
      setTimeout(() => {
        formErrorMsg.classList.add("hidden");
      }, erroMsgDuration);
      return;
    }
    const todo = {
      title: title.value,
      notes: notes.value,
      date: date.value,
      id:
        JSON.parse(localStorage.getItem("default")) !== null
          ? JSON.parse(localStorage.getItem("default")).length + 1
          : 1,
    };

    addTodo(todo);
    clearInputs([title, notes]);
  }

  // Adds todo to the local storage
  function addTodo(todo) {
    const todos = JSON.parse(localStorage.getItem("default"));
    if (todos === null) {
      updateTodos("default", [todo]);
    } else {
      updateTodos("default", [...todos, todo]);
    }
  }
}

// TODO OPTIONS
function deleteTodo(todoId) {
  const todos = JSON.parse(localStorage.getItem("default"));

  const newTodos = todos.filter((todo) => {
    return todo.id !== todoId;
  });

  updateTodos("default", newTodos);
}

function completeTodo(todoId) {
  const todos = JSON.parse(localStorage.getItem("default"));
  console.log("clicked");
  const newTodos = todos.map((todo) => {
    if (todo.id === todoId) todo.isCompleted = !todo.isCompleted;
    return todo;
  });

  updateTodos("default", newTodos);
}

/** UTILITIES */

// CLEAR INPUTS
function clearInputs(inputsArray) {
  if (Array.isArray(inputsArray)) {
    inputsArray.forEach((input) => (input.value = ""));
  } else {
    inputsArray.value = "";
  }
}

// UPDATE TODOS
function updateTodos(groupName, newValues) {
  localStorage.setItem(groupName, JSON.stringify(newValues));
  render();
}

//Render all the todos (from default group) / grouping todos feature will added soon
function render() {
  const todos = JSON.parse(localStorage.getItem("default"));
  const todosContainer = document.querySelector("#todos-container");

  todosContainer.innerHTML = "";
  if (todos === null || todos.length === 0) {
    todosContainer.innerHTML = `<h1 class='no-todos-msg'>No Task yet</h1>`;
  } else {
    todos.forEach((todo) => todosContainer.append(todoTemplate(todo)));
  }
}

// ANIMATION
function showHide(targetElement, trigger) {
  if (targetElement.classList.contains("hidden")) {
    targetElement.classList.remove("hidden");
    trigger.textContent = "Cancel";
  } else {
    targetElement.classList.add("hidden");
    trigger.textContent = "New";
  }
}

main();
