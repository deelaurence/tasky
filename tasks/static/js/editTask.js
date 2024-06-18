import { validateField, validateForm } from './validateForm.js'; // Import form validation functions
import { loadTasks } from './common.js';

$(document).ready(function () {
    // Function to load users into the assignment dropdown
    function loadUsers() {
        $.ajax({
            url: '/api/users/',
            method: 'GET',
            success: function (users) {
                const select = $('select[name="assigned_to"]');
                select.empty();
                users.forEach(user => {
                    select.append(`<option value="${user.id}">${user.username}</option>`);
                });
            },
            error: function (error) {
                console.error('Error loading users:', error);
                alert('Failed to load users. Please try again.');
            }
        });
    }

    // Click handler for edit task button
    $(document).on('click', '.editTaskBtn', function () {
        const taskId = $(this).data('id');
        $.ajax({
            url: `/api/single-task/${taskId}/`,
            method: 'GET',
            success: function (task) {
                $('#taskModal').show();
                $('#modalTitle').text('Edit Task');
                $('#editTaskForm').data('id', taskId).html(`
                    <div class="form-group">
                        <input type="text" name="title" value="${task.title}" class="w-full mb-2 required px-3 py-2 border rounded" minlength="3" maxlength="50">
                        <span class="error-message text-red-500"></span>
                    </div>
                    <div class="form-group">
                        <textarea name="description" class="w-full mb-2 px-3 py-2 border rounded required" minlength="10" maxlength="200">${task.description}</textarea>
                        <span class="error-message text-red-500"></span>
                    </div>
                    <div class="form-group">
                        <select name="status" class="w-full mb-2 px-3 py-2 border rounded required">
                            <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="overdue" ${task.status === 'overdue' ? 'selected' : ''}>Overdue</option>
                        </select>
                        <span class="error-message text-red-500"></span>
                    </div>
                    <div class="form-group">
                        <select name="priority" class="w-full mb-2 px-3 py-2 border rounded required">
                            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                        <span class="error-message text-red-500"></span>
                    </div>
                    <div class="form-group">
                        <input type="datetime-local" name="due_date" value="${task.due_date.slice(0,-1)}" class="w-full required mb-2 px-3 py-2 border rounded">
                        <span class="error-message text-red-500"></span>
                    </div>
                    <div class="form-group">
                        <select name="category" class="w-full mb-2 px-3 py-2 border rounded required">
                            <option value="design" ${task.category === 'design' ? 'selected' : ''}>Design</option>
                            <option value="cloud" ${task.category === 'cloud' ? 'selected' : ''}>Cloud</option>
                            <option value="testing" ${task.category === 'testing' ? 'selected' : ''}>Testing</option>
                            <option value="development" ${task.category === 'development' ? 'selected' : ''}>Development</option>
                        </select>
                        <span class="error-message text-red-500"></span>
                    </div>
                    <div class="form-group">
                        <select name="assigned_to" class="w-full mb-2 px-3 py-2 border required rounded">
                            <!-- User options will be loaded dynamically -->
                        </select>
                        <span class="error-message text-red-500"></span>
                    </div>
                    <button type="submit" id="saveEditBtn" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                    <button type="button" class="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2 cancelBtn">Cancel</button>
                `);

                // Load users for assignment
                loadUsers();

                // Preselect assigned_to if it's a string (assuming no multiple assignment)
                if (task.assigned_to) {
                    $('select[name="assigned_to"]').val(task.assigned_to);
                }

       
            },
            error: function (error) {
                console.error('Error loading task:', error);
                alert('Failed to load task details. Please try again.');
            }
        });
    });

    // Form submission for editing task
    $(document).on('submit', '#editTaskForm', function (e) {
        e.preventDefault();
        const formData = $(this).serialize();
        const taskId = $(this).data('id');
        const url = `/api/task/update/${taskId}/`;
        $.ajax({
            url: url,
            method: 'POST',
            data: formData,
            success: function (response) {
                if (response.success) {
                    $('#taskModal').hide();
                    // Reload tasks for all statuses
                    ['in_progress', 'completed', 'overdue'].forEach(status => {
                        loadTasks(status);
                    });
                } else {
                    alert(response.message);
                }
            },
            error: function (error) {
                console.error('Error saving task:', error);
                alert('Failed to save task. Please try again.');
            }
        });
    });

    // Cancel button click to close the modal
    $(document).on('click', '.cancelBtn', function () {
        $('#taskModal').hide();
    });
});
