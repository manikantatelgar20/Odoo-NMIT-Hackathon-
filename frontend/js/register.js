// =====================================================
// CORELY REGISTER
// PostgreSQL + Express Backend
// =====================================================

const API_URL = "http://localhost:5000/api";


document.addEventListener("DOMContentLoaded", function () {

    setupRegister();

    setupPasswordToggle(
        "password",
        "showPassword"
    );

    setupPasswordToggle(
        "confirmPassword",
        "showConfirmPassword"
    );

    startParticles();

});


// =====================================================
// REGISTER FORM
// =====================================================

function setupRegister() {

    const form =
        document.getElementById("registerForm");


    if (!form) {
        console.error(
            "Corely: registerForm not found."
        );
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            clearErrors();


            // -----------------------------------------
            // GET VALUES
            // -----------------------------------------

            const nameElement =
                document.getElementById("name");

            const studentIdElement =
                document.getElementById("studentId");

            const emailElement =
                document.getElementById("email");

            const passwordElement =
                document.getElementById("password");

            const confirmPasswordElement =
                document.getElementById(
                    "confirmPassword"
                );


            if (
                !nameElement ||
                !studentIdElement ||
                !emailElement ||
                !passwordElement ||
                !confirmPasswordElement
            ) {

                console.error(
                    "Corely: One or more registration fields are missing."
                );

                return;

            }


            const name =
                nameElement.value.trim();


            const studentId =
                studentIdElement.value.trim();


            const email =
                emailElement.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordElement.value;


            const confirmPassword =
                confirmPasswordElement.value;


            let valid = true;


            // -----------------------------------------
            // NAME
            // -----------------------------------------

            if (!name) {

                showError(
                    "nameError",
                    "Full name is required."
                );

                valid = false;

            }
            else if (name.length < 2) {

                showError(
                    "nameError",
                    "Enter your full name."
                );

                valid = false;

            }


            // -----------------------------------------
            // STUDENT ID
            // -----------------------------------------

            if (!studentId) {

                showError(
                    "studentIdError",
                    "Student ID is required."
                );

                valid = false;

            }
            else if (studentId.length < 3) {

                showError(
                    "studentIdError",
                    "Enter a valid student ID."
                );

                valid = false;

            }


            // -----------------------------------------
            // EMAIL
            // -----------------------------------------

            if (!email) {

                showError(
                    "emailError",
                    "Email is required."
                );

                valid = false;

            }
            else if (
                !isValidEmail(email)
            ) {

                showError(
                    "emailError",
                    "Enter a valid email address."
                );

                valid = false;

            }


            // -----------------------------------------
            // PASSWORD
            // -----------------------------------------

            if (!password) {

                showError(
                    "passwordError",
                    "Password is required."
                );

                valid = false;

            }
            else if (
                password.length < 8
            ) {

                showError(
                    "passwordError",
                    "Password must contain at least 8 characters."
                );

                valid = false;

            }


            // -----------------------------------------
            // CONFIRM PASSWORD
            // -----------------------------------------

            if (!confirmPassword) {

                showError(
                    "confirmPasswordError",
                    "Please confirm your password."
                );

                valid = false;

            }
            else if (
                password !== confirmPassword
            ) {

                showError(
                    "confirmPasswordError",
                    "Passwords do not match."
                );

                valid = false;

            }


            // -----------------------------------------
            // STOP IF INVALID
            // -----------------------------------------

            if (!valid) {
                return;
            }


            // -----------------------------------------
            // BUTTON
            // -----------------------------------------

            const button =
                form.querySelector(
                    ".register-button"
                );


            if (!button) {

                console.error(
                    "Corely: register button not found."
                );

                return;

            }


            const originalHTML =
                button.innerHTML;


            button.disabled = true;


            button.innerHTML = `
                <span>
                    CREATING ACCOUNT...
                </span>

                <b>
                    ⟳
                </b>
            `;


            // -----------------------------------------
            // SEND TO BACKEND
            // -----------------------------------------

            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    name: name,
                                    studentId: studentId,
                                    email: email,
                                    password: password
                                })
                        }
                    );


                // -------------------------------------
                // READ RESPONSE
                // -------------------------------------

                let data = {};

                try {

                    data =
                        await response.json();

                }
                catch {

                    data = {};

                }


                // -------------------------------------
                // BACKEND ERROR
                // -------------------------------------

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Registration failed."
                    );

                }


                // -------------------------------------
                // SUCCESS
                // -------------------------------------

                console.log(
                    "Registration successful:",
                    data
                );


                button.innerHTML = `
                    <span>
                        ACCOUNT CREATED
                    </span>

                    <b>
                        ✓
                    </b>
                `;


                // Small delay so user sees success

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    900
                );

            }
            catch (error) {

                console.error(
                    "Corely registration error:",
                    error
                );


                let message =
                    error.message;


                // -------------------------------------
                // NETWORK ERROR
                // -------------------------------------

                if (
                    error instanceof TypeError
                ) {

                    message =
                        "Cannot connect to Corely server. Make sure the backend is running.";

                }


                // -------------------------------------
                // SHOW ERROR
                // -------------------------------------

                showError(
                    "emailError",
                    message
                );


                button.innerHTML =
                    originalHTML;


                button.disabled =
                    false;

            }

        }
    );

}


