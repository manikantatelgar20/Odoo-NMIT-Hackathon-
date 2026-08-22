const taskCheckboxes =
    document.querySelectorAll(".task-check");

taskCheckboxes.forEach(
    checkbox => {

        checkbox.addEventListener(
            "change",
            function() {

                const row =
                    this.closest(".task-row");

                if (!row) return;

                row.style.opacity =
                    this.checked ? "0.5" : "1";

            }
        );

    }
);