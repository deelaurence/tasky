$(document).ready(function () {
    // Load tasks initially
    ['in_progress', 'completed', 'overdue'].forEach(status => {
        loadTasks(status);
    });

    // Attach change event to filter inputs
    $('#searchInput, #priorityFilter, #dueDateFilter, #categoryFilter').on('input change', function () {
        applyFilters();
    });
});

function loadTasks(status, searchTerm = '', priority = '', dueDate = '', category='') {
    $.ajax({
        url: `/api/tasks/${status}/`,
        method: 'GET',
        success: function (data) {
            const taskList = $(`#${status}List`);
            taskList.empty();

            // Apply search and filter
            data = data.filter(task => {
                console.log(task.category,category)
                return (task.title.includes(searchTerm) || task.description.includes(searchTerm))
                    && (priority === '' || task.priority.toLowerCase() === priority.toLowerCase())
                    && (dueDate === '' || task.due_date.slice(0,10) === dueDate)
                    && (category === '' || task.category.toLowerCase() === category.toLowerCase());
            });

            if (data.length > 0) {
                data.forEach(task => {
                    taskList.append(`
                        <div class="bg-gray-50 flex flex-col p-4 rounded-lg shadow-md">
                            <div class="flex items-center gap-2 ">
                                <p class="${task.priority === 'high' ? 'text-red-500 bg-gray-200' :
                                    task.priority === 'medium' ? 'text-yellow-500 bg-gray-200' : 
                                    'text-green-500 bg-gray-200'} text-xs rounded-lg p-1 px-2 capitalize">${task.priority}</p>
                                <p class="text-xs text-purple-500 rounded-md p-1 px-2 bg-gray-200">${task.category}</p>
                                <p class="text-xs rounded-md p-1 px-2 bg-gray-200">${task.due_date.slice(0,10)}</p>
                            </div>    
                            <h3 class="text-xl font-semibold my-6">${task.title}</h3>
                            <p class="text-gray-600 text-sm mb-4">${task.description}</p>
                            <div class="flex items-center gap-2 justify-between">
                                <p class="rounded-lg justify-self-start text-xs"><span class="text-sm rounded-lg bg-gray-200 p-1 px-2 justify-self-start text-blue-600">${task.assigned_to}</span></p>
                                <div>
                                    <button class="editTaskBtn text-gray-600 underline py-2 rounded" data-id="${task.id}">Edit</button>
                                    <button class="deleteTaskBtn text-red-600 underline py-2 rounded" data-id="${task.id}">Delete</button>
                                </div>
                            </div>
                        </div>
                    `);
                });
            } else {
                taskList.append('<p>[Nothing here yet]</p>');
            }
        }
    });
}

function deleteTask(taskId) {
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
}

function applyFilters() {
    const searchTerm = $('#searchInput').val();
    const priority = $('#priorityFilter').val();
    const dueDate = $('#dueDateFilter').val();
    const category = $('#categoryFilter').val();

    ['in_progress', 'completed', 'overdue'].forEach(status => {
        loadTasks(status, searchTerm, priority, dueDate, category);
    });
}

$(document).ready(function () {
    // Load tasks initially
    ['in_progress', 'completed', 'overdue'].forEach(status => {
        loadTasks(status);
    });

    // Attach change event to filter inputs
    $('#searchInput, #priorityFilter, #dueDateFilter, #categoryFilter').on('input change', function () {
        applyFilters();
    });
});

export { loadTasks, deleteTask };