// =====================================================
// PASSWORD SHOW / HIDE
// =====================================================

function setupPasswordToggle(
    inputId,
    buttonId
) {

    const input =
        document.getElementById(
            inputId
        );


    const button =
        document.getElementById(
            buttonId
        );


    if (!input || !button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            if (
                input.type ===
                "password"
            ) {

                input.type =
                    "text";

                button.textContent =
                    "HIDE";

            }
            else {

                input.type =
                    "password";

                button.textContent =
                    "SHOW";

            }

        }
    );

}


// =====================================================
// EMAIL VALIDATION
// =====================================================

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


// =====================================================
// SHOW ERROR
// =====================================================

function showError(
    id,
    message
) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.textContent =
        message;

}


// =====================================================
// CLEAR ERRORS
// =====================================================

function clearErrors() {

    const errors =
        document.querySelectorAll(
            ".error"
        );


    errors.forEach(
        function (element) {

            element.textContent =
                "";

        }
    );

}


// =====================================================
// ANIMATED PARTICLES
// =====================================================

function startParticles() {

    const canvas =
        document.getElementById(
            "particles"
        );


    if (!canvas) {
        return;
    }


    const ctx =
        canvas.getContext("2d");


    if (!ctx) {
        return;
    }


    let particles = [];


    // -----------------------------------------
    // RESIZE
    // -----------------------------------------

    function resize() {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;


        createParticles();

    }


    // -----------------------------------------
    // CREATE PARTICLES
    // -----------------------------------------

    function createParticles() {

        particles = [];


        const amount =
            window.innerWidth < 600
                ? 30
                : 70;


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            particles.push({

                x:
                    Math.random() *
                    canvas.width,

                y:
                    Math.random() *
                    canvas.height,

                size:
                    Math.random() *
                    1.5 +
                    0.3,

                speed:
                    Math.random() *
                    0.3 +
                    0.05,

                opacity:
                    Math.random() *
                    0.45 +
                    0.1

            });

        }

    }


    // -----------------------------------------
    // ANIMATE
    // -----------------------------------------

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        particles.forEach(
            function (particle) {

                particle.y -=
                    particle.speed;


                if (
                    particle.y < 0
                ) {

                    particle.y =
                        canvas.height;

                    particle.x =
                        Math.random() *
                        canvas.width;

                }


                ctx.beginPath();


                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    `rgba(
                        139,
                        92,
                        246,
                        ${particle.opacity}
                    )`;


                ctx.fill();

            }
        );


        requestAnimationFrame(
            animate
        );

    }


    // -----------------------------------------
    // START
    // -----------------------------------------

    resize();


    window.addEventListener(
        "resize",
        resize
    );


    animate();

}