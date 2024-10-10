// Global variables
let accessToken;
let userEmail;

// Configuration
const googleClientId = "257537625805-2rpqesq2t71bma08teuigaeqjdi65pph.apps.googleusercontent.com";
const googleRedirectUri = "https://property-price-estimator.netlify.app/pricing_tool";

// Google Sign-In initialization
function initializeGoogleSignIn() {
    console.log("Initializing Google Sign-In");
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
            console.error('Sign-in button element not found');
        }
    } else {
        console.error('Google Sign-In script not loaded properly');
    }
}

// Handle the credential response from Google Sign-In
function handleCredentialResponse(response) {
    console.log("Received credential response");
    const decodedToken = JSON.parse(atob(response.credential.split('.')[1]));
    userEmail = decodedToken.email;
    localStorage.setItem('googleCredential', response.credential);
    console.log("Stored googleCredential in localStorage");

    // Redirect to pricing tool immediately after receiving the credential
    window.location.href = '/pricing_tool';
}

// Get authorization code from URL
function getAuthorizationCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
}

// Exchange authorization code for access token
function exchangeAuthorizationCodeForAccessToken(authorizationCode) {
    fetch(`/.netlify/functions/googleAuth?code=${authorizationCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                accessToken = data.access_token;
                localStorage.setItem('accessToken', accessToken);
                console.log('Access Token:', accessToken);
                clearUrlParams();
                window.location.href = '/pricing_tool';
            } else {
                throw new Error('No access token received');
            }
        })
        .catch(error => {
            console.error('Error during token exchange:', error);
            showErrorMessage('Failed to retrieve access token: ' + error.message);
        });
}
// UI Functions
function showLoginSuccessModal() {
    var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
    document.getElementById('g_id_signin').style.display = 'none';
    google.accounts.id.disableAutoSelect();
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
function checkAuth() {
    const isAuthenticated = !!localStorage.getItem('googleCredential');
    console.log("checkAuth result:", isAuthenticated);
    return isAuthenticated;
}

function signOut() {
    localStorage.removeItem('googleCredential');
    window.location.href = '/';
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
    const authorizationCode = getAuthorizationCodeFromUrl();
    if (authorizationCode) {
        exchangeAuthorizationCodeForAccessToken(authorizationCode);
    } else if (checkAuth()) {
        accessToken = localStorage.getItem('accessToken');
        console.log('User is authenticated');
    } else {
        initializeGoogleSignIn();
    }
}

// Run initialization when the page loads
window.addEventListener('load', init);