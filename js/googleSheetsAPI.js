function getAccessToken() {
    return localStorage.getItem('accessToken');
}


function sendDataToOfferSheet(data) {
    const accessToken = getAccessToken();
    if (!accessToken) {
        throw new Error('No access token available. Please log in again.');
    }
    const spreadsheetId = '1RsJO6oJpA0-e2FeifhYSXsY2qXPb2np10hjFUs3HYuQ';
    const range = 'Offer!B7:B14';  // Updated range to exclude property address
    
    const values = [
        [data.arv],                                       // B7 - ARV
        [],                                       // B8 - As Is Market Value (same as ARV)
        [data.holdingPeriod],                             // B9 - Holding Period (months)
        [],                                               // B10
        [],                                               // B11
        [],                                               // B12
        [data.monthlyAssociationFees],                    // B13 - Monthly Association Fees
        [data.annualTaxes]                                // B14 - Annual Taxes
    ];

    const body = {
        values: values
    };

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => {
        console.log('Response Status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Error response from Google Sheets API:', text);
                throw new Error(`Failed to send data: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(result => {
        console.log('Data successfully sent to the Offer sheet:', result);
        // document.getElementById('responseMessage').innerHTML += '<p>Offer data submitted successfully!</p>';
        // Fetch the offer results after the calculations are done
        fetchOfferResults(accessToken, data);

    })
    .catch(error => {
        console.error('Error sending data to the Offer sheet:', error);
        document.getElementById('responseMessage').innerHTML += '<p>Error submitting offer data: ' + error.message + '</p>';
    });
}


// function to send data to rehab estimation sheet
function sendDataToGoogleSheets(data) {
    const accessToken = getAccessToken();
    if (!accessToken) {
        throw new Error('No access token available. Please log in again.');
    }
    const spreadsheetId = '1RsJO6oJpA0-e2FeifhYSXsY2qXPb2np10hjFUs3HYuQ';
    const range = 'Rehab Estimation!B1:B35';  // Range covers only column B

    // Map form data to spreadsheet cells
    const values = [
        [data.propertyAddress],  // B1
        [data.totalSqFt],        // B2
        [data.livingSqFt],       // B3
        [data.lotSize],          // B4
        [],                      // B5 (empty)
        [],                      // B6 (empty)
        [],                      // B7 (empty)
        [],                      // B8 (empty)
        [data.propertyAddress],  // B9
        [data.bedrooms],         // B10
        [data.bathrooms],        // B11
        [data.livingSqFt],       // B12
        [data.totalSqFt],        // B13
        [data.lotSize],          // B14
        [data.pool],             // B15
        [data.equipment],        // B16
        [data.waterTreatment],   // B17
        [data.tile],             // B18
        [data.resurface],        // B19
        [data.windows],          // B20
        [data.electric],         // B21
        [data.electricPanel],    // B22
        [data.acNeeded],         // B23
        [data.acDuctWork],       // B24
        [data.landscapingNeeded],// B25
        [data.kitchen],          // B26
        [data.appliance],        // B27
        [data.flooring],         // B28
        [data.paintInterior],    // B29
        [data.paintExterior],    // B30
        [data.roof],             // B31
        [data.other],            // B32
        [data.customRenovationAmount1],  // B33
        [data.customRenovationAmount2],  // B34
        [data.customRenovationAmount3]   // B35
    ];

    const body = {
        values: values
    };

    console.log('Sending data to Google Sheets:', body);

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => {
        console.log('Response Status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Error response from Google Sheets API:', text);
                throw new Error(`Failed to send data: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(result => {
        console.log('Data successfully sent to Google Sheets:', result);
        // document.getElementById('responseMessage').innerHTML = 'Data submitted successfully!';
        // After successful submission, fetch the calculated results
        fetchCalculatedResults(accessToken);
    })
    .catch(error => {
        console.error('Error sending data to Google Sheets:', error);
        document.getElementById('responseMessage').innerHTML = 'Error submitting data: ' + error.message;
    });
}

 // Fetch Calculated Results from Google Sheets
 function fetchCalculatedResults(accessToken) {
    const accessToken = getAccessToken();
    if (!accessToken) {
        throw new Error('No access token available. Please log in again.');
    }
    const spreadsheetId = '1RsJO6oJpA0-e2FeifhYSXsY2qXPb2np10hjFUs3HYuQ';
    const range = 'Rehab Estimation!E32:F34'; // Include sheet name in the range

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Error response from Google Sheets API:', text);
                throw new Error(`Failed to fetch data: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(result => {
        console.log('Fetched results:', result);
        if (result.values && result.values.length >= 3) {
            const contractorFeeOurCost = result.values[0][0] || 'N/A'; // E32
            const contractorFeeRetailCost = result.values[0][1] || 'N/A'; // F32
            const grandTotalOurCost = result.values[2][0] || 'N/A'; // E34
            const grandTotalRetailCost = result.values[2][1] || 'N/A'; // F34

            // document.getElementById('responseMessage').innerHTML += `
            //     <h3>Calculated Results:</h3>
            //     <p>Contractor Fee (Our Cost): ${contractorFeeOurCost}</p>
            //     <p>Contractor Fee (Retail Cost): ${contractorFeeRetailCost}</p>
            //     <p>Grand Total (Our Cost): ${grandTotalOurCost}</p>
            //     <p>Grand Total (Retail Cost): ${grandTotalRetailCost}</p>
            // `;
        } else {
            document.getElementById('responseMessage').innerHTML += '<p>No results available.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching results from Google Sheets:', error);
        document.getElementById('responseMessage').innerHTML += '<p>Error fetching results: ' + error.message + '</p>';
    });
}

