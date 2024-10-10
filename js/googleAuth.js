// Global variables
let accessToken;
let userEmail;

// Configuration
const googleClientId = "257537625805-2rpqesq2t71bma08teuigaeqjdi65pph.apps.googleusercontent.com";
const googleRedirectUri = "https://property-price-estimator.netlify.app/pricing_tool";

// Google Sign-In initialization
function initializeGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        const signinButton = document.getElementById('g_id_signin');
        if (signinButton) {
            google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleCredentialResponse
            });

            google.accounts.id.renderButton(
                signinButton,
                { theme: 'outline', size: 'large' }
            );
        } else {
            console.error('Sign-in button element not found');
        }
    } else {
        console.error('Google Sign-In script not loaded properly');
    }
}


window.addEventListener('load', initializeGoogleSignIn);

// Handle the credential response from Google Sign-In
function handleCredentialResponse(response) {
    const decodedToken = JSON.parse(atob(response.credential.split('.')[1]));
    userEmail = decodedToken.email;
    localStorage.setItem('googleCredential', response.credential);

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
    console.log("Starting token exchange...");
    fetch(`/.netlify/functions/googleAuth?code=${authorizationCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                accessToken = data.access_token;
                console.log('Access token received:', accessToken);
                localStorage.setItem('accessToken', accessToken);  // Store the token for later use
                showLoginSuccessModal();
                clearUrlParams();
                window.location.href = '/pricing_tool';  // Redirect to pricing tool
            } else {
                console.error('No access token received');
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
    
    const signinButton = document.getElementById('g_id_signin');
    if (signinButton) {
        signinButton.style.display = 'none';  // Ensure the button exists before modifying its style
    } else {
        console.error('Sign-in button element not found');
    }

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

function signOut() {
    localStorage.removeItem('googleCredential');
    accessToken = null;
    userEmail = null;
    window.location.href = '/';
}

function checkAuth() {
    return !!localStorage.getItem('googleCredential');
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
    initializeGoogleSignIn();
    checkForThirdPartyCookies();

    const authorizationCode = getAuthorizationCodeFromUrl();
    if (authorizationCode) {
        exchangeAuthorizationCodeForAccessToken(authorizationCode);
    } else if (checkAuth()) {
        if (window.location.pathname === '/pricing_tool') {
            // User is already authenticated and on the pricing tool page
            console.log('User is authenticated on pricing tool page');
        } else {
            window.location.href = '/pricing_tool';
        }
    } else if (window.location.pathname === '/pricing_tool') {
        // User is not authenticated but on the pricing tool page
        window.location.href = '/';
    }
}

// Run initialization when the page loads
window.addEventListener('load', init);