// formValidation.js

// Function to validate a form field
export function validateField($field) {
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

// Function to validate the entire form
export function validateForm() {
    let isValid = true;

    $('#taskForm .required').each(function () {
        const $this = $(this);
        validateField($this);

        if ($this.next('.error-message').text() !== '') {
            isValid = false;
        }
    });

    $('#saveTaskBtn').prop('disabled', !isValid);
}
