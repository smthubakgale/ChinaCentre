// Get the add product button
const addProductButton = document.getElementById('add-product-btn');

// Get the product item template
const productItemTemplate = document.querySelector('.product-item');

// Get the product container
const productContainer = document.querySelector('.product-container');

// Add an event listener to the add product button
addProductButton.addEventListener('click', () => {
    // Clone the product item template
    const newProductItem = productItemTemplate.cloneNode(true);

    // Reset the form fields
    const formFields = newProductItem.querySelectorAll('input, select, textarea');
    formFields.forEach((field) => {
        field.value = '';
    });

    // Add a remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-button');
    newProductItem.appendChild(removeButton);

    // Add an event listener to the remove button
    removeButton.addEventListener('click', () => {
        newProductItem.remove();
    });

    // Append the new product item to the product container
    productContainer.appendChild(newProductItem);
});

// Get the download invoice button
const downloadInvoiceButton = document.getElementById('print-button');

// Add an event listener to the download invoice button
downloadInvoiceButton.addEventListener('click', () => {
    // Get the HTML content of the invoice page
    const element = document.querySelector('#preview-tab2');
    const clonedElement = element.cloneNode(true);
    const actionsElements = clonedElement.querySelectorAll('.actions');

    actionsElements.forEach((action)=>
    {
        action.remove();
    });
    
    const htmlContent = clonedElement.outerHTML;
    // Get the CSS styles from style tags
    const styleTags = Array.from(document.querySelectorAll('style')); 
    const styleTagCss = styleTags.map(tag => tag.innerHTML).join(''); 

    // Get the inline CSS styles
    const inlineCss = ""; 

    // Remove border CSS values for .preview-tab
    const borderFreeHtmlContent = htmlContent.replace(/border[^;]*;/g, '');
    const borderFreeStyleTagCss = styleTagCss + `.preview-tab { padding: 60px 40px; border:none; }`;
    const borderFreeInlineCss = inlineCss;

    // Create a new blob with the HTML content, CSS styles, and inline CSS styles
    const blob = new Blob([`
        <style>
            ${borderFreeStyleTagCss}
            ${borderFreeInlineCss}
        </style>
        ${borderFreeHtmlContent}
    `], { type: 'text/html' });

    // Create a new link element
    const link = document.createElement('a');

    // Set the link's href attribute to the blob
    link.href = URL.createObjectURL(blob);

    // Set the link's download attribute to the file name
    link.download = 'tax-invoice.html';

    // Simulate a click on the link
    //link.click();

    // Check if the download was successful
    if (!link.href.startsWith('blob:') || true) {
        // If not, print the invoice instead
        const printWindow = window.open('', 'print');
        printWindow.document.write(borderFreeHtmlContent);
        printWindow.document.write(`<style>${borderFreeStyleTagCss}${borderFreeInlineCss}</style>`);
        printWindow.print();
        printWindow.close();
    }
});
// Tabs 
function openTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

// 
