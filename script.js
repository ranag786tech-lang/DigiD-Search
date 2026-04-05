function search() {
    const query = document.getElementById("searchBox").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("results");

    // Purane results clear karein
    resultsDiv.innerHTML = "";

    if (query === "") {
        resultsDiv.innerHTML = "<p style='color: #666;'>Search box khali hai. Kuch type karein...</p>";
        return;
    }

    // Smart Filtering: Title, Description, Category aur Keywords sab mein check karega
    const filtered = data.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.keywords && item.keywords.some(k => k.toLowerCase().includes(query)))
    );

    // Agar koi result na mile
    if (filtered.length === 0) {
        resultsDiv.innerHTML = `<div class="no-results">
            <p>🔍 "<strong>${query}</strong>" ke mutabiq kuch nahi mila.</p>
        </div>`;
        return;
    }

    // Results ko screen par dikhana
    filtered.forEach(item => {
        const div = document.createElement("div");
        div.className = "result-item";

        div.innerHTML = `
            <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
            <span class="category-tag">${item.category || 'General'}</span>
            <p>${item.description}</p>
            <small>${item.link}</small>
        `;

        resultsDiv.appendChild(div);
    });
}

// Enter Key Support: Button click ki zaroorat nahi paregi
document.getElementById("searchBox").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        search();
    }
});
