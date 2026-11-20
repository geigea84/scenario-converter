import {
    extractStation,
    extractDevice,
    extractOperation,
    extractLastBracketText
} from "./extractors.js"

const fileInput = document.getElementById("csvFile");
const copyTableButton = document.getElementById("copyTableButton");
const exportCsvButton = document.getElementById("exportCsvButton");

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

function getTableData() {
    const table = document.getElementById("results");
    const rows = Array.from(table.querySelectorAll("tr"));

    return rows.map(row => {
        const cells = Array.from(row.querySelectorAll("th, td"));

        return cells.map(cell => cell.textContent.trim());
    });
}

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    copyTableButton.disabled = true;
    exportCsvButton.disabled = true;
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

            const noResults = extractedRows.length === 0;
            copyTableButton.disabled = noResults;
            exportCsvButton.disabled = noResults;
        },
        error: (error) => {
            console.error("CSV parsing failed: ", error);
        }
    });
});

copyTableButton.addEventListener("click", async () => {
    const tableData = getTableData();

    const tableText = tableData
        .map(row => row.join("\t"))
        .join("\n");

    try {
        await navigator.clipboard.writeText(tableText);
        console.log("Table copied to the clipboard.");
    } catch (error) {
        console.error("Failed to copy table: ", error);
    }
});

exportCsvButton.addEventListener("click", () => {
    const tableData = getTableData();
    const csv = Papa.unparse(tableData);

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "scenario-extracts.csv";

    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    console.log("CSV exported successfully");
});
