let offerData; // Global variable to store the offer data

// Call setupPDFDownloadListeners only once when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('viewBuyingAgentOffer').addEventListener('click', function() {
        if (offerData) {
            populateAgentOfferModal(offerData);
            var agentOfferModal = new bootstrap.Modal(document.getElementById('agentOfferModal'));
            agentOfferModal.show();
        } else {
            alert('Offer data is not available. Please try submitting the form again.');
        }
    });

    document.getElementById('viewSellerOffer').addEventListener('click', function() {
        if (offerData) {
            var sellerOfferModal = new bootstrap.Modal(document.getElementById('sellerOfferModal'));
            sellerOfferModal.show();
        } else {
            alert('Offer data is not available. Please try submitting the form again.');
        }
    });

    // Initialize listeners for downloads and email
    setupPDFDownloadListeners();
});