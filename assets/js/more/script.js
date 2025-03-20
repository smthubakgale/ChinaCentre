
const url = d_config.url + `database/tables?session=${encodeURIComponent(session)}`;
console.log(url);
    
fetch(url)
.then((response) => response.json())
.then((data) => {
    console.logdata.success && data.tables.length > 0 , (data);

    if (data.success && data.tables.length > 0) {
      const databaseList = document.querySelector('#database-list');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'database';
    
      const label = document.createElement('label');
      label.htmlFor = 'database';
      label.innerHTML = 'Database <i class="chevron-icon fas fa-chevron-down"></i>';
    
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

});
//:
