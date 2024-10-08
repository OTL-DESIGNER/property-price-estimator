// Store access token globally
let accessToken;
let userEmail;

// Function to handle the Google OAuth login and retrieve the access token
function handleCredentialResponse(response) {
    const decodedToken = JSON.parse(atob(response.credential.split('.')[1]));
    userEmail = decodedToken.email;

    const oauth2Url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=https://www.googleapis.com/auth/spreadsheets`;
    window.location.href = oauth2Url;
}

// Get the authorization code from the URL after the user has been redirected back
function getAuthorizationCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
}

// Exchange the authorization code for an OAuth access token
function exchangeAuthorizationCodeForAccessToken(authorizationCode) {
    fetch(`/.netlify/functions/googleAuth?code=${authorizationCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                accessToken = data.access_token;
                console.log('Access Token:', accessToken);
                showLoginSuccessModal();
                clearUrlParams();
            } else {
                throw new Error('No access token received');
            }
        })
        .catch(error => {
            console.error('Error during token exchange:', error);
            showErrorMessage('Failed to retrieve access token: ' + error.message);
        });
}

// Function to show login success modal
function showLoginSuccessModal() {
    var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
    document.querySelector('.g_id_signin').style.display = 'none';
    google.accounts.id.disableAutoSelect();
}

// Function to show error message
function showErrorMessage(message) {
    document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">${message}</div>`;
}

// Function to clear the URL parameters after successful token exchange
function clearUrlParams() {
    const newUrl = window.location.origin + window.location.pathname;
    window.history.pushState({}, document.title, newUrl);
}

// Initialize Google OAuth Login
window.onload = function() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.querySelector('.g_id_signin'),
            { theme: 'outline', size: 'large' }
        );
        const authorizationCode = getAuthorizationCodeFromUrl();
        if (authorizationCode) {
            exchangeAuthorizationCodeForAccessToken(authorizationCode);
        } else {
            google.accounts.id.prompt();
        }
    } else {
        console.error('Google Sign-In script not loaded properly');
    }
    checkForThirdPartyCookies();
};

// Function to check if third-party cookies are enabled
function checkForThirdPartyCookies() {
    try {
        document.cookie = "testcookie=test; SameSite=None; Secure";
        if (document.cookie.indexOf("testcookie") === -1) {
            alert("Third-party cookies are disabled. Please enable them for this application to work.");
        } else {
            console.log("Third-party cookies are enabled.");
        }
    } catch (e) {
        console.error("Error checking cookies:", e);
        alert("Your browser settings may prevent this functionality. Please ensure third-party cookies are enabled.");
    }
}