document.addEventListener("DOMContentLoaded", function() {
    const rows = document.querySelectorAll("#taskTable tbody tr");
    rows.forEach(row => addEventListeners(row));

    async function updateTask(row, taskId, taskName, dueDate, listId) {
        const response = await fetch('/user/update_task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task_id: taskId, task_name: taskName, due_date: dueDate, list_id: listId })
        });

        const result = await response.json();
        if (result.success) {
            alert('Task updated successfully');
        } else {
            alert('Error updating task');
        }
    }

    async function updateTaskStatus(taskId, newStatus) {
        const response = await fetch('/user/update_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task_id: taskId, status: newStatus })
        });

        const result = await response.json();
        return result.success;
    }

    function addEventListeners(row) {
        row.querySelector('.delete-task-btn').addEventListener('click', async function() {
            const taskId = row.dataset.taskId;
            const response = await fetch('/user/delete_task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: taskId })
            });

            const result = await response.json();
            if (result.success) {
                document.getElementById("taskTable").deleteRow(row.rowIndex);
            } else {
                alert('Error deleting task');
            }
        });

        row.querySelector('.save-task-btn').addEventListener('click', async function() {
            const taskId = row.dataset.taskId;
            const taskName = row.children[0].textContent;
            const dueDate = row.children[1].textContent;
            const listId = row.querySelector('select').value;

            // Handle the date conversion robustly
            const date = new Date(dueDate);
            if (isNaN(date.getTime())) {
                alert('Invalid date format. Please use YYYY-MM-DD.');
                return;
            }

            const formattedDate = date.toISOString().split('T')[0];
            await updateTask(row, taskId, taskName, formattedDate, listId);
        });

        row.querySelector('.update-status-btn').addEventListener('click', async function() {
            const taskId = row.dataset.taskId;
            const currentStatus = this.textContent;
            const newStatus = currentStatus === 'Incomplete' ? 'Complete' : 'Incomplete';

            const success = await updateTaskStatus(taskId, newStatus);
            if (success) {
                this.textContent = newStatus;
                this.classList.toggle('btn-success', newStatus === 'Complete');
                this.classList.toggle('btn-warning', newStatus === 'Incomplete');
            } else {
                alert('Error updating status');
            }
        });
    }

    document.getElementById("allTasksBtn").addEventListener("click", function() {
        filterTasks("all");
    });

    document.getElementById("completedTasksBtn").addEventListener("click", function() {
        filterTasks("completed");
    });

    document.getElementById("incompleteTasksBtn").addEventListener("click", function() {
        filterTasks("incomplete");
    });

    function filterTasks(filter) {
        const rows = document.querySelectorAll("#taskTable tbody tr");
        rows.forEach(row => {
            const statusBtn = row.querySelector('.update-status-btn');
            if (!statusBtn) return;

            const statusText = statusBtn.textContent.trim();

            if (filter === "all") {
                row.style.display = "";
            } else if (filter === "completed" && statusText === 'Complete') {
                row.style.display = "";
            } else if (filter === "incomplete" && statusText === 'Incomplete') {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }
});
