document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAttendance();


        const form =
            document.getElementById(
                "attendanceForm"
            );


        const present =
            document.getElementById(
                "presentClasses"
            );


        const total =
            document.getElementById(
                "totalClasses"
            );


        function calculatePercentage() {

            const p =
                Number(present.value) || 0;

            const t =
                Number(total.value) || 0;


            const percentage =
                t > 0
                    ? (p / t) * 100
                    : 0;


            document.getElementById(
                "attendancePercentage"
            ).value =
                percentage.toFixed(1) + "%";

        }


        present.addEventListener(
            "input",
            calculatePercentage
        );


        total.addEventListener(
            "input",
            calculatePercentage
        );


        form.addEventListener(
            "submit",
            addAttendance
        );

    }
);


async function addAttendance(event) {

    event.preventDefault();


    const subject =
        document.getElementById(
            "attendanceSubject"
        ).value.trim();


    const present =
        Number(
            document.getElementById(
                "presentClasses"
            ).value
        );


    const total =
        Number(
            document.getElementById(
                "totalClasses"
            ).value
        );


    if (!subject) {

        showAttendanceMessage(
            "Enter the subject name.",
            true
        );

        return;
    }


    if (
        total <= 0 ||
        present < 0 ||
        present > total
    ) {

        showAttendanceMessage(
            "Enter valid class numbers.",
            true
        );

        return;
    }


    try {

        const result =
            await apiRequest(
                "/attendance",
                {

                    method: "POST",

                    body: JSON.stringify({

                        subject,

                        present_classes:
                            present,

                        total_classes:
                            total

                    })

                }
            );


        console.log(
            "Attendance saved:",
            result
        );


        showAttendanceMessage(
            "✓ Attendance saved successfully!",
            false
        );


        document
            .getElementById(
                "attendanceForm"
            )
            .reset();


        document.getElementById(
            "attendancePercentage"
        ).value = "";


        loadAttendance();

    }
    catch(error) {

        console.error(error);

        showAttendanceMessage(
            error.message,
            true
        );

    }

}


async function loadAttendance() {

    try {

        const result =
            await apiRequest(
                "/attendance"
            );


        console.log(
            "Attendance:",
            result
        );


        const records =
            result.attendance || [];


        renderAttendance(
            records
        );


        updateAttendanceSummary(
            records
        );

    }
    catch(error) {

        document.getElementById(
            "attendanceList"
        ).innerHTML = `

            <div class="empty">

                ❌ ${error.message}

            </div>

        `;

    }

}


function renderAttendance(records) {

    const container =
        document.getElementById(
            "attendanceList"
        );


    container.innerHTML = "";


    if (!records.length) {

        container.innerHTML = `

            <div class="empty">

                📊

                <h3>
                    No attendance records yet
                </h3>

                <p>
                    Use "Add Attendance" above.
                </p>

            </div>

        `;

        return;
    }


    records.forEach(record => {

        const percentage =
            Number(record.percentage);


        let status =
            "good";


        if (percentage < 75)
            status = "danger";

        else if (percentage < 85)
            status = "warning";


        const card =
            document.createElement("div");


        card.className =
            "attendance-item";


        card.innerHTML = `

            <div class="attendance-header">

                <div class="attendance-name">

                    ${escapeHTML(
                        record.subject
                    )}

                </div>

                <div
                    class="
                        percentage
                        ${status}
                    ">

                    ${percentage.toFixed(1)}%

                </div>

            </div>


            <div class="attendance-bar">

                <div
                    class="
                        attendance-fill
                        ${status}
                    "
                    style="
                        width:${Math.min(
                            100,
                            percentage
                        )}%;
                    ">

                </div>

            </div>


            <div class="attendance-meta">

                <span>
                    Present:
                    ${record.present_classes}
                </span>

                <span>
                    Total:
                    ${record.total_classes}
                </span>

                <span>
                    ${
                        percentage >= 75
                            ? "✓ Safe"
                            : "⚠ Low"
                    }
                </span>

            </div>


            <button
                class="delete-btn"
                onclick="deleteAttendance(${record.id})">

                Delete

            </button>

        `;


        container.appendChild(card);

    });

}


function updateAttendanceSummary(
    records
) {

    if (!records.length) {

        document.getElementById(
            "overallAttendance"
        ).textContent = "--";

        document.getElementById(
            "safeSubjects"
        ).textContent = "0";

        document.getElementById(
            "warningSubjects"
        ).textContent = "0";

        return;
    }


    const average =
        records.reduce(
            (sum, record) =>
                sum +
                Number(record.percentage),
            0
        ) / records.length;


    const safe =
        records.filter(
            record =>
                Number(record.percentage) >= 75
        ).length;


    const warning =
        records.length - safe;


    document.getElementById(
        "overallAttendance"
    ).textContent =
        average.toFixed(1) + "%";


    document.getElementById(
        "safeSubjects"
    ).textContent =
        safe;


    document.getElementById(
        "warningSubjects"
    ).textContent =
        warning;


    document.getElementById(
        "attendanceAI"
    ).textContent =
        warning > 0
            ? `⚠ ${warning} subject(s) need attention.`
            : "✨ Your attendance is looking healthy!";


    document.getElementById(
        "attendanceAIDescription"
    ).textContent =
        warning > 0
            ? "Try to attend upcoming classes regularly and keep every subject above 75%."
            : "Keep maintaining your current attendance.";

}


async function deleteAttendance(id) {

    if (
        !confirm(
            "Delete this attendance record?"
        )
    ) return;


    try {

        await apiRequest(
            `/attendance/${id}`,
            {
                method: "DELETE"
            }
        );


        loadAttendance();

    }
    catch(error) {

        alert(error.message);

    }

}


function showAttendanceMessage(
    message,
    error
) {

    const element =
        document.getElementById(
            "attendanceMessage"
        );


    element.textContent =
        message;


    element.className =
        error
            ? "message error"
            : "message success";

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}