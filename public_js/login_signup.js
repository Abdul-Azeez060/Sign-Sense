function validatePasswords(){
    var pass = document.getElementById('pass').value;
    var conform_pass = document.getElementById('conform_pass').value;
    var error_message = document.getElementById('error-message');

    if(pass != conform_pass){
        error_message.innerHTML = "Passwords do not match!";
        return false;
    }
    error_message.textContent = "";
    return true;
}

// For alignment toggle between sign up and login views
const signButton = document.getElementById('Sign');
const loginButton = document.getElementById('login');
const mainDiv = document.getElementById('main-div');

signButton.addEventListener('click', () => {
    mainDiv.classList.toggle('show-signup');
});

loginButton.addEventListener('click', () => {
    mainDiv.classList.toggle('show-login');
});

function togglePasswordVisibility()
 {
const eyeIcons = document.querySelectorAll('.eye-icon');
eyeIcons.forEach((eyeIcon) => {
eyeIcon.addEventListener('click', () => {
    const passwordInput = eyeIcon.previousElementSibling;
    const isPasswordVisible = passwordInput.type === 'text';

    // Toggle the password visibility
    passwordInput.type = isPasswordVisible ? 'password' : 'text';

    // Toggle the eye icon
    eyeIcon.src = isPasswordVisible ? 'eye-close.png' : 'eye-open.png';
    eyeIcon.alt = isPasswordVisible ? 'eye-close' : 'eye-open';
});
});
}

// Call the function to add the event listener to the eye icons
togglePasswordVisibility();