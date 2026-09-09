const webview = document.getElementById('webview');
const urlInput = document.getElementById('url-input');

// Ye sites iframe me embed hone nahi deti, in ko naye tab me kholo
const BLOCKED_HOSTS = ['google.com', 'youtube.com', 'facebook.com', 'instagram.com'];

const OCTET = '(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
const IPV4 = new RegExp(`^${OCTET}(\\.${OCTET}){3}(:\\d+)?([/?#].*)?$`);
const DOMAIN = /^[^\s/?#]+\.[a-z]{2,}\.?(?::\d+)?([/?#].*)?$/i;

const HOME_HTML = `
    <div style="font-family:sans-serif; text-align:center; padding:50px;">
        <h1 style="color:#4285F4;">DigiD Browser</h1>
        <p>Fast &amp; Private</p>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:15px; max-width:300px; margin:30px auto;">
            <a href="https://duckduckgo.com" onclick="return parent.openFromHome(this.href)"><div>🦆<br>Duck</div></a>
            <a href="https://wikipedia.org" onclick="return parent.openFromHome(this.href)"><div>📚<br>Wiki</div></a>
            <a href="https://youtube.com" target="_blank"><div>▶️<br>YouTube</div></a>
            <a href="https://github.com" onclick="return parent.openFromHome(this.href)"><div>💻<br>GitHub</div></a>
        </div>
        <p style="color:gray; font-size:13px;">Kuch bhi search karo upar wale bar me</p>
    </div>
`;

// Iframe ki apni history cross-origin pages par padhi nahi ja sakti,
// is liye apni history khud rakhte hain
const HOME_ENTRY = { home: true };
const navStack = [];
let navIndex = -1;

function looksLikeUrl(text){
    if(/^https?:\/\//i.test(text)) return true;
    if(/\s/.test(text)) return false;
    return DOMAIN.test(text) || IPV4.test(text);
}

function isBlockedHost(hostname){
    hostname = hostname.replace(/\.+$/, '');
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
}

function openFromHome(url){
    navigate(url);
    return false;
}

function navigate(url){
    pushEntry({ url });
}

function pushEntry(entry){
    navStack.splice(navIndex + 1);
    navStack.push(entry);
    navIndex = navStack.length - 1;
    render(entry);
}

function render(entry){
    if(entry.home){
        webview.removeAttribute('src');
        webview.srcdoc = HOME_HTML;
        urlInput.value = '';
    } else {
        webview.removeAttribute('srcdoc');
        webview.src = entry.url;
        urlInput.value = entry.url;
    }
}

function goBack(){
    if(navIndex <= 0) return;
    render(navStack[--navIndex]);
}

function goForward(){
    if(navIndex >= navStack.length - 1) return;
    render(navStack[++navIndex]);
}

function reloadPage(){
    if(navIndex < 0) return;
    render(navStack[navIndex]);
}

// Shuru me apna home page
window.onload = () => pushEntry(HOME_ENTRY);
