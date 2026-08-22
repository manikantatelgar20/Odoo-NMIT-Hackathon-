document.addEventListener("DOMContentLoaded", () => {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            const href =
                link
                    .getAttribute("href")
                    ?.split("/")
                    .pop()
                    .toLowerCase();

            if (href === currentPage) {
                link.classList.add("active");
            }

        });


    const logoutLink =
        document.getElementById("logoutLink");


    if (logoutLink) {

        logoutLink.addEventListener(
            "click",
            event => {

                event.preventDefault();

                localStorage.removeItem(
                    "corelyToken"
                );

                localStorage.removeItem(
                    "corelyUser"
                );

                window.location.href =
                    "login.html";

            }
        );

    }

});