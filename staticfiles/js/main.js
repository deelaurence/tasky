// main.js
import { loadTasks, deleteTask } from './common.js';

$(document).ready(function () {
    // Load tasks for each status
    ['in_progress', 'completed', 'overdue'].forEach(status => {
        loadTasks(status);
    });

    // Delegate event for delete task buttons
    $(document).on('click', '.deleteTaskBtn', function () {
        const taskId = $(this).data('id');
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(taskId);
        }
    });
});
