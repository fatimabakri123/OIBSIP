// ==========================================
// GET HTML ELEMENTS
// ==========================================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");


// ==========================================
// TASKS ARRAY
// ==========================================

let tasks = [];


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString(),
        completedAt: null
    };

    tasks.push(newTask);

    taskInput.value = "";

    renderTasks();
}


// ==========================================
// RENDER TASKS
// ==========================================

function renderTasks() {

    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);

    pending.forEach(task => {
        createTaskElement(task, pendingTasks);
    });

    completed.forEach(task => {
        createTaskElement(task, completedTasks);
    });

    updateCounters();
    updateEmptyMessages();
}


// ==========================================
// CREATE TASK ELEMENT
// ==========================================

function createTaskElement(task, container) {

    const li = document.createElement("li");

    li.className = "task-item";

    li.dataset.id = task.id;


    // Task text

    const taskText = document.createElement("span");

    taskText.className = "task-text";

    taskText.textContent = task.text;


    // Timestamp

    const timestamp = document.createElement("small");

    timestamp.className = "task-time";

    if (task.completed && task.completedAt) {

        timestamp.textContent =
            `Completed: ${task.completedAt}`;

    } else {

        timestamp.textContent =
            `Added: ${task.createdAt}`;

    }


    // Buttons container

    const buttons = document.createElement("div");

    buttons.className = "task-buttons";


    // Complete button

    if (!task.completed) {

        const completeBtn =
            document.createElement("button");

        completeBtn.className = "complete-btn";

        completeBtn.textContent = "Complete";

        completeBtn.addEventListener("click", function () {
            completeTask(task.id);
        });

        buttons.appendChild(completeBtn);
    }


    // Edit button

    const editBtn =
        document.createElement("button");

    editBtn.className = "edit-btn";

    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", function () {
        editTask(task.id);
    });

    buttons.appendChild(editBtn);


    // Delete button

    const deleteBtn =
        document.createElement("button");

    deleteBtn.className = "delete-btn";

    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {
        deleteTask(task.id);
    });

    buttons.appendChild(deleteBtn);


    // Add everything to li

    li.appendChild(taskText);
    li.appendChild(timestamp);
    li.appendChild(buttons);

    container.appendChild(li);
}


// ==========================================
// COMPLETE TASK
// ==========================================

function completeTask(taskId) {

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.completed = true;

    task.completedAt = new Date().toLocaleString();

    renderTasks();
}


// ==========================================
// EDIT TASK
// ==========================================

function editTask(taskId) {

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const trimmedText = newText.trim();

    if (trimmedText === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = trimmedText;

    renderTasks();
}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(taskId) {

    const confirmed =
        confirm("Are you sure you want to delete this task?");

    if (!confirmed) {
        return;
    }

    tasks = tasks.filter(task => task.id !== taskId);

    renderTasks();
}


// ==========================================
// UPDATE COUNTERS
// ==========================================

function updateCounters() {

    const pending =
        tasks.filter(task => !task.completed).length;

    const completed =
        tasks.filter(task => task.completed).length;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;
}


// ==========================================
// UPDATE EMPTY MESSAGES
// ==========================================

function updateEmptyMessages() {

    const hasPendingTasks =
        tasks.some(task => !task.completed);

    const hasCompletedTasks =
        tasks.some(task => task.completed);


    pendingEmpty.style.display =
        hasPendingTasks ? "none" : "block";

    completedEmpty.style.display =
        hasCompletedTasks ? "none" : "block";
}


// ==========================================
// ADD BUTTON EVENT
// ==========================================

addTaskBtn.addEventListener("click", addTask);


// ==========================================
// ENTER KEY EVENT
// ==========================================

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// ==========================================
// INITIAL RENDER
// ==========================================

renderTasks();