const CORELY_API_URL =
    "http://localhost:5000/api";


async function apiRequest(
    endpoint,
    options = {}
) {

    const response = await fetch(
        `${CORELY_API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                ...(options.headers || {})
            }
        }
    );


    let data = {};

    try {

        data = await response.json();

    } catch {

        data = {};

    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Something went wrong."
        );

    }


    return data;
}