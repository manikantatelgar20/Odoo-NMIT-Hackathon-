document.addEventListener(
    "DOMContentLoaded",
    loadProfile
);


async function loadProfile() {

    let user = null;


    /*
     * First try backend.
     */

    try {

        const response =
            await apiRequest(
                "/auth/me"
            );


        user =
            response.user ||
            response.data ||
            response;

    }

    catch(error) {

        console.log(
            "Using stored profile:",
            error.message
        );

    }


    /*
     * Fallback to the user
     * saved during login.
     */

    if (!user) {

        try {

            user =
                JSON.parse(
                    localStorage.getItem(
                        "corelyUser"
                    )
                );

        }

        catch(error) {

            user = null;

        }

    }


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    displayProfile(
        user
    );

}


/* =========================
   DISPLAY PROFILE
========================= */

function displayProfile(
    user
) {

    const name =
        user.name ||
        user.full_name ||
        "Student";


    const email =
        user.email ||
        "--";


    const studentId =
        user.student_id ||
        user.studentId ||
        "--";


    const created =
        user.created_at ||
        user.createdAt;


    document.getElementById(
        "profileName"
    ).textContent =
        name;


    document.getElementById(
        "profileEmail"
    ).textContent =
        email;


    document.getElementById(
        "infoName"
    ).textContent =
        name;


    document.getElementById(
        "infoStudentId"
    ).textContent =
        studentId;


    document.getElementById(
        "infoEmail"
    ).textContent =
        email;


    document.getElementById(
        "infoCreated"
    ).textContent =
        created
            ? formatDate(created)
            : "--";


    const avatar =
        document.getElementById(
            "profileAvatar"
        );


    avatar.textContent =
        name
            .charAt(0)
            .toUpperCase();

}


/* =========================
   DATE
========================= */

function formatDate(
    value
) {

    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleDateString(
        [],
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "corelyToken"
    );

    localStorage.removeItem(
        "corelyUser"
    );


    window.location.href =
        "login.html";

}