document.addEventListener('DOMContentLoaded', function() {
    const updateStatusButtons = document.querySelectorAll('.update-status-btn');
    const deleteTaskButtons = document.querySelectorAll('.delete-task-btn');
    const saveTaskButtons = document.querySelectorAll('.save-task-btn');

    updateStatusButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const taskId = this.closest('tr').dataset.taskId;
            const currentStatus = this.textContent.trim();
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
    });

    deleteTaskButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const taskId = this.closest('tr').dataset.taskId;
            const response = await fetch('/user/delete_task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: taskId })
            });

            const result = await response.json();
            if (result.success) {
                this.closest('tr').remove();
            } else {
                alert('Error deleting task');
            }
        });
    });

    saveTaskButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const row = this.closest('tr');
            const taskId = row.dataset.taskId;
            const taskName = row.querySelector('.task-name').textContent;
            const dueDate = row.querySelector('.due-date').textContent;

            // Handle the date conversion robustly
            const date = new Date(dueDate);
            if (isNaN(date.getTime())) {
                alert('Invalid date format. Please use YYYY-MM-DD.');
                return;
            }

            const formattedDate = date.toISOString().split('T')[0];
            await updateTask(row, taskId, taskName, formattedDate);
        });
    });

    async function updateTask(row, taskId, taskName, dueDate) {
        const response = await fetch('/user/update_task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task_id: taskId, task_name: taskName, due_date: dueDate })
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
});
