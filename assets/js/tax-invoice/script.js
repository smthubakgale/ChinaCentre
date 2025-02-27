// Get the download invoice button
const downloadInvoiceButton = document.getElementById('print-button');

// Add an event listener to the download invoice button
downloadInvoiceButton.addEventListener('click', async () => {
    // Get the HTML content of the invoice page
    const element = document.querySelector('.preview-tab');
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
    const inlineCss = Array.from(document.querySelectorAll('[style]')).map(element => {
        const selector = element.tagName.toLowerCase();
        return `${selector} { ${element.getAttribute('style')} }`;
    }).join('');

    // Remove border CSS values for .preview-tab
    const borderFreeHtmlContent = htmlContent.replace(/border[^;]*;/g, '');
    const borderFreeStyleTagCss = styleTagCss.replace(/\.preview-tab\s*{[^}]*border[^;]*;[^}]*}/g, '.preview-tab {');
    const borderFreeInlineCss = inlineCss;

    // Convert images to base64 strings
    const images = clonedElement.querySelectorAll('img');
    for (const image of images) {
        const src = image.src;
        console.log(src);
        
        if (!src.startsWith('data:')) {
            const response = await fetch(src);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onload = () => {
                image.src = reader.result;
            };
            reader.readAsDataURL(blob);
        }
    }

    // Create a PDF document
    const printWindow = window.open('', 'print');
    printWindow.document.write(borderFreeHtmlContent);
    printWindow.document.write(`<style>${borderFreeStyleTagCss}${borderFreeInlineCss}</style>`);
    
    // Wait for the images to load
    const images2 = printWindow.document.querySelectorAll('img');
    let loadedImages = 0;
    images2.forEach((image) => {
        image.onload = () => {
            loadedImages++;
            if (loadedImages === images.length) {
                printWindow.print();
                printWindow.close();
            }
        };
    });
    //
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
