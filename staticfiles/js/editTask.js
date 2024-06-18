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


// editTask.js
$(document).on('click', '.editTaskBtn', function () {
    const taskId = $(this).data('id');
    $.ajax({
        url: `/api/single-task/${taskId}/`,
        method: 'GET',
        success: function (task) {
            console.log(task);
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
                    <input type="datetime-local" name="due_date" value="${task.due_date}" class="w-full required mb-2 px-3 py-2 border rounded">
                    <span class="error-message text-red-500"></span>
                </div>
                <div class="form-group">
                    <select name="category" class="w-full mb-2 px-3 py-2 border rounded required">
                        <option value="design" ${task.category==='design'?'selected':''}">Design</option>
                        <option value="cloud" ${task.category==='cloud'?'selected':''}">Cloud</option>
                        <option value="testing" ${task.category==='testing'?'selected':''}">Testing</option>
                        <option value="development" ${task.category==='development'?'selected':''}">Development</option>
                    </select>
                    <span class="error-message text-red-500"></span>
                </div>
                <div class="form-group">
                    <select name="assigned_to" class="w-full mb-2 px-3 py-2 border required rounded">
                        <!-- User options will be loaded dynamically -->
                    </select>
                    <span class="error-message text-red-500"></span>
                </div>
                <button type="submit" id="saveTaskBtn" class="bg-blue-500 text-white px-4 py-2 rounded" disabled>Save</button>
                <button type="button" class="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2 cancelBtn">Cancel</button>
            `);

            // Load users for assignment
            loadUsers();

            // Preselect assigned_to if it's a string (assuming no multiple assignment)
            if (task.assigned_to) {
                $('select[name="assigned_to"]').val(task.assigned_to);
            }

            // Enable the submit button if all fields are filled
            $('#editTaskForm input, #editTaskForm textarea, #editTaskForm select').on('input change', function () {
                validateField($(this));
                validateForm();
            });
        },
        error: function (error) {
            console.error('Error loading task:', error);
            alert('Failed to load task details. Please try again.');
        }
    });
});

$(document).on('click', '.cancelBtn', function () {
    $('#taskModal').hide();
});

$('#taskModal').on('click', function (e) {
    if (e.target === this) {
        $(this).hide();
    }
});

function validateField($field) {
    const value = $field.val().trim();
    const minLength = $field.attr('minlength');
    const maxLength = $field.attr('maxlength');
    let errorMessage = '';

    if (value === '') {
        errorMessage = 'This field is required.';
    } else if (minLength && value.length < minLength) {
        errorMessage = `Minimum length is ${minLength} characters.`;
    } else if (maxLength && value.length > maxLength) {
        errorMessage = `Maximum length is ${maxLength} characters.`;
    }

    $field.next('.error-message').text(errorMessage);
}

function validateForm() {
    let isValid = true;

    $('#editTaskForm .required').each(function () {
        const $this = $(this);
        validateField($this);

        if ($this.next('.error-message').text() !== '') {
            isValid = false;
        }
    });

    $('#saveTaskBtn').prop('disabled', !isValid);
}
