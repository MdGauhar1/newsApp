let summaryWindowId = null;

chrome.action.onClicked.addListener(() => {
    if (summaryWindowId) {
        chrome.windows.update(summaryWindowId, { focused: true }, (win) => {
            if (chrome.runtime.lastError || !win) {
                summaryWindowId = null;
                openSummaryWindow();
            }
        });
    } else {
        openSummaryWindow();
    }
});

function openSummaryWindow() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0 || !tabs[0].url.startsWith("http")) {
            console.error("Error: No valid webpage detected.");
            return;
        }

        let activeTabUrl = tabs[0].url;
        console.log("Sending active tab URL:", activeTabUrl);

        chrome.windows.create({
            url: `summary.html?url=${encodeURIComponent(activeTabUrl)}`,
            type: "popup",
            width: 450,
            height: 600,
            focused: true
        }, (win) => {
            summaryWindowId = win.id;
        });
    });
}
