document.addEventListener("DOMContentLoaded", () => {

    loadAcademics();

    const form =
        document.getElementById("academicForm");

    const internal =
        document.getElementById("internalMarks");

    const semester =
        document.getElementById("semesterMarks");

    if (internal && semester) {

        function calculateTotal() {

            const a =
                Number(internal.value) || 0;

            const b =
                Number(semester.value) || 0;

            document.getElementById(
                "academicTotal"
            ).value = a + b;
        }

        internal.addEventListener(
            "input",
            calculateTotal
        );

        semester.addEventListener(
            "input",
            calculateTotal
        );
    }

    if (form) {

        form.addEventListener(
            "submit",
            addAcademic
        );

    }

});


async function addAcademic(event) {

    event.preventDefault();

    const subject =
        document.getElementById(
            "academicSubject"
        ).value.trim();

    const internal =
        Number(
            document.getElementById(
                "internalMarks"
            ).value
        );

    const semester =
        Number(
            document.getElementById(
                "semesterMarks"
            ).value
        );

    if (!subject) {

        showAcademicMessage(
            "Enter the subject name.",
            true
        );

        return;
    }

    try {

        const result =
            await apiRequest(
                "/academics",
                {
                    method: "POST",

                    body: JSON.stringify({

                        subject: subject,

                        internal_marks: internal,

                        semester_end_marks: semester

                    })
                }
            );


        console.log(
            "Academic saved:",
            result
        );


        showAcademicMessage(
            "✓ Subject saved successfully!",
            false
        );


        document
            .getElementById(
                "academicForm"
            )
            .reset();


        document.getElementById(
            "academicTotal"
        ).value = "";


        loadAcademics();

    }
    catch (error) {

        console.error(error);

        showAcademicMessage(
            error.message,
            true
        );

    }

}


async function loadAcademics() {

    try {

        const result =
            await apiRequest(
                "/academics"
            );


        console.log(
            "Academics:",
            result
        );


        const records =
            result.academics || [];


        renderAcademics(
            records
        );

        updateAcademicSummary(
            records
        );

    }
    catch(error) {

        console.error(
            "Academics error:",
            error
        );

        document.getElementById(
            "subjects"
        ).innerHTML = `

            <div class="empty">

                ❌ ${error.message}

            </div>

        `;

    }

}


function renderAcademics(records) {

    const container =
        document.getElementById(
            "subjects"
        );


    container.innerHTML = "";


    if (!records.length) {

        container.innerHTML = `

            <div class="empty">

                🎓

                <h3>
                    No subjects added yet
                </h3>

                <p>
                    Use "Add Subject" above to enter your marks.
                </p>

            </div>

        `;

        return;
    }


    records.forEach(record => {

        const card =
            document.createElement("div");

        card.className =
            "subject-card";


        card.innerHTML = `

            <div class="subject-header">

                <div class="subject-name">

                    ${escapeHTML(record.subject)}

                </div>

                <div class="grade">

                    ${escapeHTML(record.grade || "--")}

                </div>

            </div>


            <div class="marks">

                <div class="mark">

                    <small>
                        INTERNAL
                    </small>

                    <strong>
                        ${record.internal_marks}
                    </strong>

                </div>


                <div class="mark">

                    <small>
                        SEMESTER
                    </small>

                    <strong>
                        ${record.semester_end_marks}
                    </strong>

                </div>


                <div class="mark">

                    <small>
                        TOTAL
                    </small>

                    <strong>
                        ${record.total}
                    </strong>

                </div>

            </div>


            <div class="progress">

                <div
                    style="
                        width:${Math.min(
                            100,
                            Number(record.total)
                        )}%;
                    ">
                </div>

            </div>


            <button
                class="delete-btn"
                onclick="deleteAcademic(${record.id})">

                Delete

            </button>

        `;


        container.appendChild(card);

    });

}


function updateAcademicSummary(records) {

    document.getElementById(
        "subjectCount"
    ).textContent =
        records.length;


    if (!records.length) {

        document.getElementById(
            "averageMarks"
        ).textContent = "--";

        document.getElementById(
            "bestGrade"
        ).textContent = "--";

        document.getElementById(
            "cgpa"
        ).textContent = "--";

        return;
    }


    const average =
        records.reduce(
            (sum, r) =>
                sum + Number(r.total),
            0
        ) / records.length;


    document.getElementById(
        "averageMarks"
    ).textContent =
        average.toFixed(1);


    const points =
        records.map(r => {

            const mark =
                Number(r.total);

            if (mark >= 90) return 10;
            if (mark >= 80) return 9;
            if (mark >= 70) return 8;
            if (mark >= 60) return 7;
            if (mark >= 50) return 6;
            if (mark >= 40) return 5;

            return 0;

        });


    const cgpa =
        points.reduce(
            (a,b) => a+b,
            0
        ) / points.length;


    document.getElementById(
        "cgpa"
    ).textContent =
        cgpa.toFixed(2);


    document.getElementById(
        "bestGrade"
    ).textContent =
        getBestGrade(records);


    document.getElementById(
        "academicAI"
    ).textContent =
        average >= 75
            ? "✨ Your academic performance is looking strong!"
            : "⚠ Corely recommends focusing on your weaker subjects.";


    document.getElementById(
        "academicAIDescription"
    ).textContent =
        average >= 75
            ? "Keep maintaining your current study routine."
            : "Review lower-scoring subjects and schedule focused study sessions.";

}


function getBestGrade(records) {

    const order = [
        "A+",
        "A",
        "B+",
        "B",
        "C",
        "D",
        "F"
    ];


    for (
        const grade of order
    ) {

        if (
            records.some(
                r => r.grade === grade
            )
        ) {

            return grade;

        }

    }

    return "--";
}


async function deleteAcademic(id) {

    if (
        !confirm(
            "Delete this subject?"
        )
    ) return;


    try {

        await apiRequest(
            `/academics/${id}`,
            {
                method: "DELETE"
            }
        );


        loadAcademics();

    }
    catch(error) {

        alert(error.message);

    }

}


function showAcademicMessage(
    message,
    error
) {

    const element =
        document.getElementById(
            "academicMessage"
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