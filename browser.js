const webview = document.getElementById('webview');
const urlInput = document.getElementById('url-input');

function go(){
    let url = urlInput.value.trim();
    if(!url) return;

    // Search vs URL
    if(!url.startsWith('http') && !url.includes('.')){
        // Google ki jagah DuckDuckGo - ye iframe me chalta hai
        url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
    } else if(!url.startsWith('http')){
        url = 'https://' + url;
    }

    // Google, YouTube, Facebook ye sab iframe block karte hain
    // Is liye unko naye tab me kholo
    const blocked = ['google.com', 'youtube.com', 'facebook.com', 'instagram.com'];
    if(blocked.some(b => url.includes(b))){
        window.open(url, '_blank');
        urlInput.value = "Opened in new tab: " + url;
        return;
    }

    webview.src = url;
    urlInput.value = url;
}

function goBack(){ webview.contentWindow.history.back(); }
function goForward(){ webview.contentWindow.history.forward(); }
function reloadPage(){ webview.src = webview.src; }

// Shuru me apna home page
window.onload = () => {
    webview.srcdoc = `
        <div style="font-family:sans-serif; text-align:center; padding:50px;">
            <h1 style="color:#4285F4;">DigiD Browser</h1>
            <p>Fast & Private</p>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:15px; max-width:300px; margin:30px auto;">
                <a href="https://duckduckgo.com" target="_self"><div>🦆<br>Duck</div></a>
                <a href="https://wikipedia.org" target="_self"><div>📚<br>Wiki</div></a>
                <a href="https://youtube.com" target="_blank"><div>▶️<br>YouTube</div></a>
                <a href="https://github.com" target="_self"><div>💻<br>GitHub</div></a>
            </div>
            <p style="color:gray; font-size:13px;">Kuch bhi search karo upar wale bar me</p>
        </div>
    `;
}