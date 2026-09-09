const webview = document.getElementById('webview');
const urlInput = document.getElementById('url-input');

// Ye sites iframe me embed hone nahi deti, in ko naye tab me kholo
const BLOCKED_HOSTS = ['google.com', 'youtube.com', 'facebook.com', 'instagram.com'];

function looksLikeUrl(text){
    if(/^https?:\/\//i.test(text)) return true;
    if(/\s/.test(text)) return false;
    return /^[^\s/?#]+\.[a-z]{2,}(?::\d+)?([/?#].*)?$/i.test(text);
}

function isBlockedHost(hostname){
    return BLOCKED_HOSTS.some(h => hostname === h || hostname.endsWith('.' + h));
}

function go(){
    const query = urlInput.value.trim();
    if(!query) return;

    let url;
    if(looksLikeUrl(query)){
        url = /^https?:\/\//i.test(query) ? query : 'https://' + query;
    } else {
        // Google ki jagah DuckDuckGo - ye iframe me chalta hai
        url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    }

    let hostname;
    try {
        hostname = new URL(url).hostname.toLowerCase();
    } catch {
        url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        hostname = 'duckduckgo.com';
    }

    if(isBlockedHost(hostname)){
        window.open(url, '_blank');
        return;
    }

    navigate(url);
    urlInput.value = url;
}

function navigate(url){
    webview.removeAttribute('srcdoc');
    webview.src = url;
}

function goBack(){ webview.contentWindow.history.back(); }
function goForward(){ webview.contentWindow.history.forward(); }
function reloadPage(){
    if(webview.hasAttribute('srcdoc')) return;
    webview.src = webview.src;
}

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