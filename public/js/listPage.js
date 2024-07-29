document.addEventListener('DOMContentLoaded', function() {
    const updateStatusButtons = document.querySelectorAll('.update-status-btn');
    const editTaskButtons = document.querySelectorAll('.edit-task-btn');
    const deleteTaskButtons = document.querySelectorAll('.delete-task-btn');

    updateStatusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.closest('tr').dataset.taskId;
            // Handle status update logic here
        });
    });

    editTaskButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.closest('tr').dataset.taskId;
            // Handle edit logic here
        });
    });

    deleteTaskButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.closest('tr').dataset.taskId;
            // Handle delete logic here
        });
    });
});
