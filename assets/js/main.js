import {
    extractStation,
    extractDevice,
    extractOperation,
    extractLastBracketText
} from "./extractors.js"

const fileInput = document.getElementById("csvFile");
const output = document.getElementById("output");

fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (!file) {
        // TODO: should there be a warning here?
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
        },
        error: (error) => {
            console.error("CSV parsing failed: ", error);
        }
    });
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
