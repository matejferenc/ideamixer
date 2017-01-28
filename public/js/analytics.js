function logFacebookLogin(facebookId) {
    sendToGa('facebook', 'login', facebookId, null)
}

function logFacebookLogout(facebookId) {
    sendToGa('facebook', 'logout', facebookId, null)
}

function logMapDrag() {
    sendToGa('map', 'drag', null, null);
}

function logMapZoomChange() {
    sendToGa('map', 'zoom', null, null);
}

function logSettingsOpen() {
    sendToGa('settings', 'open', null, null);
}

function logSettingsClosed() {
    sendToGa('settings', 'closed', null, null);
}

function logColorSchemeChanged(scheme) {
    sendToGa('settings', 'color', scheme, null);
}

function logFilterChanged(filterName, value) {
    sendToGa('settings', 'filter', filterName, parseInt(value));
}

function logVisitedReality(name) {
    sendToGa('reality', 'visit', name, null);
}

function logFavoriteReality(name) {
    sendToGa('reality', 'favorite', name, 1);
}

function logNotFavoriteReality(name) {
    sendToGa('reality', 'favorite', name, 0);
}

function logHideReality(name) {
    sendToGa('reality', 'hide', name, null);
}

function sendToGa(category, action, label, value) {
    ga('send', {
        hitType: 'event',
        eventCategory: category,
        eventAction: action,
        eventLabel: label,
        eventValue: value
    });
}