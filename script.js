function search() {
    const query = document.getElementById("searchBox").value.toLowerCase();
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "";

    const filtered = data.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        resultsDiv.innerHTML = "<p>No results found</p>";
        return;
    }

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.className = "result-item";

        div.innerHTML = `
            <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
            <p>${item.description}</p>
        `;

        resultsDiv.appendChild(div);
    });
}
