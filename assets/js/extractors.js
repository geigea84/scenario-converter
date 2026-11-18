/**
 * Extracts the station name from the description.
 */
function extractStation(cellText) {
    const startText = "S=";
    const endText = " C=";

    const text = cellText.toLowerCase();

    const p1 = text.indexOf(startText.toLowerCase());

    if (p1 !== -1) {
        const startPos = p1 + startText.length;
        const p2 = text.indexOf(endText.toLowerCase(), startPos);

        if (p2 !== -1) {
            return cellText.slice(startPos, p2);
        }
    }

    return "";
}

/**
 * Extracts the device associated with the GenericElement.
 */
function extractDevice(cellText) {
    const startStrings = [
        "Generator =",
        "LineReactor = LineReactor",
        "Load = Load",
        "ShuntReactor = ShuntReactor",
        "Switch = Breaker BK",
        "Switch = Breaker",
        "Switch = Switch",
        "Transformer = Transformer"
    ];

    const endText = " (S=";
    const text = cellText.toLowerCase();

    for (const startString of startStrings) {
        const startPos = text.indexOf(startString.toLowerCase());

        if (startPos !== -1) {
            const valueStart = startPos + startString.length + 1;
            const endPos = text.indexOf(endText.toLowerCase(), valueStart);

            if (endPos !== -1) {
                return cellText.slice(valueStart, endPos);
            }
        }
    }

    return "";
}

/**
 * Extracts the operation from the description.
 * Preserves the original VBA offset logic.
 */
function extractOperation(cellText) {
    const operations = [
        "Enabled (%) =",
        "High Side Tap Position =",
        "Low Side Tap Position =",
        "ScaleFactor =",
        "State ="
    ];

    const offsets = [14, 25, 24, 14, 0];
    const text = cellText.toLowerCase();

    for (let i = 0; i < operations.length; i++) {
        const startPos = text.indexOf(operations[i].toLowerCase());

        if (startPos !== -1) {
            const valueStart =
                startPos + operations[i].length + 1 - offsets[i];

            // Equivalent to the original VBA Mid() length calculation.
            // VBA's Len(cellText) - Start_Pos omits the final character.
            return cellText.slice(
                Math.max(0, valueStart),
                Math.max(0, cellText.length - 1)
            );
        }
    }

    return "";
}

/**
 * Extracts the text inside the last matching pair of square brackets.
 */
function extractLastBracketText(cellText) {
    const endPos = cellText.lastIndexOf("]");

    if (endPos === -1) {
        return "";
    }

    const startPos = cellText.lastIndexOf("[", endPos - 1);

    if (startPos === -1) {
        return "";
    }

    return cellText.slice(startPos + 1, endPos);
}

export {
    extractStation,
    extractDevice,
    extractOperation,
    extractLastBracketText
};
