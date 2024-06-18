
    $(document).ready(function () {
        // Load tasks based on status
        function loadTasks(status) {
            $.ajax({
                url: `/api/tasks/${status}/`,
                method: 'GET',
                success: function (data) {
                    $('#taskList').empty();
                    data.forEach(task => {
                        $('#taskList').append(`
                            <div class="bg-white p-4 rounded-lg shadow-md">
                                <h3 class="text-xl font-bold">${task.title}</h3>
                                <p>${task.description}</p>
                                <p>Priority: ${task.priority}</p>
                                <p>Due: ${task.due_date}</p>
                                <p>Assigned to: ${task.assigned_to.username}</p>
                                <button class="editTaskBtn bg-yellow-500 text-white px-4 py-2 rounded" data-id="${task.id}">Edit</button>
                                <button class="deleteTaskBtn bg-red-500 text-white px-4 py-2 rounded" data-id="${task.id}">Delete</button>
                            </div>
                        `);
                    });
                }
            });
        }

        // Initial load
        loadTasks('in_progress');

        // Add task button click
        $('#addTaskBtn').on('click', function () {
            $('#taskModal').show();
            $('#modalTitle').text('Add Task');
            $('#taskForm').html(`
                <input type="text" name="title" placeholder="Title" class="w-full mb-2 px-3 py-2 border rounded">
                <textarea name="description" placeholder="Description" class="w-full mb-2 px-3 py-2 border rounded"></textarea>
                <select name="status" class="w-full mb-2 px-3 py-2 border rounded">
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                </select>
                <select name="priority" class="w-full mb-2 px-3 py-2 border rounded">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <input type="datetime-local" name="due_date" class="w-full mb-2 px-3 py-2 border rounded">
                <input type="text" name="category" placeholder="Category" class="w-full mb-2 px-3 py-2 border rounded">
                <select name="assigned_to" class="w-full mb-2 px-3 py-2 border rounded">
                    <!-- User options will be loaded dynamically -->
                </select>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            `);
            loadUsers(); // Load users for assignment
        });

        // Function to load users into the assignment dropdown
        function loadUsers() {
            $.ajax({
                url: '/api/users/', // Adjust the URL according to your Django setup
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
            const formData = $(this).serialize();
            const url = $('#modalTitle').text() === 'Add Task' ? '/api/tasks/create/' : `/api/tasks/update/${$(this).data('id')}/`;
            $.ajax({
                url: url,
                method: 'POST',
                data: formData,
                success: function (response) {
                    if (response.success) {
                        $('#taskModal').hide();
                        loadTasks('in_progress');
                    } else {
                        console.log(response)
                        alert(response.message);
                    }
                },
                error: function (error) {
                    console.error('Error saving task:', error);
                    alert('Failed to save task. Please try again.');
                }
            });
        });

        // Edit task button click
        $(document).on('click', '.editTaskBtn', function () {
            const taskId = $(this).data('id');
            $.ajax({
                url: `/api/tasks/${taskId}/`,
                method: 'GET',
                success: function (task) {
                    $('#taskModal').show();
                    $('#modalTitle').text('Edit Task');
                    $('#taskForm').data('id', taskId).html(`
                        <input type="text" name="title" value="${task.title}" class="w-full mb-2 px-3 py-2 border rounded">
                        <textarea name="description" class="w-full mb-2 px-3 py-2 border rounded">${task.description}</textarea>
                        <select name="status" class="w-full mb-2 px-3 py-2 border rounded">
                            <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="overdue" ${task.status === 'overdue' ? 'selected' : ''}>Overdue</option>
                        </select>
                        <select name="priority" class="w-full mb-2 px-3 py-2 border rounded">
                            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                        <input type="datetime-local" name="due_date" value="${task.due_date}" class="w-full mb-2 px-3 py-2 border rounded">
                        <input type="text" name="category" value="${task.category}" class="w-full mb-2 px-3 py-2 border rounded">
                        <select name="assigned_to" class="w-full mb-2 px-3 py-2 border rounded">
                            <!-- User options will be loaded dynamically -->
                        </select>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                    `);
                    loadUsers(); // Load users for assignment
                },
                error: function (error) {
                    console.error('Error loading task:', error);
                    alert('Failed to load task details. Please try again.');
                }
            });
        });

        // Delete task button click
        $(document).on('click', '.deleteTaskBtn', function () {
            const taskId = $(this).data('id');
            $.ajax({
                url: `/api/tasks/delete/${taskId}/`,
                method: 'DELETE',
                success: function (response) {
                    if (response.success) {
                        loadTasks('in_progress');
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

        // Function to handle closing of modal
        $('#taskModal').on('click', function (e) {
            if (e.target === this) {
                $(this).hide();
            }
        });
    });
   
