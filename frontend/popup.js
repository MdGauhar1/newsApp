document.addEventListener("DOMContentLoaded", () => {
    console.log("Extension loaded successfully.");

    document.getElementById("summarizeBtn").addEventListener("click", async () => {
        console.log("Summarize button clicked!");

        document.getElementById("summary").innerText = "Loading...";

        // Get the current active tab's URL
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (!tabs || tabs.length === 0 || !tabs[0].url) {
                console.error("Error: No active tab found.");
                document.getElementById("summary").innerText = "Error: No active tab found.";
                return;
            }

            let url = tabs[0].url;
            console.log("Detected URL:", url);

            // Ensure the URL is a real webpage, not an extension or internal page
            if (!url.startsWith("http")) {
                console.error("Error: Invalid webpage URL detected.");
                document.getElementById("summary").innerText = "Error: No valid webpage detected.";
                return;
            }

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
});
