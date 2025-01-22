document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskTime = document.getElementById('task-time');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage
    loadTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = taskInput.value;
        const time = taskTime.value;
        addTask(task, time);
        saveTask(task, time);
        taskInput.value = '';
        taskTime.value = '';
        sortTasks();
    });

    function addTask(task, time) {
        const li = document.createElement('li');
        
        // Create a container for task name and delete button
        const taskHeader = document.createElement('div');
        taskHeader.className = 'task-header';

        const span = document.createElement('span');
        span.textContent = `${task} (Due: ${new Date(time).toLocaleString()})`;
        const button = document.createElement('button');
        button.textContent = 'Delete';
        button.addEventListener('click', () => {
            taskList.removeChild(li);
            deleteTask(task, time);
            sortTasks();
        });
        taskHeader.appendChild(span);
        taskHeader.appendChild(button);
        li.appendChild(taskHeader);

        // Create a timer display for each task
        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'task-timer';
        li.appendChild(timerDisplay);

        taskList.appendChild(li);

        const taskTime = new Date(time).getTime();
        const now = new Date().getTime();
        const timeDiff = taskTime - now;

        if (timeDiff > 0) {
            startTimer(timeDiff, timerDisplay, task);
        } else {
            timerDisplay.textContent = 'Due time is over';
        }
    }

    function startTimer(duration, display, task) {
        let timer = duration, hours, minutes, seconds;
        const interval = setInterval(() => {
            hours = Math.floor((timer / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((timer / (1000 * 60)) % 60);
            seconds = Math.floor((timer / 1000) % 60);

            display.textContent = `Timer: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timer <= 0) {
                clearInterval(interval);
                display.textContent = 'Due time is over';
            }
            timer -= 1000;
        }, 1000);
    }

    function saveTask(task, time) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ task, time });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(({ task, time }) => addTask(task, time));
        sortTasks();
    }

    function deleteTask(task, time) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t.task !== task || t.time !== time);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function sortTasks() {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => {
            const timeA = new Date(a.querySelector('span').textContent.match(/\(Due: (.+)\)/)[1]).getTime();
            const timeB = new Date(b.querySelector('span').textContent.match(/\(Due: (.+)\)/)[1]).getTime();
            return timeA - timeB;
        });
        tasks.forEach(task => taskList.appendChild(task));
    }
});
