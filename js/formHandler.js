// Form Submission Handler
document.getElementById('propertyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        ownerFirstName: document.getElementById('ownerFirstName').value,
        ownerLastName: document.getElementById('ownerLastName').value,
        ownerEmail: document.getElementById('ownerEmail').value,
        agentFirstName: document.getElementById('agentFirstName').value,
        agentLastName: document.getElementById('agentLastName').value,
        agentPhoneNumber: document.getElementById('agentPhoneNumber').value,
        propertyAddress: document.getElementById('propertyAddress').value,
        propertyCityStateZip: document.getElementById('propertyCityStateZip').value,
        totalSqFt: document.getElementById('totalSqFt').value,
        livingSqFt: document.getElementById('livingSqFt').value,
        lotSize: document.getElementById('lotSize').value,
        bedrooms: document.getElementById('bedrooms').value,
        bathrooms: document.getElementById('bathrooms').value,
        pool: document.getElementById('pool').value,
        equipment: document.getElementById('equipment').value,
        waterTreatment: document.getElementById('waterTreatment').value,
        tile: document.getElementById('tile').value,
        resurface: document.getElementById('resurface').value,
        windows: document.getElementById('windows').value,
        electric: document.getElementById('electric').value,
        electricPanel: document.getElementById('electricPanel').value,
        acNeeded: document.getElementById('acNeeded').value,
        acDuctWork: document.getElementById('acDuctWork').value,
        landscapingNeeded: document.getElementById('landscapingNeeded').value,
        kitchen: document.getElementById('kitchen').value,
        appliance: document.getElementById('appliance').value,
        flooring: document.getElementById('flooring').value,
        paintInterior: document.getElementById('paintInterior').value,
        paintExterior: document.getElementById('paintExterior').value,
        roof: document.getElementById('roof').value,
        other: document.getElementById('other').value,
        customRenovationAmount1: document.getElementById('customRenovationAmount1').value,
        customRenovationAmount2: document.getElementById('customRenovationAmount2').value,
        customRenovationAmount3: document.getElementById('customRenovationAmount3').value,
        // Offer specific data
        arv: document.getElementById('arv').value,
        holdingPeriod: document.getElementById('holdingPeriod').value,
        monthlyAssociationFees: document.getElementById('monthlyAssociationFees').value,
        annualTaxes: document.getElementById('annualTaxes').value
    };
// Add this line to log the form data
console.log('Form Data:', formData);
    if (accessToken) {
        // Send data to both sheets
        Promise.all([
            sendDataToGoogleSheets(formData, accessToken),
            sendDataToOfferSheet(formData, accessToken)
        ]).then(() => {
            // Wait for 2 seconds to allow spreadsheet calculations to complete
            setTimeout(() => {
                fetchAndPopulateOfferData(accessToken, formData)
                    .then(data => {
                        offerData = data;
                        showOfferOptionsModal();
                        document.getElementById('viewOffersButton').style.display = 'block';
                    })
                    .catch(error => {
                        console.error('Error fetching offer data:', error);
                        alert('An error occurred while fetching the offer data. Please try again.');
                    });
            }, 2000);
        }).catch(error => {
            console.error('Error during data submission:', error);
            alert('An error occurred while submitting the data. Please try again.');
        });
    } else {
        alert('You need to log in first.');
    }
});

(function () {
    'use strict'
    
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
    
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
    
                form.classList.add('was-validated')
            }, false)
        })
})();
