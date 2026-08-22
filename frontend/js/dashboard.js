document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadUser();

        await loadDashboard();

        await loadTasks();

        await loadSchedule();

        await loadAI();

    }
);


/* =========================================
   USER
========================================= */

async function loadUser() {

    const storedUser =
        localStorage.getItem(
            "corelyUser"
        );


    if (storedUser) {

        try {

            const user =
                JSON.parse(
                    storedUser
                );

            updateUser(
                user
            );

        }

        catch {

            console.log(
                "Stored user could not be read."
            );

        }

    }

}


/* =========================================
   DASHBOARD
========================================= */

async function loadDashboard() {

    try {

        const response =
            await apiRequest(
                "/dashboard"
            );


        console.log(
            "CORELY DASHBOARD:",
            response
        );


        const data =
            response.data ||
            response.dashboard ||
            response;


        setText(
            "flowValue",
            data.flow ??
            data.todayFlow ??
            data.flowScore ??
            "—"
        );


        setText(
            "taskValue",
            data.pendingTasks ??
            data.pending_tasks ??
            data.taskCount ??
            data.tasks ??
            "—"
        );


        setText(
            "attendanceValue",
            formatPercentage(
                data.attendance ??
                data.attendanceAverage ??
                data.averageAttendance
            )
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


/* =========================================
   TASKS
========================================= */

async function loadTasks() {

    try {

        const response =
            await apiRequest(
                "/tasks"
            );


        console.log(
            "CORELY TASKS:",
            response
        );


        const tasks =
            response.tasks ||
            response.data ||
            [];


        setText(
            "taskValue",
            tasks.filter(
                task =>
                    task.status !==
                    "completed"
            ).length
        );


        renderTasks(
            tasks
        );

    }

    catch (error) {

        console.error(
            "Tasks loading error:",
            error
        );

    }

}


/* =========================================
   SCHEDULE
========================================= */

async function loadSchedule() {

    try {

        const response =
            await apiRequest(
                "/schedule"
            );


        console.log(
            "CORELY SCHEDULE:",
            response
        );


        const schedule =
            response.schedule ||
            response.data ||
            [];


        renderSchedule(
            schedule
        );

    }

    catch (error) {

        console.error(
            "Schedule loading error:",
            error
        );

    }

}


/* =========================================
   AI
========================================= */

async function loadAI() {

    try {

        const response =
            await apiRequest(
                "/ai"
            );


        console.log(
            "CORELY AI:",
            response
        );


        const ai =
            response.ai ||
            response.data ||
            response;


        const title =
            ai.title ||
            ai.recommendation ||
            ai.message ||
            "Corely has analyzed your student life.";


        const description =
            ai.description ||
            ai.reason ||
            ai.details ||
            "Keep your tasks, academics and attendance updated so Corely can personalize your recommendations.";


        const titleElement =
            document.querySelector(
                ".ai-content h3"
            );


        const descriptionElement =
            document.querySelector(
                ".ai-content p"
            );


        if (titleElement) {

            titleElement.textContent =
                title;

        }


        if (descriptionElement) {

            descriptionElement.textContent =
                description;

        }

    }

    catch (error) {

        console.error(
            "AI loading error:",
            error
        );

    }

}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks(
    tasks
) {

    const container =
        document.querySelector(
            ".tasks-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    const pending =
        tasks.filter(
            task =>
                task.status !==
                "completed"
        );


    if (
        pending.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ✨
                </div>

                <strong>
                    No pending tasks
                </strong>

                <p>
                    You're all caught up!
                </p>

            </div>

        `;

        return;

    }


    pending
        .slice(0, 5)
        .forEach(
            task => {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "task";


                element.innerHTML = `

                    <div class="task-info">

                        <strong>
                            ${escapeHTML(
                                task.title ||
                                task.name ||
                                "Task"
                            )}
                        </strong>

                        <small>
                            ${
                                task.due_date
                                ? formatDate(
                                    task.due_date
                                  )
                                : "No deadline"
                            }
                        </small>

                    </div>

                    <span class="badge ${getPriorityClass(task.priority)}">
                        ${escapeHTML(
                            task.priority ||
                            "TASK"
                        )}
                    </span>

                `;


                container.appendChild(
                    element
                );

            }
        );

}


/* =========================================
   RENDER SCHEDULE
========================================= */

function renderSchedule(
    schedule
) {

    const container =
        document.querySelector(
            ".schedule-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    if (
        !schedule.length
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    📅
                </div>

                <strong>
                    No schedule added
                </strong>

                <p>
                    Add your classes to personalize your day.
                </p>

            </div>

        `;

        return;

    }


    schedule
        .slice(0, 6)
        .forEach(
            item => {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "schedule-item";


                element.innerHTML = `

                    <div class="schedule-time">

                        ${escapeHTML(
                            item.time ||
                            item.start_time ||
                            "--:--"
                        )}

                    </div>

                    <div class="schedule-dot"></div>

                    <div class="schedule-info">

                        <strong>

                            ${escapeHTML(
                                item.subject ||
                                item.title ||
                                item.name ||
                                "Class"
                            )}

                        </strong>

                        <small>

                            ${escapeHTML(
                                item.room ||
                                item.location ||
                                item.description ||
                                ""
                            )}

                        </small>

                    </div>

                `;


                container.appendChild(
                    element
                );

            }
        );

}


/* =========================================
   UPDATE USER
========================================= */

function updateUser(
    user
) {

    const name =
        user.name ||
        "Student";


    const avatar =
        document.querySelector(
            ".user-avatar"
        );


    const profile =
        document.querySelector(
            ".user-profile span"
        );


    if (avatar) {

        avatar.textContent =
            name
                .charAt(0)
                .toUpperCase();

    }


    if (profile) {

        profile.textContent =
            name;

    }


    const heading =
        document.querySelector(
            ".header h1"
        );


    if (heading) {

        heading.textContent =
            `Good morning, ${name} 👋`;

    }

}


/* =========================================
   HELPERS
========================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


function formatPercentage(
    value
) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "—";

    }


    const number =
        Number(value);


    if (
        Number.isNaN(number)
    ) {

        return value;

    }


    return `${number}%`;

}


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

        return "No deadline";

    }


    return date.toLocaleString(
        [],
        {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function getPriorityClass(
    priority
) {

    switch (
        String(priority || "")
            .toLowerCase()
    ) {

        case "high":
            return "badge-pink";

        case "medium":
            return "badge-orange";

        case "low":
            return "badge-green";

        default:
            return "badge-purple";

    }

}


function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


/* =========================================
   LOGOUT
========================================= */

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