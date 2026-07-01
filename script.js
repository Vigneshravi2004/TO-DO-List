// ================================
// TaskFlow - script.js
// ================================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const emptyState = document.getElementById("emptyState");

const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ================================
// Save Tasks
// ================================
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ================================
// Update Statistics
// ================================
function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;

    emptyState.style.display = total === 0 ? "block" : "none";
}

// ================================
// Add Task
// ================================
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.unshift(task);

    taskInput.value = "";

    saveTasks();

    renderTasks();

}

// ================================
// Delete Task
// ================================
function deleteTask(id) {

    if (!confirm("Delete this task?"))
        return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

}

// ================================
// Edit Task
// ================================
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const updatedText = prompt("Edit Task", task.text);

    if (updatedText === null)
        return;

    if (updatedText.trim() === "")
        return;

    task.text = updatedText.trim();

    saveTasks();

    renderTasks();

}

// ================================
// Toggle Complete
// ================================
function toggleComplete(id) {

    const task = tasks.find(task => task.id === id);

    task.completed = !task.completed;

    saveTasks();

    renderTasks();

}

// ================================
// Render Tasks
// ================================
function renderTasks() {

    taskList.innerHTML = "";

    const keyword = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.text.toLowerCase().includes(keyword);

        if (currentFilter === "completed") {
            return task.completed && matchesSearch;
        }

        if (currentFilter === "pending") {
            return !task.completed && matchesSearch;
        }

        return matchesSearch;

    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        li.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>

            </div>

            <div class="task-right">

                <button class="edit-btn">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button class="delete-btn">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;

        const checkbox = li.querySelector("input");

        const editBtn = li.querySelector(".edit-btn");

        const deleteBtn = li.querySelector(".delete-btn");

        checkbox.addEventListener("change", () => {

            toggleComplete(task.id);

        });

        editBtn.addEventListener("click", () => {

            editTask(task.id);

        });

        deleteBtn.addEventListener("click", () => {

            deleteTask(task.id);

        });

        taskList.appendChild(li);

    });

    updateStats();

}

// ================================
// Search
// ================================
searchInput.addEventListener("input", renderTasks);

// ================================
// Filter
// ================================
filterBtns.forEach(button => {

    button.addEventListener("click", () => {

        filterBtns.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});

// ================================
// Add Button
// ================================
addBtn.addEventListener("click", addTask);

// ================================
// Enter Key
// ================================
taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        addTask();

    }

});

// ================================
// Initial Load
// ================================
renderTasks();