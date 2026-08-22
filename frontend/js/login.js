const API_URL =
    "http://localhost:5000/api";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupLogin();

        setupPassword();

        startParticles();

    }
);


/* =====================================================
   LOGIN
===================================================== */

function setupLogin() {

    const form =
        document.getElementById(
            "loginForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            clearErrors();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("password")
                    .value;


            let valid = true;


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


            if (!password) {

                showError(
                    "passwordError",
                    "Password is required."
                );

                valid = false;

            }


            if (!valid) return;


            const button =
                form.querySelector(
                    ".login-button"
                );


            const original =
                button.innerHTML;


            button.disabled = true;

            button.innerHTML =
                `
                <span>
                    AUTHENTICATING...
                </span>

                <b>
                    ⟳
                </b>
                `;


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    email,
                                    password

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Login failed."
                    );

                }


                /* SAVE TOKEN */

                localStorage.setItem(
                    "corelyToken",
                    data.token
                );


                localStorage.setItem(
                    "token",
                    data.token
                );


                if (data.user) {

                    localStorage.setItem(
                        "corelyUser",
                        JSON.stringify(
                            data.user
                        )
                    );

                }


                button.innerHTML =
                    `
                    <span>
                        LOGIN SUCCESSFUL
                    </span>

                    <b>
                        ✓
                    </b>
                    `;


                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    700
                );

            }
            catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showError(
                    "passwordError",
                    error.message
                );


                button.innerHTML =
                    original;


                button.disabled =
                    false;

            }

        }
    );

}


/* =====================================================
   PASSWORD
===================================================== */

function setupPassword() {

    const password =
        document.getElementById(
            "password"
        );


    const button =
        document.getElementById(
            "showPassword"
        );


    if (
        !password ||
        !button
    ) return;


    button.addEventListener(
        "click",
        () => {

            if (
                password.type ===
                "password"
            ) {

                password.type =
                    "text";

                button.textContent =
                    "HIDE";

            }
            else {

                password.type =
                    "password";

                button.textContent =
                    "SHOW";

            }

        }
    );

}


/* =====================================================
   VALIDATION
===================================================== */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


function showError(
    id,
    message
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.textContent =
        message;

}


function clearErrors() {

    const errors =
        document.querySelectorAll(
            ".error"
        );


    errors.forEach(
        error => {

            error.textContent =
                "";

        }
    );

}


/* =====================================================
   PARTICLES
===================================================== */

function startParticles() {

    const canvas =
        document.getElementById(
            "particles"
        );


    if (!canvas) return;


    const ctx =
        canvas.getContext(
            "2d"
        );


    let particles = [];


    function resize() {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;


        create();

    }


    function create() {

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
                    1.4 +
                    .3,

                speed:
                    Math.random() *
                    .3 +
                    .05,

                opacity:
                    Math.random() *
                    .4 +
                    .1

            });

        }

    }


    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        particles.forEach(
            particle => {

                particle.y -=
                    particle.speed;


                if (
                    particle.y < 0
                ) {

                    particle.y =
                        canvas.height;

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


    resize();


    window.addEventListener(
        "resize",
        resize
    );


    animate();

}