document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("addBtn").addEventListener("click", addTask);
    document.getElementById("editBtn").addEventListener("click", toggleEditMode);
    document.getElementById("todoInput").addEventListener("keydown", handleKeyDown);
    document.getElementById("resetBtn").addEventListener("click", resetStorage);

    
});


window.addEventListener("load", () => {
    loadTasks();
});

/*Function Definitions*/

function loadTasks() {
    const savedTasks = localStorage.getItem("savedTasks");
    if (savedTasks) {
        document.getElementById("todoList").innerHTML = savedTasks;
        updateTaskEventListeners();
    }
}
function updateTaskEventListeners() {
    const tasks = document.querySelectorAll("#todoList li");
    tasks.forEach(task => {
        task.addEventListener("dragstart", handleDragStart);
        task.addEventListener("dragover", handleDragOver);
        task.addEventListener("drop", handleDrop);
    });
}

function resetStorage() {
    localStorage.removeItem("savedTasks");
    location.reload();
}

function handleKeyDown(e) {
    if (e.key === "Enter") {
        addTask();
    }
}
let editMode = false;

function toggleEditMode() {
    editMode = !editMode;
    document.getElementById("editBtn").textContent = editMode ? "Finish Editing" : "Edit Tasks";
}


function addTask() {
    const input = document.getElementById("todoInput");
    const noteInput = document.getElementById("noteInput");
    const dueDateInput = document.getElementById("dueDateInput");
    const task = input.value.trim();
    const note = noteInput.value.trim();
    const dueDate = dueDateInput.value;

    if (task.length > 0) {
        const li = document.createElement("li");

        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-content");

        const taskContent = document.createElement("span");
        taskContent.textContent = task;
        taskContainer.appendChild(taskContent);
        li.appendChild(taskContainer);

        if (dueDate) {
            const dueDateContent = document.createElement("span");
            dueDateContent.textContent = `Due: ${dueDate}`;
            dueDateContent.classList.add("due-date");
            li.appendChild(dueDateContent);
        }

        if (note.length > 0) {
            const noteContent = document.createElement("div");
            noteContent.textContent = note;
            noteContent.classList.add("notes");
            li.appendChild(noteContent);
        }

        const deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = "&#x2715;";
        deleteBtn.addEventListener("click", () => {
            li.remove();
        });

        li.appendChild(deleteBtn);
        document.getElementById("todoList").appendChild(li);
        input.value = "";
        noteInput.value = "";

        li.addEventListener("mouseover", () => {
            if (editMode) {
                deleteBtn.style.display = "inline";
                li.setAttribute("draggable", "true");
            } else {
                deleteBtn.style.display = "none";
                li.removeAttribute("draggable");
            }
        });

        li.addEventListener("mouseout", () => {
            deleteBtn.style.display = "none";
        });

        li.addEventListener("dragstart", handleDragStart);
        li.addEventListener("dragover", handleDragOver);
        li.addEventListener("dragleave", handleDragLeave);
        li.addEventListener("drop", handleDrop);
        li.addEventListener("dragend", handleDragEnd);
    }

    saveTasks();
}

let draggedItem;

function handleDragStart(e) {
    if (editMode) {
        this.classList.add('dragged');
        draggedItem = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }
}

function handleDragOver(e) {
    if (editMode) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        // Remove hovered class from all items
        const items = document.querySelectorAll('#todoList li');
        items.forEach(item => item.classList.remove('hovered'));

        // Add hovered class to the current item
        this.classList.add('hovered');
        return false;
    }
}

function handleDragLeave() {
    if (editMode) {
        // Remove hovered class
        this.classList.remove('hovered');
    }
}

function handleDrop(e) {
    if (editMode) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (draggedItem !== this) {
            draggedItem.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }

        // Remove hovered class
        this.classList.remove('hovered');
        return false;
    }
}

function handleDragEnd() {
    this.classList.remove('dragged');

    // Remove hovered class from all items
    const items = document.querySelectorAll('#todoList li');
    items.forEach(item => item.classList.remove('hovered'));
}

const toggleThemeBtn = document.getElementById("toggleThemeBtn");
toggleThemeBtn.addEventListener("change", toggleTheme);

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

function saveTasks() {
    const tasks = document.getElementById("todoList").innerHTML;
    localStorage.setItem("savedTasks", tasks);
}

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", resetStorage);