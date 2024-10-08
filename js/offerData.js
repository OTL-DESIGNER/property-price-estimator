// Function to process seller offer data
function processSellerOfferData(values, formData) {
    const getValue = (row, col) => (values[row] && values[row][col]) ? values[row][col] : 'N/A';

    const data = {
        clientName: `${formData.ownerFirstName} ${formData.ownerLastName}`,
        propertyAddress: formData.propertyAddress,
        propertyCityStateZip: formData.propertyCityStateZip,
        agentFirstName: formData.agentFirstName,
        agentLastName: formData.agentLastName,
        agentPhoneNumber: formData.agentPhoneNumber,
        retailBuyPrice: getValue(10, 4),  // E11 - Retail Buy Price
        wholesaleBuyingOffer: getValue(22, 4),  // E23 - Target Wholesale Buy Price
        marketValueAfterRepairs: getValue(6, 1),  // B7 - ARV
        marketValueAsIs: getValue(8, 11),  // L9 - Market Value (As Is)
        
        // Retail Sale - After Repairs
        commissionAfterRepairs: getValue(10, 10),  // K11 - Selling Commission and Costs (Repairs)
        requiredRepairsAfterRepairs: getValue(11, 10),  // K12 - Repairs to achieve market value
        opportunityCostAfterRepairs: getValue(12, 10),  // K13 - Opportunity Cost (Repairs)
        associationFeesAfterRepairs: getValue(13, 10),  // K14 - Association Fees (Repairs)
        taxesAfterRepairs: getValue(14, 10),  // K15 - Taxes (Repairs)
        
        // Retail Sale - As Is
        commissionAsIs: getValue(10, 11),  // L11 - Selling Commission and Costs (As Is)
        opportunityCostAsIs: getValue(12, 11),  // L13 - Opportunity Cost (As Is)
        associationFeesAsIs: getValue(13, 11),  // L14 - Association Fees (As Is)
        taxesAsIs: getValue(14, 11),  // L15 - Taxes (As Is)
    };

    // Calculate total costs
    data.totalCostsAfterRepairs = calculateTotalCosts([
        data.commissionAfterRepairs,
        data.requiredRepairsAfterRepairs,
        data.opportunityCostAfterRepairs,
        data.associationFeesAfterRepairs,
        data.taxesAfterRepairs
    ]);

    data.totalCostsAsIs = calculateTotalCosts([
        data.commissionAsIs,
        data.opportunityCostAsIs,
        data.associationFeesAsIs,
        data.taxesAsIs
    ]);

    // Calculate Net To You
    data.netAfterRepairs = calculateNetToYou(data.marketValueAfterRepairs, data.totalCostsAfterRepairs);
    data.netAsIs = calculateNetToYou(data.marketValueAsIs, data.totalCostsAsIs);

    console.log('Processed data for seller offer:', data);
    return data;
}


function fetchAndPopulateOfferData(accessToken, formData) {
    // Fetch offer data (combine your existing fetchOfferResults and fetchAndPopulateSellerOffer functions)
    return Promise.all([
        fetchOfferResults(accessToken, formData),
        fetchAndPopulateSellerOffer(accessToken, formData)
    ]).then(([offerResults, sellerOfferData]) => {
        offerData = { ...offerResults, ...sellerOfferData };
        console.log('Combined offerData:', offerData);
        showOfferOptionsModal();
        return offerData;
    }).catch(error => {
        console.error('Error fetching offer data:', error);
        showErrorMessage('Failed to fetch offer data. Please try again.');
        throw error;
    });
}


// Javascript to populate Modal
function populateAgentOfferModal(data) {
    document.getElementById('clientNameAgent').innerText = data.clientName || 'N/A';
    document.getElementById('propertyAddressAgent').innerText = data.propertyAddress || 'N/A';
    document.getElementById('arvAgent').innerText = data.arv || 'N/A';
    document.getElementById('holdingPeriodAgent').innerText = data.holdingPeriod || 'N/A';
    document.getElementById('associationFeesAgent').innerText = data.monthlyAssociationFees || 'N/A';
    document.getElementById('annualTaxesAgent').innerText = data.annualTaxes || 'N/A';
    document.getElementById('retailOfferAgent').innerText = data.retailBuyingOffer || 'N/A';
    document.getElementById('percentageArvAgent').innerText = data.percentageArv || 'N/A';
    document.getElementById('wholesaleOfferAgent').innerText = data.wholesaleBuyingOffer || 'N/A';
}
function showOfferOptionsModal() {
    var offerOptionsModal = new bootstrap.Modal(document.getElementById('offerOptionsModal'));
    offerOptionsModal.show();
}

// Function to populate seller offer modal
function populateSellerOfferModal(data) {
    const elements = {
        sellerClientName: data.clientName,
        sellerPropertyAddress: data.propertyAddress,
        sellerPropertyCityStateZip: data.propertyCityStateZip, 
        sellerOfferDate: new Date().toLocaleDateString(), // Today's date
        sellerMarketValueAfterRepairs: formatCurrency(data.marketValueAfterRepairs),
        sellerMarketValueAsIs: formatCurrency(data.marketValueAsIs),
        sellerCommissionAfterRepairs: formatCurrency(data.commissionAfterRepairs),
        sellerCommissionAsIs: formatCurrency(data.commissionAsIs),
        sellerRequiredRepairs: formatCurrency(data.requiredRepairsAfterRepairs),
        sellerOpportunityCostAfterRepairs: formatCurrency(data.opportunityCostAfterRepairs),
        sellerOpportunityCostAsIs: formatCurrency(data.opportunityCostAsIs),
        sellerAssociationFeesAfterRepairs: formatCurrency(data.associationFeesAfterRepairs),
        sellerAssociationFeesAsIs: formatCurrency(data.associationFeesAsIs),
        sellerTaxesAfterRepairs: formatCurrency(data.taxesAfterRepairs),
        sellerTaxesAsIs: formatCurrency(data.taxesAsIs),
        sellerTotalCostsAfterRepairs: formatCurrency(data.totalCostsAfterRepairs),
        sellerTotalCostsAsIs: formatCurrency(data.totalCostsAsIs),
        sellerNetAfterRepairs: formatCurrency(data.netAfterRepairs),
        sellerNetAsIs: formatCurrency(data.netAsIs)
    };

    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || 'N/A';
        } else {
            console.warn(`Element with id ${id} not found`);
        }
    }
    // Display cash offer options
    const cashOfferElement = document.getElementById('sellerCashOffer');
    if (cashOfferElement) {
        cashOfferElement.innerHTML = `
            <p>Retail Buy Price: ${formatCurrency(data.retailBuyPrice)}</p>
            <p>Target Wholesale Price: ${formatCurrency(data.wholesaleBuyingOffer)}</p>
        `;
    } else {
        console.warn('Element with id sellerCashOffer not found');
    }
}