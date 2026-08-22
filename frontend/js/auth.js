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


function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================
   LOGIN
========================= */

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


            if (!password) {

                showError(
                    "passwordError",
                    "Password is required."
                );

                valid = false;

            }


            if (!valid) return;


            const submitButton =
                loginForm.querySelector(
                    "button[type='submit']"
                );


            const originalText =
                submitButton.textContent;


            try {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Signing in...";


                const response =
                    await apiRequest(
                        "/auth/login",
                        {
                            method: "POST",

                            body: JSON.stringify({

                                email,
                                password

                            })
                        }
                    );


                if (response.token) {

                    localStorage.setItem(
                        "corely_token",
                        response.token
                    );

                }


                if (response.user) {

                    localStorage.setItem(
                        "corely_user",
                        JSON.stringify(
                            response.user
                        )
                    );

                }


                window.location.href =
                    "dashboard.html";


            }
            catch (error) {

                showError(
                    "passwordError",
                    error.message
                );

            }
            finally {

                submitButton.disabled = false;

                submitButton.textContent =
                    originalText;

            }

        }
    );

}


/* =========================
   REGISTER
========================= */

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


            [
                "nameError",
                "studentIdError",
                "emailError",
                "passwordError",
                "confirmPasswordError"
            ].forEach(clearError);


            let valid = true;


            if (name.length < 2) {

                showError(
                    "nameError",
                    "Enter your full name."
                );

                valid = false;

            }


            if (studentId.length < 3) {

                showError(
                    "studentIdError",
                    "Enter a valid student ID."
                );

                valid = false;

            }


            if (!validEmail(email)) {

                showError(
                    "emailError",
                    "Enter a valid email address."
                );

                valid = false;

            }


            if (password.length < 8) {

                showError(
                    "passwordError",
                    "Password must contain at least 8 characters."
                );

                valid = false;

            }


            if (password !== confirmPassword) {

                showError(
                    "confirmPasswordError",
                    "Passwords do not match."
                );

                valid = false;

            }


            if (!valid) return;


            const submitButton =
                registerForm.querySelector(
                    "button[type='submit']"
                );


            const originalText =
                submitButton.textContent;


            try {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Creating account...";


                const response =
                    await apiRequest(
                        "/auth/register",
                        {
                            method: "POST",

                            body: JSON.stringify({

                                name,
                                studentId,
                                email,
                                password

                            })
                        }
                    );


                if (response.token) {

                    localStorage.setItem(
                        "corely_token",
                        response.token
                    );

                }


                if (response.user) {

                    localStorage.setItem(
                        "corely_user",
                        JSON.stringify(
                            response.user
                        )
                    );

                }


                alert(
                    response.message ||
                    "Account created successfully."
                );


                registerForm.reset();


                window.location.href =
                    "login.html";


            }
            catch (error) {

                showError(
                    "emailError",
                    error.message
                );

            }
            finally {

                submitButton.disabled = false;

                submitButton.textContent =
                    originalText;

            }

        }
    );

}


/* =========================
   MOBILE MENU
========================= */

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );


const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


if (mobileMenuBtn && mobileMenu) {

    mobileMenuBtn.addEventListener(
        "click",
        function() {

            mobileMenu.classList.toggle(
                "show"
            );

        }
    );

}