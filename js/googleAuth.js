// Global variables
let accessToken;
let userEmail;

// Configuration
const googleClientId = "257537625805-2rpqesq2t71bma08teuigaeqjdi65pph.apps.googleusercontent.com";
const googleRedirectUri = "https://property-price-estimator.netlify.app/pricing_tool";

// Google Sign-In initialization
function initializeGoogleSignIn() {
    if (window.location.pathname !== '/') {

        return;
    }

    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse
        });

        const signInButton = document.getElementById('g_id_signin');
        if (signInButton) {
            google.accounts.id.renderButton(
                signInButton,
                { theme: 'outline', size: 'large' }
            );
        } else {
            console.warn('Google Sign-In button element not found on home page');
        }
    } else {
        console.error('Google Sign-In script not loaded properly');
    }
}

// Handle the credential response from Google Sign-In
function handleCredentialResponse(response) {
    const decodedToken = JSON.parse(atob(response.credential.split('.')[1]));
    userEmail = decodedToken.email;
    localStorage.setItem('googleCredential', response.credential);
    localStorage.setItem('accessToken', response.credential); // Store credential as access token

    console.log('Credential stored, redirecting to OAuth2 URL');
    const oauth2Url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=https://www.googleapis.com/auth/spreadsheets`;
    window.location.href = oauth2Url;
}

// Get authorization code from URL
function getAuthorizationCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
}

// Exchange authorization code for access token
function exchangeAuthorizationCodeForAccessToken(authorizationCode) {
    console.log('Exchanging authorization code for access token');
    fetch(`/.netlify/functions/googleAuth?code=${authorizationCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                accessToken = data.access_token;
                localStorage.setItem('accessToken', accessToken);
                console.log('Access Token received and stored:', accessToken);
                showLoginSuccessModal();
                clearUrlParams();
                console.log('Redirecting to pricing tool page');
                window.location.href = '/pricing_tool';
            } else {
                throw new Error('No access token received');
            }
        })
        .catch(error => {
            console.error('Error during token exchange:', error);
            showErrorMessage('Failed to retrieve access token: ' + error.message);
            localStorage.setItem('redirectReason', 'Token exchange failed');
            window.location.href = '/';
        });
}

// UI Functions
function showLoginSuccessModal() {
    var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
    const signInButton = document.getElementById('g_id_signin');
    if (signInButton) {
        signInButton.style.display = 'none';
    }
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
    }
}
function showErrorMessage(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        console.error(message);
    }
}

// Utility Functions
function clearUrlParams() {
    const newUrl = window.location.origin + window.location.pathname;
    window.history.pushState({}, document.title, newUrl);
}

function signOut() {
    localStorage.removeItem('googleCredential');
    localStorage.removeItem('accessToken');
    accessToken = null;
    userEmail = null;
    window.location.href = '/';
}

function checkAuth() {
    const googleCredential = localStorage.getItem('googleCredential');
    const accessToken = localStorage.getItem('accessToken');
    console.log('Google Credential:', googleCredential ? 'Present' : 'Not present');
    console.log('Access Token:', accessToken ? 'Present' : 'Not present');
    console.log('Full Access Token:', accessToken);
    return !!(googleCredential && accessToken);
}

function checkForThirdPartyCookies() {
    try {
        document.cookie = "testcookie=test; SameSite=None; Secure";
        if (document.cookie.indexOf("testcookie") === -1) {
            showErrorMessage("Third-party cookies are disabled. Please enable them for this application to work.");
        } else {
            console.log("Third-party cookies are enabled.");
        }
    } catch (e) {
        console.error("Error checking cookies:", e);
        showErrorMessage("Your browser settings may prevent this functionality. Please ensure third-party cookies are enabled.");
    }
}

// Main initialization
function init() {
    if (window.location.pathname === '/') {
        initializeGoogleSignIn();
    } else if (window.location.pathname === '/pricing_tool') {
        if (!checkAuth()) {
            window.location.href = '/';
        }
    }

    checkForThirdPartyCookies();

    const authorizationCode = getAuthorizationCodeFromUrl();
    if (authorizationCode) {
        exchangeAuthorizationCodeForAccessToken(authorizationCode);
    }
}
// Run initialization when the page loads
window.addEventListener('load', init);