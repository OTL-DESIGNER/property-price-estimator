async function generatePDF(type) {
    console.log(`Generating ${type} PDF`);
    console.log('Current offerData:', offerData);

    if (!offerData || Object.values(offerData).every(v => v === 'N/A')) {
        console.error('Offer data is not available or invalid');
        alert('Unable to generate PDF. Please try submitting the form again.');
        return;
    }

    try {
        const logoUrl = '/images/OldR3-logo.jpeg';
        const logoDataUrl = await getImageDataUrl(logoUrl);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 10;

        // Set document properties
        doc.setProperties({
            title: `${type} Presentation for ${offerData.clientName}`,
            subject: 'Property Offer',
            author: 'OldR3',
            keywords: 'real estate, offer, property',
            creator: 'OldR3'
        });

        // Add logo
        doc.addImage(logoDataUrl, 'JPEG', margin, 5, 40, 20);

        // Header
        doc.setFillColor(39, 174, 96);
        doc.rect(0, 30, pageWidth, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("OldR3", pageWidth / 2, 38, { align: "center" });
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("123 Real Estate St, City, State 12345 | (123) 456-7890 | www.oldr3.com", pageWidth / 2, 43, { align: "center" });

        // Title and Client Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`${type} Presentation for Seller`, margin, 55);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Client: ${offerData.clientName}`, margin, 62);
        doc.text(`Property Address: ${offerData.propertyAddress}`, margin, 68);
        doc.text(offerData.propertyCityStateZip, margin, 74);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, 80);

        // Offer Price
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        const priceText = type === 'Wholesale' ? 
            `Target Wholesale Price: ${formatCurrency(offerData.wholesaleBuyingOffer)}` :
            `Retail Buy Price: ${formatCurrency(offerData.retailBuyPrice)}`;
        doc.text(priceText, margin, 90);

      // Table
      const startY = 95;
        const headers = [["Other Sale Options", "Retail Sale - After Repairs", "Retail Sale - As Is"]];
        const rows = [
            ["Market Value", formatCurrency(offerData.marketValueAfterRepairs), formatCurrency(offerData.marketValueAsIs)],
            [{ content: "Costs to Achieve Value", colSpan: 3, styles: { fillColor: [39, 174, 96], textColor: 255, fontStyle: 'bold' } }],
            ["Selling Commission and Costs", formatCurrency(offerData.commissionAfterRepairs), formatCurrency(offerData.commissionAsIs)],
            ["Repairs to Achieve Market Value", formatCurrency(offerData.requiredRepairsAfterRepairs), "Not Applicable"],
            ["Opportunity Cost of foregoing cash offer", formatCurrency(offerData.opportunityCostAfterRepairs), formatCurrency(offerData.opportunityCostAsIs)],
            ["Association Fees", formatCurrency(offerData.associationFeesAfterRepairs), formatCurrency(offerData.associationFeesAsIs)],
            ["Taxes", formatCurrency(offerData.taxesAfterRepairs), formatCurrency(offerData.taxesAsIs)],
            ["Total Costs", formatCurrency(offerData.totalCostsAfterRepairs), formatCurrency(offerData.totalCostsAsIs)],
            ["Net to You", formatCurrency(offerData.netAfterRepairs), formatCurrency(offerData.netAsIs)]
        ];

        doc.autoTable({
            startY: startY,
            head: headers,
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [39, 174, 96], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 55 },
                2: { cellWidth: 55 }
            },
            styles: { 
                cellPadding: 2,
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
            },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: margin, right: margin },
            didParseCell: function(data) {
                if (data.section === 'head' || (data.row.raw[0] && data.row.raw[0].styles)) {
                    data.cell.styles.fillColor = [39, 174, 96];
                    data.cell.styles.textColor = 255;
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page 1 of 1`, pageWidth / 2, pageHeight - 10, { align: "center" });
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 5, { align: "center" });

        // Save the PDF
        doc.save(`${type}_Presentation_${offerData.clientName.replace(/\s+/g, '_')}.pdf`);
        console.log(`${type} PDF generated successfully`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('An error occurred while generating the PDF. Please try again.');
    }
}
// Function to convert image to data URL
async function getImageDataUrl(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
        };
        img.onerror = reject;
        img.src = url;
    });
}


// Generate agent offer PDF

async function generateBuyingAgentPDF() {
    console.log("Generating Buying Agent PDF");
    console.log("Current offerData:", offerData);

    if (!offerData) {
        console.error('Offer data is not available');
        alert('Unable to generate PDF. Please try submitting the form again.');
        return;
    }

    const logoUrl = '/images/OldR3-logo.jpeg';
    const logoDataUrl = await getImageDataUrl(logoUrl);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Add logo
    doc.addImage(logoDataUrl, 'JPEG', margin, 10, 40, 20);

    // Add header
    doc.setFillColor(39, 174, 96);
    doc.rect(0, 35, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("OldR3", pageWidth / 2, 43, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("123 Real Estate St, City, State 12345 | (123) 456-7890 | www.oldr3.com", pageWidth / 2, 48, { align: "center" });

    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Offer Presentation for Buying Agent", margin, 60);

    // Offer details table
    const startY = 70;
    const headers = [["Item", "Value"]];
    const rows = [
        ["Client", offerData.clientName],
        ["Property Address", offerData.propertyAddress],
        ["ARV", formatCurrency(offerData.arv)],
        ["Holding Period (months)", offerData.holdingPeriod],
        ["Monthly Association Fees", formatCurrency(offerData.monthlyAssociationFees)],
        ["Annual Taxes", formatCurrency(offerData.annualTaxes)],
        ["Retail Buying Offer", formatCurrency(offerData.retailBuyingOffer)],
        ["Percentage of ARV", offerData.percentageArv],
        ["Wholesale Buying Offer", formatCurrency(offerData.wholesaleBuyingOffer)]
    ];

    doc.autoTable({
        startY: startY,
        head: headers,
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: [39, 174, 96], textColor: 255, fontStyle: 'bold' },
        styles: { cellPadding: 5, fontSize: 10 },
        columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 80 } },
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page 1 of 1`, pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 5, { align: "center" });

    // Save the PDF
    doc.save(`Buying_Agent_Presentation_${offerData.clientName.replace(/\s+/g, '_')}.pdf`);
}


// Generate Offer Letter
async function generateOfferLetterPDF(type, returnBlob = false) {
    console.log(`Generating ${type} Offer Letter PDF`);
    if (!offerData) {
        console.error('Offer data is not available');
        alert('Unable to generate PDF. Please try submitting the form again.');
        return;
    }

    const logoUrl = '/images/OldR3-logo.jpeg';
    const logoDataUrl = await getImageDataUrl(logoUrl);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Add logo
    doc.addImage(logoDataUrl, 'JPEG', margin, 10, 40, 20);

    // Add header
    doc.setFillColor(39, 174, 96);
    doc.rect(0, 35, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("OldR3", pageWidth / 2, 43, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("123 Real Estate St, City, State 12345 | (123) 456-7890 | www.oldr3.com", pageWidth / 2, 48, { align: "center" });

    // Reset text color for main content
    doc.setTextColor(0, 0, 0);

    // Set font styles
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Add recipient address
    let addressYPos = 65;
    const addressLineHeight = 10;

    doc.text(`${offerData.clientName}`, margin, addressYPos);
    addressYPos += addressLineHeight;

    // Combine the address into a single string
    const fullAddress = `${offerData.propertyAddress}, ${offerData.propertyCityStateZip}`;
    const addressLines = doc.splitTextToSize(fullAddress, pageWidth - 2 * margin);

    // Add each line of the address
    addressLines.forEach(line => {
        doc.text(line, margin, addressYPos);
        addressYPos += addressLineHeight;
    });

    // Adjust the starting position of the letter content
    let yPos = addressYPos + 20;

    // Add letter content
    doc.text(`Dear ${offerData.clientName.split(' ')[0]},`, margin, yPos);

    doc.setFontSize(10);
    yPos += 10;
    const lineHeight = 7;

    const paragraphs = [
        "Thank you for your consideration of our offer to purchase your property. Home Ventures has been helping homeowners with their real estate needs for over 20 years. We are happy to provide you with the following offer for your property:",
        `Cash purchase price: ${type === 'Wholesale' ? formatCurrency(offerData.wholesaleBuyingOffer) : formatCurrency(offerData.retailBuyPrice)}`,
        `Cash offer date: ${new Date().toLocaleDateString()}`,
        `When you buy from us you pay no real estate commissions or closing costs. That could represent a savings of ${formatCurrency(offerData.commissionAsIs)}. We can close in as quickly as 10 days or at a date of your choosing. Our offer is good for 7 days from the date of this written offer.`,
        "We look forward to hearing back from your promptly.",
        "Thank you,",
        `${offerData.agentFirstName} ${offerData.agentLastName}`,
        `${offerData.agentPhoneNumber}`
    ];

    paragraphs.forEach((paragraph, index) => {
        const lines = doc.splitTextToSize(paragraph, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * lineHeight + (index === 1 || index === 2 || index === 5 ? lineHeight : 0);
    });

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page 1 of 1`, pageWidth / 2, pageHeight - 15, { align: "center" });
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: "center" });

    if (returnBlob) {
        return doc.output('blob');
    } else {
        doc.save(`${type}_Offer_Letter_${offerData.clientName.replace(/\s+/g, '_')}.pdf`);
    }
}

// generate offer letter PDF blob
async function generateOfferLetterPDFBlob(type) {
    console.log(`Generating ${type} Offer Letter PDF Blob`);
    if (!offerData) {
        console.error('Offer data is not available');
        throw new Error('Unable to generate PDF. Offer data is not available.');
    }

    const logoUrl = '/images/OldR3-logo.jpeg';
    const logoDataUrl = await getImageDataUrl(logoUrl);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Add logo
    doc.addImage(logoDataUrl, 'JPEG', margin, 10, 40, 20);

    // Add header
    doc.setFillColor(39, 174, 96);
    doc.rect(0, 35, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("OldR3", pageWidth / 2, 43, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("123 Real Estate St, City, State 12345 | (123) 456-7890 | www.oldr3.com", pageWidth / 2, 48, { align: "center" });

    // Reset text color for main content
    doc.setTextColor(0, 0, 0);

    // Set font styles
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Add recipient address
    let addressYPos = 65;
    const addressLineHeight = 10;

    doc.text(`${offerData.clientName}`, margin, addressYPos);
    addressYPos += addressLineHeight;

    // Combine the address into a single string
    const fullAddress = `${offerData.propertyAddress}, ${offerData.propertyCityStateZip}`;
    const addressLines = doc.splitTextToSize(fullAddress, pageWidth - 2 * margin);

    // Add each line of the address
    addressLines.forEach(line => {
        doc.text(line, margin, addressYPos);
        addressYPos += addressLineHeight;
    });

    // Adjust the starting position of the letter content
    let yPos = addressYPos + 20;

    // Add letter content
    doc.text(`Dear ${offerData.clientName.split(' ')[0]},`, margin, yPos);

    doc.setFontSize(10);
    yPos += 10;
    const lineHeight = 7;

    const paragraphs = [
        "Thank you for your consideration of our offer to purchase your property. Home Ventures has been helping homeowners with their real estate needs for over 20 years. We are happy to provide you with the following offer for your property:",
        `Cash purchase price: ${type === 'Wholesale' ? formatCurrency(offerData.wholesaleBuyingOffer) : formatCurrency(offerData.retailBuyPrice)}`,
        `Cash offer date: ${new Date().toLocaleDateString()}`,
        `When you buy from us you pay no real estate commissions or closing costs. That could represent a savings of ${formatCurrency(offerData.commissionAsIs)}. We can close in as quickly as 10 days or at a date of your choosing. Our offer is good for 7 days from the date of this written offer.`,
        "We look forward to hearing back from your promptly.",
        "Thank you,",
        `${offerData.agentFirstName} ${offerData.agentLastName}`,
        `${offerData.agentPhoneNumber}`
    ];

    paragraphs.forEach((paragraph, index) => {
        const lines = doc.splitTextToSize(paragraph, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += lines.length * lineHeight + (index === 1 || index === 2 || index === 5 ? lineHeight : 0);
    });

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page 1 of 1`, pageWidth / 2, pageHeight - 15, { align: "center" });
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: "center" });

    // Return the PDF as a blob
    return doc.output('blob');
}

// Modify the sendOfferLetterEmail function to call the sendEmail function
async function sendOfferLetterEmail(type) {
    try {
        if (!offerData || !offerData.ownerEmail) {
            throw new Error('Owner email is missing. Cannot send email.');
        }

        // Generate the PDF Blob and convert it to base64
        const pdfBlob = await generateOfferLetterPDFBlob(type);
        const pdfBase64 = await blobToBase64(pdfBlob);

        // Prepare the email data object
        const emailData = {
            email: offerData.ownerEmail, // Recipient email (from offerData)
            subject: `${type} Offer Letter for ${offerData.propertyAddress}`, // Email subject
            message: `Please find attached the ${type} offer letter for ${offerData.propertyAddress}.`, // Email body
            attachment: {
                content: pdfBase64, // Base64 encoded PDF
                filename: `${type}_Offer_Letter_${offerData.clientName.replace(/\s+/g, '_')}.pdf`,
                type: 'application/pdf',
                disposition: 'attachment'
            }
        };

        // Send the email by making a POST request to the sendEmail function
        const response = await fetch('/.netlify/functions/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Email sent successfully:', result);
            alert('Email sent successfully!');
        } else {
            throw new Error(result.message || 'Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        alert('An error occurred while sending the email. Please try again.');
    }
}
// Helper function to convert Blob to Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


// Generate the PDF for Seller Presentation
function setupPDFDownloadListeners() {
    // Remove existing event listeners
    document.getElementById('downloadWholesalePDF').removeEventListener('click', generateWholesalePDF);
    document.getElementById('downloadRetailPDF').removeEventListener('click', generateRetailPDF);
    document.getElementById('downloadWholesaleOfferLetter').removeEventListener('click', generateWholesaleOfferLetter);
    document.getElementById('downloadRetailOfferLetter').removeEventListener('click', generateRetailOfferLetter);
    document.getElementById('downloadAgentOffer').removeEventListener('click', generateBuyingAgentPDF);
    document.getElementById('emailWholesaleOfferLetter').removeEventListener('click', sendWholesaleOfferLetterEmail);
    document.getElementById('emailRetailOfferLetter').removeEventListener('click', sendRetailOfferLetterEmail);

    // Add new event listeners
    document.getElementById('downloadWholesalePDF').addEventListener('click', generateWholesalePDF);
    document.getElementById('downloadRetailPDF').addEventListener('click', generateRetailPDF);
    document.getElementById('downloadWholesaleOfferLetter').addEventListener('click', generateWholesaleOfferLetter);
    document.getElementById('downloadRetailOfferLetter').addEventListener('click', generateRetailOfferLetter);
    document.getElementById('downloadAgentOffer').addEventListener('click', generateBuyingAgentPDF);
    document.getElementById('emailWholesaleOfferLetter').addEventListener('click', sendWholesaleOfferLetterEmail);
    document.getElementById('emailRetailOfferLetter').addEventListener('click', sendRetailOfferLetterEmail);
}

// Define separate functions for each PDF generation
function generateWholesalePDF() {
    if (offerData) {
        generatePDF('Wholesale');
    } else {
        alert('Offer data is not available. Please try submitting the form again.');
    }
}

function generateRetailPDF() {
    if (offerData) {
        generatePDF('Retail');
    } else {
        alert('Offer data is not available. Please try submitting the form again.');
    }
}

function generateWholesaleOfferLetter() {
    if (offerData) {
        generateOfferLetterPDF('Wholesale');
    } else {
        alert('Offer data is not available. Please try submitting the form again.');
    }
}

function generateRetailOfferLetter() {
    if (offerData) {
        generateOfferLetterPDF('Retail');
    } else {
        alert('Offer data is not available. Please try submitting the form again.');
    }
}

function sendWholesaleOfferLetterEmail() {
    if (offerData) {
        sendOfferLetterEmail('Wholesale');
    } else {
        alert('Offer data is not available. Please try submitting the form again.');
    }
}

function sendRetailOfferLetterEmail() {
    if (offerData) {
        sendOfferLetterEmail('Retail');
    } else {
        alert('Offer data is not available. Please try submitting the form again.');
    }
}