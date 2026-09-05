const webview = document.getElementById('webview');
const urlInput = document.getElementById('url-input');

function go(){
    let url = urlInput.value.trim();
    if(!url) return;
    // Agar URL nahi, to Google search samjho
    if(!url.startsWith('http') && !url.includes('.')){
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    } else if(!url.startsWith('http')){
        url = 'https://' + url;
    }
    webview.src = url;
    urlInput.value = url;
}
function goBack(){ webview.contentWindow.history.back(); }
function goForward(){ webview.contentWindow.history.forward(); }
function reloadPage(){ webview.src = webview.src; }

// Shuru me Google kholo
window.onload = () => {
    urlInput.value = "google.com";
    go();
}
