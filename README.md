# Scenario Converter

A lightweight, browser-based application for extracting structured data from scenario CSV files.

The application parses an uploaded CSV file, processes the `Description` column, and displays extracted information in an HTML table.


## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
  - [File Responsibilities](#file-responsibilities)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running the Application](#running-the-application)
- [Input Format](#input-format)
- [Application Workflow](#application-workflow)
- [Development Notes](#development-notes)


## Features

- **CSV Upload:** Import scenario data from a local CSV file.
- **Data Extraction:** Extract four fields from each scenario description:
  - **Station:** Station identifier.
  - **Device:** Device identifier or name.
  - **Operation:** Operation or property being modified.
  - **Last Bracket Text:** Text contained within the final pair of square brackets.
- **Results Table:** Display extracted data in a structured HTML table.
- **Copy Table:** Copy the results, including column headers, to the clipboard in a tab-separated format suitable for pasting into Excel.
- **Export to CSV:** Download the extracted results as a new CSV file.

## Technologies

- **HTML5:** Application structure and user interface.
- **JavaScript (ES6+):** CSV processing, data extraction, and DOM manipulation.
- **[Papa Parse](https://www.papaparse.com/):** CSV parsing.
- **VS Code Live Server:** Local development server.

The application runs entirely in the browser and does not require a backend service.

## Project Structure

```text
scenario-converter/
├── index.html
├── assets/
│   └── js/
│       ├── main.js
│       └── extractors.js
└── README.md
```

### File Responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Defines the user interface and loads application scripts. |
| `main.js` | Handles CSV uploads, invokes extraction functions, and renders results. |
| `extractors.js` | Contains reusable functions for extracting information from scenario descriptions. |

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, etc.).
- A local development server, such as the Live Server extension for Visual Studio Code.
- An internet connection to load Papa Parse from its CDN.

### Running the Application

1. Clone or download the repository.
1. Open the project directory in Visual Studio Code.
1. Open `index.html` using Live Server.
1. Navigate to the application in your browser (typically `http://127.0.0.1:5500`).
1. Select a scenario CSV file using the file input.
1. Review the extracted data in the results table.
1. Use **Copy Table** to copy the results into Excel or another spreadsheet application.
1. Use **Export to CSV** to export the results into a new CSV (.csv) file.

**Note:** Opening `index.html` directly using the `file://` protocol may cause browser security restrictions when loading JavaScript modules. Use a local development server instead.

## Input Format

The application expects a CSV file containing a column named `Description`.

Descriptions are expected to follow the formatting conventions of the source scenario files. Extraction relies on 
specific markers and prefixes to identify stations, devices, and operations.

Descriptions that do not match the expected patterns may produce
empty or incomplete extraction results.

Each description is processed to extract the following fields:

| Output Field | Extraction Logic |
|---|---|
| Station | Extracts text between the `S=` and `C=` markers. |
| Device | Identifies supported device prefixes and extracts the corresponding device information. |
| Operation | Identifies supported operation or property markers. |
| Last Bracket Text | Extracts the contents of the final square-bracketed section. |

Rows without a string-valued `Description` field are excluded from processing.

## Application Workflow

```text
CSV File
   |
   v
Papa Parse
   |
   v
Filter Valid Description Rows
   |
   v
Extract Fields
   |-- extractStation()
   |-- extractDevice()
   |-- extractOperation()
   |-- extractLastBracketText()
   |
   v
Render HTML Table
   |
   +------------------------+
   |                        |
   v                        v
Copy Results            Export Results
to Clipboard               to CSV
```

## Development Notes

The extraction functions were translated from an existing VBA implementation into standalone JavaScript functions.

The application uses ES Modules to separate extraction logic from UI and file-processing responsibilities.

CSV parsing is handled by Papa Parse, while the results table is generated dynamically using native DOM APIs.
