// نیا advanced script.js
let searchData = [];
let searchIndex = {};

// ڈیٹا لوڈ کرتے وقت inverted index بنا لو
function buildSearchIndex(data) {
    searchIndex = {};
    data.forEach((item, idx) => {
        const text = (item.title + " " + item.description + " " + item.keywords?.join(" ")).toLowerCase();
        const words = text.split(/\W+/);
        
        words.forEach(word => {
            if (!searchIndex[word]) searchIndex[word] = [];
            if (!searchIndex[word].includes(idx)) searchIndex[word].push(idx);
        });
    });
}

// Ranking function (TF-IDF based)
function calculateRelevance(query, item, idx) {
    const queryWords = query.toLowerCase().split(/\W+/);
    let score = 0;
    
    queryWords.forEach(word => {
        // Title میں match → سب سے زیادہ وزن
        if (item.title.toLowerCase().includes(word)) score += 10;
        
        // Keywords میں match → زیادہ وزن
        if (item.keywords?.some(k => k.toLowerCase().includes(word))) score += 5;
        
        // Description میں match → کم وزن
        if (item.description.toLowerCase().includes(word)) score += 2;
        
        // Popularity factor (clicks count agar save kiya ho)
        if (item.clicks) score += item.clicks / 100;
    });
    
    return score;
}

// Advanced search function
function advancedSearch(query) {
    if (!query.trim()) return [];
    
    const queryLower = query.toLowerCase();
    const scored = [];
    
    searchData.forEach((item, idx) => {
        const score = calculateRelevance(queryLower, item, idx);
        if (score > 0) {
            scored.push({ ...item, relevance: score });
        }
    });
    
    // Relevance کے حساب سے sort
    scored.sort((a, b) => b.relevance - a.relevance);
    return scored;
}

// اپنے existing search() function کو replace کر دو
window.search = function() {
    const query = document.getElementById("searchBox").value;
    const results = advancedSearch(query);
    displayResults(results);
};
