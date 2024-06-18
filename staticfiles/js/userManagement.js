function initializeUserManagement() {
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
}
