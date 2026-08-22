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
        function(event) {

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


            alert(
                "Frontend validation successful.\n\n" +
                "Backend authentication will be connected next."
            );

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
        function(event) {

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


            alert(
                "Registration form validated successfully.\n\n" +
                "Backend registration will be connected next."
            );

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