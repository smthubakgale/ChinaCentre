
const url = d_config.url + `database/tables?session=${encodeURIComponent(session)}`;
console.log(url);
    
fetch(url)
.then((response) => response.json())
.then((data) => {
    console.log(data.success && data.tables.length > 0 , data);

    if (data.success && data.tables.length > 0) {
      const databaseList = document.querySelector('#database-list');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'database';
    
      const label = document.createElement('label');
      label.htmlFor = 'database';
      label.innerHTML = 'Database <i class="chevron-icon fas fa-chevron-down" style="float:right"></i>';
    
      databaseList.insertBefore(checkbox, databaseList.firstChild);
      databaseList.insertBefore(label, databaseList.firstChild.nextSibling);
    
      const unorderedList = databaseList.querySelector('ul');
    
      data.tables.forEach((table) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#database";
        link.dataset.queries = `table=${table}`; 
        link.classList.add("nav-link");
        link.innerHTML = `${table} <i class="fas fa-chevron-right"></i>`;
        listItem.appendChild(link);
        unorderedList.appendChild(listItem);
      });
    }
})
.catch((error) => {
  console.error(error);
});
//:

let menuListItems = document.querySelectorAll('.menu-list li');

function toggleCheckbox(event) {
  if (event.target.tagName === 'A') {
    // Existing handleNavLinkClick code here
  } else {
    const checkbox = event.target.parentNode.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  }
}

menuListItems.forEach(link => link.addEventListener('click', toggleCheckbox));
observeLinkTags('menu-list li', 'click', toggleCheckbox);



