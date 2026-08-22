let attendanceRecords = [];


/* =====================================================
   LOAD ATTENDANCE
   ===================================================== */

async function loadAttendance() {

    const list =
        document.getElementById(
            "attendanceList"
        );

    try {

        const data =
            await apiRequest(
                "/attendance"
            );


        attendanceRecords =
            data.attendance || [];


        renderAttendance();

    }
    catch (error) {

        console.error(
            "Attendance loading error:",
            error
        );


        list.innerHTML = `
            <div class="empty">
                Unable to load attendance.
            </div>
        `;
    }
}


/* =====================================================
   RENDER
   ===================================================== */

function renderAttendance() {

    const list =
        document.getElementById(
            "attendanceList"
        );


    if (
        !attendanceRecords.length
    ) {

        list.innerHTML = `
            <div class="empty">
                📊
                <br><br>
                No attendance records yet.
                <br>
                Add your first subject above.
            </div>
        `;

        updateSummary();

        return;
    }


    list.innerHTML =
        attendanceRecords
            .map(record => {

                const present =
                    Number(
                        record.present_classes ??
                        record.attended_classes ??
                        0
                    );


                const total =
                    Number(
                        record.total_classes ??
                        present
                    );


                const percentage =
                    total > 0
                        ? (present / total) * 100
                        : 0;


                let status =
                    "good";


                if (percentage < 75) {
                    status = "danger";
                }
                else if (percentage < 85) {
                    status = "warning";
                }


                return `

                    <div class="attendance-item">

                        <div class="attendance-header">

                            <div class="attendance-name">
                                ${escapeHTML(record.subject)}
                            </div>

                            <div class="percentage ${status}">
                                ${percentage.toFixed(1)}%
                            </div>

                        </div>


                        <div class="attendance-bar">

                            <div
                                class="attendance-fill ${status}"
                                style="width:${Math.min(
                                    percentage,
                                    100
                                )}%">
                            </div>

                        </div>


                        <div class="attendance-meta">

                            <span>
                                ${present}
                                / ${total}
                                classes
                            </span>

                            <span>
                                ${
                                    status === "good"
                                        ? "✓ Safe"
                                        : status === "warning"
                                            ? "⚠ Watch"
                                            : "⚠ Low"
                                }
                            </span>

                        </div>


                        <button
                            class="delete-btn"
                            onclick="deleteAttendance(${record.id})">

                            Delete

                        </button>

                    </div>
                `;

            })
            .join("");


    updateSummary();
}


/* =====================================================
   ADD ATTENDANCE
   ===================================================== */

