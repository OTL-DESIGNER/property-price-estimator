// Helper function to format currency
function formatCurrency(value) {
    if (value === 'N/A' || value == null) return 'N/A';
    const numValue = parseFloat(value.replace(/[^0-9.-]+/g,""));
    return isNaN(numValue) ? 'N/A' : `$${numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

// Helper function to calculate total costs
function calculateTotalCosts(costs) {
    return costs.reduce((total, cost) => {
        const value = parseFloat(cost.replace(/[^0-9.-]+/g,""));
        return isNaN(value) ? total : total + value;
    }, 0).toFixed(2);
}

// Helper function to calculate Net To You
function calculateNetToYou(marketValue, totalCosts) {
    const mvValue = parseFloat(marketValue.replace(/[^0-9.-]+/g,""));
    const tcValue = parseFloat(totalCosts);
    return isNaN(mvValue) || isNaN(tcValue) ? 'N/A' : (mvValue - tcValue).toFixed(2);
}


// Function to show seller offer modal
// function showSellerOfferModal() {
//     const modalElement = document.getElementById('sellerOfferModal');
//     if (modalElement) {
//         const sellerOfferModal = new bootstrap.Modal(modalElement);
//         sellerOfferModal.show();
//     } else {
//         console.error('Seller offer modal element not found');
//         showErrorMessage('Unable to display the offer. Please try again.');
//     }
// }

// Function to show error message
function showErrorMessage(message) {
    console.error(message); // Always log the error to console
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        // If the error element doesn't exist, create one
        const newErrorElement = document.createElement('div');
        newErrorElement.id = 'errorMessage';
        newErrorElement.textContent = message;
        newErrorElement.style.color = 'red';
        newErrorElement.style.marginTop = '10px';
        document.body.insertBefore(newErrorElement, document.body.firstChild);
    }
}