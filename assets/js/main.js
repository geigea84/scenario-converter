import {
    extractStation,
    extractDevice,
    extractOperation,
    extractLastBracketText
} from "./extractors.js"

const fileInput = document.getElementById("csvFile");
const copyTableButton = document.getElementById("copyTableButton");

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    copyTableButton.disabled = true;
    document.querySelector("#results tbody").replaceChildren();

    if (!file) {
        // UX choice: if no file is selected, no warning is given, just simply returns.
        return;
    }

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            console.log("Parsed CSV: ", results.data);
            
            const extractedRows = results.data
                .filter(row => typeof row.Description === "string")
                .map(row => {
                    const description = row.Description;
                    
                    return {
                        station: extractStation(description),
                        device: extractDevice(description),
                        operation: extractOperation(description),
                        lastBracketText: extractLastBracketText(description)
                    };
                });

            console.log("Extracted Rows: ", extractedRows);

            renderTable(extractedRows);

            copyTableButton.disabled = extractedRows.length === 0;
        },
        error: (error) => {
            console.error("CSV parsing failed: ", error);
        }
    });
});

copyTableButton.addEventListener("click", async () => {
    const table = document.getElementById("results");
    const rows = Array.from(table.querySelectorAll("tr"));

    const tableText = rows
        .map(row => {
            const cells = Array.from(row.querySelectorAll("th, td"));

            return cells
                .map(cell => cell.textContent.trim())
                .join("\t");
        })
        .join("\n");

    try {
        await navigator.clipboard.writeText(tableText);
        console.log("Table copied to the clipboard.");
    } catch (error) {
        console.error("Failed to copy table: ", error);
    }
});

function renderTable(extractedRows) {
    const tableBody = document.querySelector("#results tbody");

    // Clear previous results
    tableBody.replaceChildren();

    for (const row of extractedRows) {
        const tableRow = document.createElement("tr");

        const stationCell = document.createElement("td");
        stationCell.textContent = row.station;

        const deviceCell = document.createElement("td");
        deviceCell.textContent = row.device;

        const operationCell = document.createElement("td");
        operationCell.textContent = row.operation;

        const bracketCell = document.createElement("td");
        bracketCell.textContent = row.lastBracketText;

        tableRow.append(
            stationCell,
            deviceCell,
            operationCell,
            bracketCell
        );

        tableBody.append(tableRow);
    }
}