async function addAttendance(event) {

    event.preventDefault();


    const subject =
        document
            .getElementById(
                "attendanceSubject"
            )
            .value
            .trim();


    const present =
        Number(
            document
                .getElementById(
                    "presentClasses"
                )
                .value
        );


    const total =
        Number(
            document
                .getElementById(
                    "totalClasses"
                )
                .value
        );


    if (!subject) {

        showAttendanceMessage(
            "Please enter a subject.",
            true
        );

        return;
    }


    if (
        !Number.isFinite(present) ||
        !Number.isFinite(total)
    ) {

        showAttendanceMessage(
            "Enter valid class numbers.",
            true
        );

        return;
    }


    if (total <= 0) {

        showAttendanceMessage(
            "Total classes must be greater than zero.",
            true
        );

        return;
    }


    if (
        present < 0 ||
        present > total
    ) {

        showAttendanceMessage(
            "Present classes cannot be greater than total classes.",
            true
        );

        return;
    }


    try {

        await apiRequest(
            "/attendance",
            {
                method: "POST",

                body: JSON.stringify({

                    subject:
                        subject,

                    present_classes:
                        present,

                    total_classes:
                        total

                })
            }
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


        document
            .getElementById(
                "attendancePercentage"
            )
            .value = "";


        await loadAttendance();

    }
    catch (error) {

        console.error(error);

        showAttendanceMessage(
            error.message ||
            "Unable to save attendance.",
            true
        );

    }
}


/* =====================================================
   DELETE
   ===================================================== */

async function deleteAttendance(id) {

    if (
        !confirm(
            "Delete this attendance record?"
        )
    ) {
        return;
    }


    try {

        await apiRequest(
            `/attendance/${id}`,
            {
                method: "DELETE"
            }
        );


        await loadAttendance();

    }
    catch (error) {

        alert(
            error.message ||
            "Unable to delete attendance."
        );

    }
}


/* =====================================================
   SUMMARY
   ===================================================== */

function updateSummary() {

    const overall =
        document.getElementById(
            "overallAttendance"
        );


    const safe =
        document.getElementById(
            "safeSubjects"
        );


    const warning =
        document.getElementById(
            "warningSubjects"
        );


    if (!attendanceRecords.length) {

        overall.textContent = "--";
        safe.textContent = "0";
        warning.textContent = "0";

        updateAI(0, 0);

        return;
    }


    let totalPresent = 0;
    let totalClasses = 0;

    let safeCount = 0;
    let warningCount = 0;


    attendanceRecords.forEach(record => {

        const present =
            Number(
                record.present_classes ??
                record.attended_classes ??
                0
            );


        const total =
            Number(
                record.total_classes ??
                present
            );


        totalPresent += present;
        totalClasses += total;


        const percentage =
            total > 0
                ? (present / total) * 100
                : 0;


        if (percentage >= 75) {
            safeCount++;
        }
        else {
            warningCount++;
        }

    });


    const overallPercentage =
        totalClasses > 0
            ? (totalPresent / totalClasses) * 100
            : 0;


    overall.textContent =
        `${overallPercentage.toFixed(1)}%`;


    safe.textContent =
        safeCount;


    warning.textContent =
        warningCount;


    updateAI(
        overallPercentage,
        warningCount
    );
}


/* =====================================================
   AI INSIGHT
   ===================================================== */

function updateAI(
    percentage,
    warnings
) {

    const title =
        document.getElementById(
            "attendanceAI"
        );


    const description =
        document.getElementById(
            "attendanceAIDescription"
        );


    if (!title || !description) {
        return;
    }


    if (!attendanceRecords.length) {

        title.textContent =
            "Add attendance to receive an insight.";

        description.textContent =
            "Corely AI will analyze your attendance.";

        return;
    }


    if (percentage < 75) {

        title.textContent =
            "⚠ Your attendance needs attention.";

        description.textContent =
            "Try attending upcoming classes consistently to bring your average above 75%.";

    }
    else if (percentage < 85) {

        title.textContent =
            "✦ Your attendance is close to the safe zone.";

        description.textContent =
            "A few more attended classes can improve your attendance significantly.";

    }
    else {

        title.textContent =
            "✦ Excellent attendance.";

        description.textContent =
            "Your attendance is currently in a healthy range. Keep maintaining the consistency.";

    }

}


/* =====================================================
   MESSAGE
   ===================================================== */

function showAttendanceMessage(
    message,
    error = false
) {

    const element =
        document.getElementById(
            "attendanceMessage"
        );


    element.className =
        `message ${error ? "error" : "success"}`;


    element.textContent =
        message;


    setTimeout(() => {

        element.textContent = "";

        element.className = "";

    }, 4000);
}


/* =====================================================
   LIVE PERCENTAGE
   ===================================================== */

function calculateAttendancePercentage() {

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


    const output =
        document.getElementById(
            "attendancePercentage"
        );


    if (
        total > 0 &&
        present >= 0 &&
        present <= total
    ) {

        output.value =
            `${((present / total) * 100).toFixed(1)}%`;

    }
    else {

        output.value = "";

    }

}


/* =====================================================
   SECURITY
   ===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =====================================================
   START
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "attendanceForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                addAttendance
            );

        }


        const present =
            document.getElementById(
                "presentClasses"
            );


        const total =
            document.getElementById(
                "totalClasses"
            );


        if (present) {

            present.addEventListener(
                "input",
                calculateAttendancePercentage
            );

        }


        if (total) {

            total.addEventListener(
                "input",
                calculateAttendancePercentage
            );

        }


        loadAttendance();

    }
);