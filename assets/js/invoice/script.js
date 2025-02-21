// Get the download invoice button
const downloadInvoiceButton = document.getElementById('download-invoice-button');

// Add an event listener to the download invoice button
downloadInvoiceButton.addEventListener('click', () => {
    // Get the HTML content of the invoice page
    const htmlContent = document.querySelector('.invoice-page').outerHTML;

    // Remove the buttons from the HTML content
    const htmlContentWithoutButtons = htmlContent.replace('<div class="actions">', '').replace('</div>', '');

    // Get the CSS styles from style tags
    const styleTags = Array.from(document.querySelectorAll('style'));
    const styleTagCss = styleTags.map(tag => tag.innerHTML).join('');

    // Get the inline CSS styles
    const inlineCss = Array.from(document.querySelectorAll('[style]')).map(element => {
        const selector = element.tagName.toLowerCase();
        return `${selector} { ${element.getAttribute('style')} }`;
    }).join('');

    // Create a new blob with the HTML content, CSS styles, and inline CSS styles
    const blob = new Blob([`
        <style>
            ${styleTagCss}
            ${inlineCss}
        </style>
        ${htmlContentWithoutButtons}
    `], { type: 'text/html' });

    // Create a new link element
    const link = document.createElement('a');

    // Set the link's href attribute to the blob
    link.href = URL.createObjectURL(blob);

    // Set the link's download attribute to the file name
    link.download = 'invoice.html';

    // Simulate a click on the link
    link.click();
});
