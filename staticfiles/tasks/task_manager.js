$(document).ready(function() {
    function loadTasks(status, containerId) {
        $.ajax({
            url: `/api/tasks/${status}/`,
            method: 'GET',
            success: function(data) {
                $(containerId).empty();
                data.forEach(function(task) {
                    $(containerId).append(`
                        <div class="bg-white p-4 rounded-lg shadow mb-4">
                            <h3 class="text-lg font-bold">${task.title}</h3>
                            <p>${task.description}</p>
                            <p class="text-sm text-gray-600">Due: ${task.due_date}</p>
                        </div>
                    `);
                });
            }
        });
    }

    loadTasks('in_progress', '#in-progress-tasks');
    loadTasks('completed', '#completed-tasks');
    loadTasks('overdue', '#overdue-tasks');
});
