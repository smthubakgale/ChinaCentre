//: 
const url = d_config.url + `database/tables?session=${encodeURIComponent(session)}`;
console.log(url);
    
fetch(url)
.then((response) => response.json())
.then((data) => {
    console.log(data.success && data.tables.length > 0 , data);

    if (data.success && data.tables.length > 0) {
      const databaseList = document.querySelector('#database-list');
      databaseList.addEventListener('click', toggleCheckbox)
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
        link.setAttribute('queries', `table=${table}`);
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
    const label = event.target.parentNode.querySelector('label');
    const chevronIcon = label.querySelector('.chevron-icon');

    if (checkbox.checked) {
      chevronIcon.classList.remove('fa-chevron-down');
      chevronIcon.classList.add('fa-chevron-up');
    } else {
      chevronIcon.classList.remove('fa-chevron-up');
      chevronIcon.classList.add('fa-chevron-down');
    }
  }
}

menuListItems.forEach(link => link.addEventListener('click', toggleCheckbox));
observeLinkTags('menu-list li', 'click', toggleCheckbox);



