const CORELY_API_URL =
    "http://localhost:5000/api";


async function apiRequest(
    endpoint,
    options = {}
) {

    const token =
        localStorage.getItem(
            "corelyToken"
        );


    const headers = {

        "Content-Type":
            "application/json",

        ...(options.headers || {})

    };


    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }


    const response =
        await fetch(
            `${CORELY_API_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );


    let data = {};


    try {

        data =
            await response.json();

    }
    catch {

        data = {};

    }


    if (response.status === 401) {

        localStorage.removeItem(
            "corelyToken"
        );

        localStorage.removeItem(
            "corelyUser"
        );

        window.location.href =
            "login.html";

        throw new Error(
            "Session expired."
        );

    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Something went wrong."
        );

    }


    return data;

}