// common.js
function loadTasks(status, searchTerm = '', priority = '', dueDate = '') {
    $.ajax({
        url: `/api/tasks/${status}/`,
        method: 'GET',
        success: function (data) {
            const taskList = $(`#${status}List`);
            taskList.empty();
            
            // Apply search and filter
            data = data.filter(task => {
                console.log(task.due_date.slice(0,10),dueDate)
                return (task.title.includes(searchTerm) || task.description.includes(searchTerm))
                 &&
                       (priority === '' || task.priority.toLowerCase() === priority.toLowerCase())
                        &&
                       (dueDate === '' || task.due_date.slice(0,10) === dueDate);
            });
            
            if (data.length > 0) {
                data.forEach(task => {
                    taskList.append(`
                        <div class="bg-white p-4 rounded-lg shadow-md">
                            <p>${task.category}</p>
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
    
    ['in_progress', 'completed', 'overdue'].forEach(status => {
        loadTasks(status, searchTerm, priority, dueDate);
    });
}

$(document).ready(function () {
    // Load tasks initially
    ['in_progress', 'completed', 'overdue'].forEach(status => {
        loadTasks(status);
    });
    
    // Attach filter button click event
    $('#filterBtn').on('click', function () {
        applyFilters();
    });
});

export { loadTasks, deleteTask };
