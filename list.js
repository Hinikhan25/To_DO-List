document.addEventListener('DOMContentLoaded', () => {
    const todoItems = document.getElementById('todoItems');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const newTaskInput = document.getElementById('newTaskInput');
    const filterTasks = document.getElementById('filterTasks');
    const toggleModeBtn = document.getElementById('toggleModeBtn');
    
    let tasks = getTasksFromLocalStorage();
    renderTasks();

    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            newTaskInput.value = '';
        }
    });

    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const taskText = newTaskInput.value.trim();
            if (taskText) {
                addTask(taskText);
                newTaskInput.value = '';
            }
        }
    });

    todoItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const taskText = e.target.previousElementSibling.textContent.trim();
            tasks = tasks.filter(task => task.text !== taskText);
            saveTasksToLocalStorage(tasks);
            renderTasks();
        } else if (e.target.type === 'checkbox') {
            const taskText = e.target.nextElementSibling.textContent.trim();
            tasks = tasks.map(task => {
                if (task.text === taskText) {
                    task.completed = e.target.checked;
                }
                return task;
            });
            saveTasksToLocalStorage(tasks);
        }
    });

    filterTasks.addEventListener('change', renderTasks);

    toggleModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleModeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '☾';
    });

    function addTask(taskText) {
        const newTask = { text: taskText, completed: false };
        tasks = [...tasks, newTask];
        saveTasksToLocalStorage(tasks);
        renderTasks();
    }

    function renderTasks() {
        todoItems.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filterTasks.value === 'completed') return task.completed;
            if (filterTasks.value === 'incomplete') return !task.completed;
            return true;
        });
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <label>${task.text}</label>
                <span class="delete-btn">❌</span>
            `;
            todoItems.appendChild(li);
        });
    }

    function getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
