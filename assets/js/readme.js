const readmeContent = document.getElementById("readme-content");

async function loadReadme() {
    try {
        const response = await fetch("./README.md");

        if (!response.ok) {
            throw new Error(`Failed to load README: ${response.status}`);
        }

        const markdown = await response.text();

        readmeContent.innerHTML = marked.parse(markdown);

        const headings = readmeContent.querySelectorAll("h1, h2, h3, h4, h5, h6");

        headings.forEach(heading => {
            const headingId = heading.textContent
                .toLowerCase()
                .trim()
                .replace(/[^\w -]/g, "")
                .replace(/\s+/g, "-");

            heading.id = headingId;
        });
    } catch (error) {
        console.error("Failed to load README: ", error);
        readmeContent.textContent = "Unable to load documentation.";
    }
}

loadReadme();
