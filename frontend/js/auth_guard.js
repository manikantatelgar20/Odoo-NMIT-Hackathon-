(function () {

    const token =
        localStorage.getItem(
            "corelyToken"
        );


    if (!token) {

        window.location.replace(
            "login.html"
        );

    }

})();