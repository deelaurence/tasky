function initializeDeleteTask() {
    // Delete task button click
    $(document).on('click', '.deleteTaskBtn', function () {
        const taskId = $(this).data('id');
        $.ajax({
            url: `/api/task/delete/${taskId}/`,
            method: 'DELETE',
            success: function (response) {
                if (response.success) {
                    // Reload tasks for all statuses
                    ['in_progress', 'completed', 'overdue'].forEach(status => {
                        loadTasks(status);
                    });
                } else {
                    alert(response.message);
                }
            },
            error: function (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task. Please try again.');
            }
        });
    });
}
