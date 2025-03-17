//------------------------------------------------------------------]]
// For quantity input (whole numbers)
document.querySelector('#quantity').addEventListener('input', () => {
    const quantity = document.querySelector('#quantity');
    quantity.value = quantity.value.replace(/[^0-9]/g, '');
});

// For price input (up to 2 decimal places)
document.querySelector('#price').addEventListener('input', () => {
    const price = document.querySelector('#price');
    let value = price.value.replace(/[^0-9.]/g, '');
    if (value.includes('.')) {
        const parts = value.split('.');
        if (parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].substring(0, 2);
        }
    }
    price.value = value;
});
// For delivery input (up to 2 decimal places)
document.querySelector('#delivery-fee').addEventListener('input', () => {
    const price = document.querySelector('#delivery-fee');
    let value = price.value.replace(/[^0-9.]/g, '');
    if (value.includes('.')) {
        const parts = value.split('.');
        if (parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].substring(0, 2);
        }
    }
    price.value = value;
});
//------------------------------------------------------------------]]
// Get the product container
const productContainer = document.getElementById('products-container');

// Get the invoice table
const invoiceTable = document.querySelector('.invoice-table');
const invoiceTotalTable = document.querySelector('.invoice-total-table');

// Get the product item template
const productItemTemplate = document.querySelector('.product-item');

//
function calculateSubtotal() {
    let subtotal = 0;

    const discountCells = invoiceTable.querySelectorAll('.discd');
    
    var different = 0;
    
    discountCells.forEach((cell) => {
        different += parseFloat(cell.textContent.replace("%","").trim());
    });
    
    const totalCells = invoiceTable.querySelectorAll('.total');
    totalCells.forEach((cell , index) => {
        /*
        subtotal += (isNaN(difference) || different == 0) ? parseFloat(cell.textContent) : 
            (parseFloat(cell.textContent)*(1 - (parseFloat(discountCells[index].textContent.replace("%","").trim())/100)));
        */
        subtotal += parseFloat(cell.textContent);
    });

    const vipMembershipSelect = document.querySelector('#is-vip-member');
    const discount = vipMembershipSelect.value === 'yes' ? subtotal * 0.1 : 
        ( vipMembershipSelect.value === 'chinese' ? subtotal * 0.2 : 0
    );

    console.log(different);

    try{
    const vipv = invoiceTotalTable.querySelector('.vipv');
    const disch = invoiceTable.querySelector('.disch');
    const discd = invoiceTable.querySelector('.discd');
    const disct = invoiceTotalTable.querySelector('.disct');

	    console.log(vipv , disch , discd , disct); 
    if (!isNaN(difference)) {
    if(different == 0) {
        //vipv.style.visibility = 'hidden';
        //disch.style.display = 'block';
        //discd.style.display = 'block';
        //disct.style.display = 'block';
    }
    else{
        //vipv.style.visibility = 'visible';
        //disch.style.display = 'none';
        //discd.style.display = 'none';
        //disct.style.display = 'none';
    }
    }
    
    }
    catch(err){
        console.error(err);
    }

    const tax = subtotal * 0.15;
    
    const deliveryFee = parseFloat(document.querySelector('#delivery-fee').value) || 0;
    let total = 0;

    if(different == 0) {
       total = subtotal + deliveryFee;
    }
    else {
      total = subtotal + deliveryFee - discount;
    }

    document.querySelector('.subtotal').textContent = subtotal.toFixed(2);
    document.querySelector('.discount').textContent = discount.toFixed(2);
    document.querySelector('.tax').textContent = tax.toFixed(2);
    document.querySelector('.ftotal').textContent = total.toFixed(2);
}
// Function to link product item inputs to table rows
function linkProductItemToTableRow(productItem, rowIndex) {
    const itemNameInput = productItem.querySelector('#item-name');
    const quantityInput = productItem.querySelector('#quantity');
    const priceInput = productItem.querySelector('#price');
    const vipInput = productItem.querySelector('#is-vip-member2');
    const customInput = productItem.querySelector('#custom-discount2');

    // Add event listeners to the inputs
    itemNameInput.addEventListener('input', () => {
        const invoiceTableRow = invoiceTable.querySelector(`tr[data-product-index="${rowIndex}"]`);
        if (invoiceTableRow) {
            invoiceTableRow.querySelector('.item-name').textContent = itemNameInput.value;
            calculateTotal(invoiceTableRow, quantityInput, priceInput , vipInput , customInput);
        }
    });

    quantityInput.addEventListener('input', () => {
        const invoiceTableRow = invoiceTable.querySelector(`tr[data-product-index="${rowIndex}"]`);
        if (invoiceTableRow) {
            invoiceTableRow.querySelector('.quantity').textContent = quantityInput.value;
            calculateTotal(invoiceTableRow, quantityInput, priceInput , vipInput , customInput);
        }
    });

    priceInput.addEventListener('input', () => {
        const invoiceTableRow = invoiceTable.querySelector(`tr[data-product-index="${rowIndex}"]`);
        if (invoiceTableRow) {
            invoiceTableRow.querySelector('.price').textContent = priceInput.value;
            calculateTotal(invoiceTableRow, quantityInput, priceInput , vipInput , customInput);
        }
    });

    vipInput.addEventListener('input', () => { disc(); });
    customInput.addEventListener('input', () => { disc(); });

    function disc(){
        var v = vipInput.value;
        var c = customInput.value;
  
        console.log(vipInput ,customInput);
        console.log(v,c);
 
        const invoiceTableRow = invoiceTable.querySelector(`tr[data-product-index="${rowIndex}"]`);
        if (invoiceTableRow){
            if(v == "custom"){
               invoiceTableRow.querySelector('.discd').textContent = c ?  `${c}%`: '0'; 
               calculateTotal(invoiceTableRow, quantityInput, priceInput , vipInput , customInput);
            }
            else if(v == "yes"){
               invoiceTableRow.querySelector('.discd').textContent = '10%';
               calculateTotal(invoiceTableRow, quantityInput, priceInput , vipInput , customInput);
            }
            else if(v == "chinese"){
               invoiceTableRow.querySelector('.discd').textContent = '20%';
                calculateTotal(invoiceTableRow, quantityInput, priceInput , vipInput , customInput);
            }
        }
            
    }
}

