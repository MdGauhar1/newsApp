document.addEventListener("DOMContentLoaded", async () => {
    console.log("Summarizer Window Opened");

    // Extract the URL parameter from window location
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");

    if (!url || !url.startsWith("http")) {
        console.error("Error: No valid webpage detected.");
        document.getElementById("summary").innerText = "Error: No valid webpage detected.";
        return;
    }

    console.log("Using URL:", url);

    document.getElementById("summarizeBtn").addEventListener("click", async () => {
        document.getElementById("summary").innerText = "Loading...";

        let apiUrl = `http://localhost:8080/api/news/summarize?url=${encodeURIComponent(url)}`;
        console.log("Sending API request to:", apiUrl);

        try {
            let response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            console.log("API Response:", response);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let data = await response.json();
            console.log("Received summary:", data.summary);

            document.getElementById("summary").innerText = data.summary || "Error: No summary received.";
        } catch (error) {
            console.error("Error fetching summary:", error);
            document.getElementById("summary").innerText = `Error: ${error.message}`;
        }
    });
});
