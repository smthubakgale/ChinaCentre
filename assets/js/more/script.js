
const url = d_config.url + `database/tables?session=${encodeURIComponent(session)}`;
console.log(url);
    
fetch(url)
.then((response) => response.json())
.then((data) => {
    console.log(data);

    if (data.success && data.tables.length > 0) {
      const databaseList = document.querySelector('#database-list');
      const paragraph = databaseList.querySelector('p');
      const unorderedList = databaseList.querySelector('ul');
    
      paragraph.textContent = "Databases";
    
      data.tables.forEach((table) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#database";
        link.dataset.queries = `table=${table}`; // Use dataset for custom attributes
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
