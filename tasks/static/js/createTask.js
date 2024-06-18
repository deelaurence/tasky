// createTask.js

import { validateForm } from './validateForm.js'; // Import form validation function
import { loadTasks,deleteTask } from './common.js';


$(document).ready(function () {
    $('#addTaskBtn').on('click', function () {
        $('#taskModal').show();
        $('#modalTitle').text('Add Task');
        $('#taskForm').html(`
            <div class="form-group">
                <input type="text" name="title" placeholder="Title" class="w-full mb-2 px-3 py-2 required border rounded" minlength="3" maxlength="50">
                <span class="error-message text-red-500"></span>
            </div>
            <div class="form-group">
                <textarea name="description" placeholder="Description" class="w-full mb-2 px-3 py-2 border required rounded" minlength="10" maxlength="200"></textarea>
                <span class="error-message text-red-500"></span>
            </div>
            <div class="form-group">
                <select name="status" class="w-full mb-2 px-3 py-2 border rounded required">
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                </select>
                <span class="error-message text-red-500"></span>
            </div>
            <div class="form-group">
                <select name="priority" class="w-full mb-2 px-3 py-2 border rounded required">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <span class="error-message text-red-500"></span>
            </div>
            <div class="form-group">
                <input type="datetime-local" name="due_date" class="w-full mb-2 px-3 py-2 border rounded required">
                <span class="error-message text-red-500"></span>
            </div>
            <div class="form-group">
                <select name="category" class="w-full mb-2 px-3 py-2 border rounded required">
                    <option value="design">Design</option>
                    <option value="cloud">Cloud</option>
                    <option value="testing">Testing</option>
                    <option value="development">Development</option>
                </select>
                <span class="error-message text-red-500"></span>
            </div>
            <div class="form-group">
                <select name="assigned_to" class="w-full mb-2 px-3 py-2 border rounded required">
                    <!-- User options will be loaded dynamically -->
                </select>
                <span class="error-message text-red-500"></span>
            </div>
            <button type="submit" id="saveTaskBtn" class="bg-blue-500 text-white px-4 py-2 rounded" disabled>Save</button>
            <button type="button" class="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2 cancelBtn">Cancel</button>
        `);
        
        loadUsers(); // Load users for assignment

        // Enable the submit button if all fields are filled
        $('#taskForm input, #taskForm textarea, #taskForm select').on('input change', function () {
            validateForm();
        });

        // Cancel button click to close the modal
        $(document).on('click', '.cancelBtn', function () {
            $('#taskModal').hide();
        });
    });

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

    // Form submission
    $(document).on('submit', '#taskForm', function (e) {
        e.preventDefault();
        console.log(e)
        const formData = $(this).serialize();
        const url = '/api/task/create/';
        console.log("calling create")
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

    // Initial validation check
    validateForm();
});
