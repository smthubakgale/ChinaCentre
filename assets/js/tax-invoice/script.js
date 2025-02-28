//------------------------------------------------------------------]]
// Get the product container
const productContainer = document.getElementById('products-container');

// Get the invoice table
const invoiceTable = document.querySelector('.invoice-table');

// Get the product item template
const productItemTemplate = document.querySelector('.product-item');

// Function to link product item inputs to table rows
function linkProductItemToTableRow(productItem, rowIndex) {
    const itemNameInput = productItem.querySelector('#item-name');
    const quantityInput = productItem.querySelector('#quantity');
    const priceInput = productItem.querySelector('#price');

    // Add event listeners to the inputs
    itemNameInput.addEventListener('input', () => {
        const invoiceTableRow = invoiceTable.querySelector(`tr[data-product-index="${rowIndex}"]`);
        if (invoiceTableRow) {
            invoiceTableRow.querySelector('.item-name').textContent = itemNameInput.value;
            calculateTotal(invoiceTableRow, quantityInput, priceInput);
        }
    });

    quantityInput.addEventListener('input', () => {
        const invoiceTableRow = invoiceTable.querySelector(`tr[data-product-index="${rowIndex}"]`);
        if (invoiceTableRow) {
            invoiceTableRow.querySelector('.quantity').textContent = quantityInput.value;
            calculateTotal(invoiceTableRow, quantityInput, priceInput);
        }
    });

    priceInput.addEventListener('input', () => {
        const invoiceTableRow = invoiceTable.querySelector(`tr[data-product-index="${rowIndex}"]`);
        if (invoiceTableRow) {
            invoiceTableRow.querySelector('.price').textContent = priceInput.value;
            calculateTotal(invoiceTableRow, quantityInput, priceInput);
        }
    });
}

function calculateTotal(invoiceTableRow, quantityInput, priceInput) {
    const quantity = parseInt(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const total = quantity * price;
    invoiceTableRow.querySelector('.total').textContent = total.toFixed(2);
}

// Get the first table row
const firstTableRow = invoiceTable.querySelector('tbody tr');

// Add the data-product-index attribute to the first table row
firstTableRow.setAttribute('data-product-index', 0);

// Link the first product item to the first table row
const firstProductItem = productContainer.querySelector('.product-item');
linkProductItemToTableRow(firstProductItem, 0);

// Function to add a new product item
function addProductItem() {
    const newProductItem = productItemTemplate.cloneNode(true);
    linkProductItemToTableRow(newProductItem, productContainer.children.length);

    // Add a new row to the invoice table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td colspan="2"><span class="item-name"></span></td>
        <td><span class="quantity"></span></td>
        <td><span class="price"></span></td>
        <td><span class="total"></span></td>
    `;
    newRow.setAttribute('data-product-index', productContainer.children.length);
    invoiceTable.querySelector('tbody').appendChild(newRow);

    productContainer.appendChild(newProductItem);
}

// Add event listener to the add product button
document.getElementById('add-product-btn').addEventListener('click', addProductItem);
//------------------------------------------------------------------]]
// Get the form elements
const clientNameInput = document.getElementById('client-name');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');
const orderNumberInput = document.getElementById('order-number');
const invoiceDateInput = document.getElementById('invoice-date');
const vatNumberInput = document.getElementById('vat-number');
const contactNumberInput = document.getElementById('contact-number');

// Get the preview elements
const clientNamePreview = document.querySelector('.client-name');
const emailPreview = document.querySelector('.client-email');
const addressPreview = document.querySelector('.client-address');
const orderNumberPreview = document.querySelector('.order-number');
const invoiceDatePreview = document.querySelector('.invoice-date');
const vatNumberPreview = document.querySelector('.vat-number');
const contactNumberPreview = document.querySelector('.contact-number');

// Add event listeners to the form elements
clientNameInput.addEventListener('input', () => {
    clientNamePreview.textContent = clientNameInput.value;
});

emailInput.addEventListener('input', () => {
    emailPreview.textContent = emailInput.value;
});

addressInput.addEventListener('input', () => {
    addressPreview.textContent = addressInput.value;
});

orderNumberInput.addEventListener('input', () => {
    orderNumberPreview.textContent = orderNumberInput.value;
});

invoiceDateInput.addEventListener('input', () => {
    const date = new Date(invoiceDateInput.value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    invoiceDatePreview.textContent = `${day}-${month}-${year}`;
});

vatNumberInput.addEventListener('input', () => {
    vatNumberPreview.textContent = vatNumberInput.value;
});

contactNumberInput.addEventListener('input', () => {
    contactNumberPreview.textContent = contactNumberInput.value;
});

//-------------------------------------------------------------------]]
// Get the add product button
const addProductButton = document.getElementById('add-product-btn');

// Add an event listener to the add product button
addProductButton.addEventListener('click', (event) => {
    event.preventDefault(); 
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
