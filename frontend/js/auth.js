// ========================================
// ERROR FUNCTIONS
// ========================================

function showError(id, message) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.textContent = message;

    element.classList.add("show");
}


function clearError(id) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.textContent = "";

    element.classList.remove("show");
}


// ========================================
// EMAIL VALIDATION
// ========================================

function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const password =
                document.getElementById(
                    "password"
                ).value;


            clearError("emailError");
            clearError("passwordError");


            let valid = true;


            // Email
            if (!email) {

                showError(
                    "emailError",
                    "Email is required."
                );

                valid = false;

            }
            else if (!validEmail(email)) {

                showError(
                    "emailError",
                    "Enter a valid email address."
                );

                valid = false;

            }


            // Password
            if (!password) {

                showError(
                    "passwordError",
                    "Password is required."
                );

                valid = false;

            }


            if (!valid) {
                return;
            }


            // --------------------------------
            // Send login request
            // --------------------------------

            const button =
                loginForm.querySelector(
                    "button[type='submit']"
                );


            try {

                if (button) {

                    button.disabled = true;

                    button.textContent =
                        "Signing in...";

                }


                await loginUser(
                    email,
                    password
                );


                // Login successful
                window.location.href =
                    "dashboard.html";

            }
            catch (error) {

                showError(
                    "passwordError",
                    error.message ||
                    "Login failed."
                );

            }
            finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "Sign In";

                }

            }

        }
    );

}


// ========================================
// REGISTER
// ========================================

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const studentId =
                document.getElementById(
                    "studentId"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const password =
                document.getElementById(
                    "password"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            // Clear previous errors
            clearError("nameError");
            clearError("studentIdError");
            clearError("emailError");
            clearError("passwordError");
            clearError("confirmPasswordError");


            let valid = true;


            // Name
            if (name.length < 2) {

                showError(
                    "nameError",
                    "Enter your full name."
                );

                valid = false;

            }


            // Student ID
            if (studentId.length < 3) {

                showError(
                    "studentIdError",
                    "Enter a valid student ID."
                );

                valid = false;

            }


            // Email
            if (!validEmail(email)) {

                showError(
                    "emailError",
                    "Enter a valid email address."
                );

                valid = false;

            }


            // Password
            if (password.length < 8) {

                showError(
                    "passwordError",
                    "Password must contain at least 8 characters."
                );

                valid = false;

            }


            // Confirm password
            if (password !== confirmPassword) {

                showError(
                    "confirmPasswordError",
                    "Passwords do not match."
                );

                valid = false;

            }


            if (!valid) {
                return;
            }


            const button =
                registerForm.querySelector(
                    "button[type='submit']"
                );


            try {

                if (button) {

                    button.disabled = true;

                    button.textContent =
                        "Creating account...";

                }


                await registerUser(
                    name,
                    studentId,
                    email,
                    password
                );


                alert(
                    "Corely account created successfully!"
                );


                // Go to login
                window.location.href =
                    "login.html";

            }
            catch (error) {

                showError(
                    "emailError",
                    error.message ||
                    "Registration failed."
                );

            }
            finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "Create Account";

                }

            }

        }
    );

}


// ========================================
// MOBILE MENU
// ========================================

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );


const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


if (
    mobileMenuBtn &&
    mobileMenu
) {

    mobileMenuBtn.addEventListener(
        "click",
        function() {

            mobileMenu.classList.toggle(
                "show"
            );

        }
    );

}