// Fetch Calculated Offer Results from Google Sheets
function fetchOfferResults(accessToken, formData) {
    const accessToken = getAccessToken();
    if (!accessToken) {
        throw new Error('No access token available. Please log in again.');
    }
    const spreadsheetId = '1RsJO6oJpA0-e2FeifhYSXsY2qXPb2np10hjFUs3HYuQ';
    const range = 'Offer!B7:E23';  // Updated range to include all needed cells

    return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('Fetched Offer Data:', result.values);
        
        if (result.values && result.values.length >= 17) {
            offerData = {
                clientName: `${formData.ownerFirstName} ${formData.ownerLastName}`,
                agentFirstName: formData.agentFirstName,
                agentLastName: formData.agentLastName,
                agentPhoneNumber: formData.agentPhoneNumber,
                propertyAddress: formData.propertyAddress,
                propertyCityStateZip: formData.propertyCityStateZip,
                arv: result.values[0][0] || 'N/A',
                holdingPeriod: result.values[2][0] || 'N/A',
                monthlyAssociationFees: result.values[6][0] || 'N/A',
                annualTaxes: result.values[7][0] || 'N/A',
                retailBuyingOffer: result.values[4][3] || 'N/A',
                percentageArv: result.values[7][3] || 'N/A',
                wholesaleBuyingOffer: result.values[16][3] || 'N/A'
            };

            console.log('Updated offerData:', offerData);
            populateAgentOfferModal(offerData);
            return offerData;
        } else {
            throw new Error('Insufficient data received from the spreadsheet');
        }
    })
    .catch(error => {
        console.error('Error fetching offer results:', error);
        alert('Error fetching offer results: ' + error.message);
        throw error;
    });
}
// fetch and populate seller offer
function fetchAndPopulateSellerOffer(accessToken, formData) {
    const spreadsheetId = '1RsJO6oJpA0-e2FeifhYSXsY2qXPb2np10hjFUs3HYuQ';
    const range = 'Offer!A1:L35';  // Range includes all necessary columns

    return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('Fetched results for seller offer:', result);
        
        if (result.values && result.values.length > 0) {
            const processedData = processSellerOfferData(result.values, formData);
            populateSellerOfferModal(processedData);
            return processedData;
        } else {
            throw new Error('Insufficient data received from the spreadsheet');
        }
    })
    .catch(error => {
        console.error('Error fetching seller offer data:', error);
        showErrorMessage('Error fetching offer data: ' + error.message);
        throw error;
    });
}
