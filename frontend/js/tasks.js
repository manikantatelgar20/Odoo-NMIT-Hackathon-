document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadTasks();

        setupTaskForm();

    }
);


/* =========================================
   LOAD TASKS
========================================= */

async function loadTasks() {

    const container =
        document.getElementById(
            "taskList"
        );


    try {

        const response =
            await apiRequest(
                "/tasks"
            );


        console.log(
            "TASKS:",
            response
        );


        const tasks =
            response.tasks ||
            response.data ||
            [];


        updateCount(
            tasks
        );


        renderTaskList(
            tasks
        );

    }

    catch (error) {

        console.error(
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠️
                </div>

                Unable to load tasks.

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


/* =========================================
   ADD TASK
========================================= */

function setupTaskForm() {

    const form =
        document.getElementById(
            "taskForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();


            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();


            const priority =
                document
                    .getElementById("priority")
                    .value;


            const dueDate =
                document
                    .getElementById("dueDate")
                    .value;


            const estimatedMinutes =
                document
                    .getElementById(
                        "estimatedMinutes"
                    )
                    .value;


            const error =
                document.getElementById(
                    "taskError"
                );


            const button =
                document.getElementById(
                    "addTaskButton"
                );


            error.textContent =
                "";


            if (!title) {

                error.textContent =
                    "Task title is required.";

                return;

            }


            button.disabled =
                true;

            button.textContent =
                "Saving...";


            try {

                await apiRequest(
                    "/tasks",
                    {

                        method: "POST",

                        body:
                            JSON.stringify({

                                title,

                                description,

                                priority,

                                due_date:
                                    dueDate
                                        ? new Date(
                                            dueDate
                                          ).toISOString()
                                        : null,

                                estimated_minutes:
                                    Number(
                                        estimatedMinutes
                                    )

                            })

                    }
                );


                form.reset();


                document.getElementById(
                    "priority"
                ).value =
                    "medium";


                document.getElementById(
                    "estimatedMinutes"
                ).value =
                    "60";


                await loadTasks();

            }

            catch (err) {

                console.error(
                    err
                );


                error.textContent =
                    err.message;

            }

            finally {

                button.disabled =
                    false;

                button.textContent =
                    "+ Add Task";

            }

        }
    );

}


/* =========================================
   RENDER
========================================= */

function renderTaskList(
    tasks
) {

    const container =
        document.getElementById(
            "taskList"
        );


    container.innerHTML =
        "";


    if (
        tasks.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ✨
                </div>

                <strong>
                    No tasks yet
                </strong>

                <p>
                    Add your first task above.
                </p>

            </div>

        `;

        return;

    }


    tasks.forEach(
        task => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "task";


            const completed =
                task.status ===
                "completed";


            element.style.opacity =
                completed
                    ? "0.55"
                    : "1";


            element.innerHTML = `

                <div class="task-info">

                    <strong
                        style="
                            ${
                                completed
                                ? "text-decoration:line-through;"
                                : ""
                            }
                        ">

                        ${escapeHTML(
                            task.title ||
                            "Task"
                        )}

                    </strong>


                    <small>

                        ${
                            task.description
                                ? escapeHTML(
                                    task.description
                                  )
                                : "No description"
                        }

                    </small>


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


                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:8px;
                    ">

                    <span class="
                        badge
                        ${priorityBadge(
                            task.priority
                        )}
                    ">

                        ${escapeHTML(
                            task.priority ||
                            "medium"
                        )}

                    </span>


                    ${
                        !completed
                        ? `
                            <button
                                class="btn"
                                style="
                                    padding:7px 10px;
                                "
                                onclick="completeTask(${task.id})">

                                ✓

                            </button>
                        `
                        : ""
                    }


                    <button
                        class="btn"
                        style="
                            padding:7px 10px;
                            background:#fff0f2;
                            color:#ca5367;
                            box-shadow:none;
                        "
                        onclick="deleteTask(${task.id})">

                        🗑

                    </button>

                </div>

            `;


            container.appendChild(
                element
            );

        }
    );

}


/* =========================================
   COMPLETE
========================================= */

async function completeTask(
    id
) {

    try {

        const response =
            await apiRequest(
                "/tasks"
            );


        const tasks =
            response.tasks ||
            response.data ||
            [];


        const task =
            tasks.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!task) {
            return;
        }


        await apiRequest(
            `/tasks/${id}`,
            {

                method: "PUT",

                body:
                    JSON.stringify({

                        title:
                            task.title,

                        description:
                            task.description,

                        priority:
                            task.priority,

                        status:
                            "completed",

                        due_date:
                            task.due_date,

                        estimated_minutes:
                            task.estimated_minutes

                    })

            }
        );


        await loadTasks();

    }

    catch (error) {

        alert(
            error.message
        );

    }

}


/* =========================================
   DELETE
========================================= */

async function deleteTask(
    id
) {

    if (
        !confirm(
            "Delete this task?"
        )
    ) {

        return;

    }


    try {

        await apiRequest(
            `/tasks/${id}`,
            {
                method: "DELETE"
            }
        );


        await loadTasks();

    }

    catch (error) {

        alert(
            error.message
        );

    }

}


/* =========================================
   HELPERS
========================================= */

function updateCount(
    tasks
) {

    const pending =
        tasks.filter(
            task =>
                task.status !==
                "completed"
        ).length;


    const element =
        document.getElementById(
            "taskCount"
        );


    if (element) {

        element.textContent =
            `${pending} pending`;

    }

}


function priorityBadge(
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

        return "Invalid date";

    }


    return date.toLocaleString(
        [],
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

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