function initializeTaskManagement() {
    // Load tasks based on status
    function loadTasks(status) {
        $.ajax({
            url: `/api/tasks/${status}/`,
            method: 'GET',
            success: function (data) {
                const taskList = $(`#${status}List`);
                taskList.empty();
                if (data.length > 0) {
                    data.forEach(task => {
                        taskList.append(`
                            <div class="bg-white p-4 rounded-lg shadow-md">
                                <h3 class="text-xl font-bold">${task.title}</h3>
                                <p>${task.description}</p>
                                <p>Priority: ${task.priority}</p>
                                <p>Due: ${task.due_date}</p>
                                <p>Assigned to: ${task.assigned_to}</p>
                                <button class="editTaskBtn bg-yellow-500 text-white px-4 py-2 rounded" data-id="${task.id}">Edit</button>
                                <button class="deleteTaskBtn bg-red-500 text-white px-4 py-2 rounded" data-id="${task.id}">Delete</button>
                            </div>
                        `);
                    });
                } else {
                    taskList.append('<p>[Nothing here yet]</p>');
                }
            }
        });
    }

    // Load tasks for each status
    ['in_progress', 'completed', 'overdue'].forEach(status => {
        loadTasks(status);
    });
}
