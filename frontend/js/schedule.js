document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSchedule();

        setupScheduleForm();

        loadScheduleAI();

    }
);


/* =========================================
   LOAD SCHEDULE
========================================= */

async function loadSchedule() {

    const container =
        document.getElementById(
            "scheduleList"
        );


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


        updateScheduleCount(
            schedule
        );


        renderSchedule(
            schedule
        );

    }

    catch (error) {

        console.error(
            "Schedule error:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠️
                </div>

                <strong>
                    Unable to load schedule
                </strong>

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
   ADD SCHEDULE
========================================= */

function setupScheduleForm() {

    const form =
        document.getElementById(
            "scheduleForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const subject =
                document
                    .getElementById(
                        "subject"
                    )
                    .value
                    .trim();


            const location =
                document
                    .getElementById(
                        "location"
                    )
                    .value
                    .trim();


            const date =
                document
                    .getElementById(
                        "scheduleDate"
                    )
                    .value;


            const startTime =
                document
                    .getElementById(
                        "startTime"
                    )
                    .value;


            const endTime =
                document
                    .getElementById(
                        "endTime"
                    )
                    .value;


            const type =
                document
                    .getElementById(
                        "scheduleType"
                    )
                    .value;


            const description =
                document
                    .getElementById(
                        "scheduleDescription"
                    )
                    .value
                    .trim();


            const error =
                document.getElementById(
                    "scheduleError"
                );


            const button =
                document.getElementById(
                    "scheduleButton"
                );


            error.textContent =
                "";


            if (
                !subject ||
                !date ||
                !startTime
            ) {

                error.textContent =
                    "Subject, date and start time are required.";

                return;

            }


            button.disabled =
                true;

            button.textContent =
                "Saving...";


            try {

                /*
                 * We send multiple common field
                 * names so your backend can
                 * easily use the values.
                 */

                await apiRequest(
                    "/schedule",
                    {

                        method: "POST",

                        body:
                            JSON.stringify({

                                subject,

                                title:
                                    subject,

                                location,

                                date,

                                start_time:
                                    startTime,

                                end_time:
                                    endTime || null,

                                type,

                                description

                            })

                    }
                );


                form.reset();


                await loadSchedule();

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
                    "+ Add to Schedule";

            }

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
        document.getElementById(
            "scheduleList"
        );


    container.innerHTML =
        "";


    if (
        !schedule ||
        schedule.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    📅
                </div>

                <strong>
                    No schedule items yet
                </strong>

                <p>
                    Add your first class or study session above.
                </p>

            </div>

        `;

        return;

    }


    /*
     * Sort by date and start time.
     */

    const sorted =
        [...schedule].sort(
            function (a, b) {

                const dateA =
                    `${a.date || ""} ${a.start_time || a.time || ""}`;

                const dateB =
                    `${b.date || ""} ${b.start_time || b.time || ""}`;

                return dateA.localeCompare(
                    dateB
                );

            }
        );


    sorted.forEach(
        function (item) {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "task";


            const title =
                item.subject ||
                item.title ||
                item.name ||
                "Schedule item";


            const date =
                item.date ||
                item.schedule_date;


            const start =
                item.start_time ||
                item.startTime ||
                item.time ||
                "";


            const end =
                item.end_time ||
                item.endTime ||
                "";


            const location =
                item.location ||
                item.room ||
                "";


            const type =
                item.type ||
                "class";


            element.innerHTML = `

                <div class="task-info">

                    <strong>
                        ${escapeHTML(
                            title
                        )}
                    </strong>

                    <small>

                        ${date
                            ? escapeHTML(
                                formatDateOnly(
                                    date
                                )
                              )
                            : "Date not specified"
                        }

                        ${
                            start
                                ? " • " +
                                  escapeHTML(
                                      start
                                  )
                                : ""
                        }

                        ${
                            end
                                ? " - " +
                                  escapeHTML(
                                      end
                                  )
                                : ""
                        }

                    </small>


                    ${
                        location
                            ? `
                                <small>
                                    📍
                                    ${escapeHTML(
                                        location
                                    )}
                                </small>
                              `
                            : ""
                    }

                </div>


                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:8px;
                    ">

                    <span class="
                        badge
                        ${getTypeBadge(
                            type
                        )}
                    ">

                        ${escapeHTML(
                            type
                        )}

                    </span>


                    ${
                        item.id
                            ? `
                                <button
                                    class="btn"
                                    style="
                                        padding:7px 10px;
                                        background:#fff0f2;
                                        color:#ca5367;
                                        box-shadow:none;
                                    "
                                    onclick="deleteSchedule(${item.id})">

                                    🗑

                                </button>
                              `
                            : ""
                    }

                </div>

            `;


            container.appendChild(
                element
            );

        }
    );

}


/* =========================================
   DELETE
========================================= */

async function deleteSchedule(
    id
) {

    if (
        !confirm(
            "Delete this schedule item?"
        )
    ) {

        return;

    }


    try {

        await apiRequest(
            `/schedule/${id}`,
            {
                method: "DELETE"
            }
        );


        await loadSchedule();

    }

    catch (error) {

        alert(
            error.message
        );

    }

}


/* =========================================
   AI
========================================= */

async function loadScheduleAI() {

    try {

        const response =
            await apiRequest(
                "/ai"
            );


        const ai =
            response.ai ||
            response.data ||
            response;


        const title =
            document.getElementById(
                "scheduleAITitle"
            );


        const description =
            document.getElementById(
                "scheduleAIDescription"
            );


        if (title) {

            title.textContent =
                ai.scheduleRecommendation ||
                ai.title ||
                ai.recommendation ||
                "Corely is optimizing your schedule.";

        }


        if (description) {

            description.textContent =
                ai.scheduleDescription ||
                ai.description ||
                ai.reason ||
                "Keep your schedule updated so Corely can identify the best study windows.";

        }

    }

    catch (error) {

        console.log(
            "AI unavailable:",
            error.message
        );

    }

}


/* =========================================
   HELPERS
========================================= */

function updateScheduleCount(
    schedule
) {

    const element =
        document.getElementById(
            "scheduleCount"
        );


    if (element) {

        element.textContent =
            `${schedule.length} items`;

    }

}


function getTypeBadge(
    type
) {

    switch (
        String(type || "")
            .toLowerCase()
    ) {

        case "class":
            return "badge-blue";

        case "study":
            return "badge-purple";

        case "exam":
            return "badge-pink";

        case "event":
            return "badge-green";

        default:
            return "badge-orange";

    }

}


function formatDateOnly(
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