function calculateTotal(invoiceTableRow, quantityInput, priceInput,vipInput ,customInput) {
    const quantity = parseInt(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    let discount = 0;

    var v = vipInput.value;
    var c = customInput.value;

    console.log(vipInput ,customInput);
    console.log(v,c);

   if(v == "custom"){
       discount = c ?  (c/100) : 0;  
    }
    else if(v == "yes"){
       discount = 0.1; 
    }
    else if(v == "chinese"){
       discount = 0.2; 
    }
    
    const total = quantity * (price*(1 - discount));

    console.log(total);
    
    invoiceTableRow.querySelector('.total').textContent = total.toFixed(2);
    calculateSubtotal();
}

document.querySelector('#is-vip-member').addEventListener('change', () => {
    calculateSubtotal();
});

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
    // Reset the form fields
    const formFields = newProductItem.querySelectorAll('input, select, textarea');
    formFields.forEach((field) => {
        field.value = ''; 
    });
    
    linkProductItemToTableRow(newProductItem, productContainer.children.length);

    // Add a new row to the invoice table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td colspan="2"><span class="item-name"></span></td>
        <td><span class="quantity"></span></td>
		<td class="discd"><span class="disc"></span></td>
        <td><span class="price"></span></td>
        <td>R <span class="total"></span></td>
    `;
    newRow.setAttribute('data-product-index', productContainer.children.length);
    invoiceTable.querySelector('tbody').appendChild(newRow);
  
    // Add a remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-button');
    newProductItem.appendChild(removeButton);

    // Add an event listener to the remove button
    removeButton.addEventListener('click', () => {
        newProductItem.remove();
    });
    //
    productContainer.appendChild(newProductItem);
}

// Get the add product button
const addProductButton = document.getElementById('add-product-btn');

// Add an event listener to the add product button
addProductButton.addEventListener('click', (event) => 
{
    event.preventDefault(); 
    addProductItem();
}); 
// Delivery Fee 
document.querySelector('#delivery-fee').addEventListener('input', () => {
    const deliveryFee = parseFloat(document.querySelector('#delivery-fee').value) || 0;
    document.querySelectorAll('.delivery-fee').forEach((field) => {
        field.textContent = deliveryFee.toFixed(2);
    });
    calculateSubtotal();
});
//------------------------------------------------------------------]]
// Get the form elements
const clientNameInput = document.getElementById('client-name');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');
const orderNumberInput = document.getElementById('order-number');
const invoiceDateInput = document.getElementById('invoice-date');
const vatNumberInput = document.getElementById('vat-number');
const taxNumberInput = document.getElementById('tax-number');
const contactNumberInput = document.getElementById('contact-number');

// Get the preview elements
const clientNamePreview = document.querySelector('.client-name');
const emailPreview = document.querySelector('.client-email');
const addressPreview = document.querySelector('.client-address');
const orderNumberPreview = document.querySelector('.order-number');
const invoiceDatePreview = document.querySelector('.invoice-date');
const vatNumberPreview = document.querySelector('.vat-number');
const taxNumberPreview = document.querySelector('.tax-number');
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

taxNumberInput.addEventListener('input', () => {
    taxNumberPreview.textContent = taxNumberInput.value;
});

contactNumberInput.addEventListener('input', () => {
    contactNumberPreview.textContent = contactNumberInput.value;
});
 
// Get the download invoice button
const downloadInvoiceButton = document.getElementById('print-button');

// Add an event listener to the download invoice button

function getHtml(){
    
    const productItems = document.querySelectorAll('.product-item');
    let allFilled = true;

    productItems.forEach((productItem) => {
        const inputFields = productItem.querySelectorAll('input, select');
        inputFields.forEach((field) => {
            if (!field.value) {
                allFilled = false;
                field.classList.add('error');
                const errorMessage = document.createElement('div');
                errorMessage.textContent = 'This field is required';
                errorMessage.classList.add('error-message');
                field.parentNode.appendChild(errorMessage);
            } else {
                field.classList.remove('error');
                const errorMessage = field.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    });

    if (!allFilled) 
    {
        document.getElementById("defaultOpen").click();
        const errorMessage = document.querySelector('.error-message');
        errorMessage.scrollIntoView();
        
        return;
    }
    
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
    const borderFreeStyleTagCss = styleTagCss + `.preview-tab { padding: 60px 40px; border:none; } img { width: 140px; height:140px; }`;
    const borderFreeInlineCss = inlineCss;

    return {
        "html" : borderFreeHtmlContent ,
        "css" : borderFreeStyleTagCss ,
        "css2" : borderFreeInlineCss
    };
}

downloadInvoiceButton.addEventListener('click', () => 
{ 
    var file = getHtml();

    const printWindow = window.open('', 'print');
    printWindow.document.write(file.html);
    printWindow.document.write(`<style>${file.css}${file.css2}</style>`);

    setTimeout(function()
     {
        printWindow.print();
        printWindow.close();
         
     } , 100);
     
});
document.getElementById('print-button2').addEventListener('click' , ()=>
{ 
    var file = getHtml();

    
    // Create a new blob with the HTML content, CSS styles, and inline CSS styles
    const blob = new Blob([`
        <style>
            ${ file.css }
            ${ file.css2 }
        </style>
        ${ file.html}
    `], { type: 'text/html' });

    // Create a new link element
    const link = document.createElement('a');

    // Set the link's href attribute to the blob
    link.href = URL.createObjectURL(blob);

    // Set the link's download attribute to the file name
    link.download = 'tax-invoice.html';

    // Simulate a click on the link
    link.click();
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
