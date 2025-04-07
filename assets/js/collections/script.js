// Read Departments
let query =  `SELECT TOP 6 *
FROM Departments
ORDER BY NEWID();`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     console.log(data);
    if(data.success && data.results)
    {
         data.results.recordset.forEach((item)=>
         {
              console.log(item);
              
             let department = new DOMParser().parseFromString(
              `<div class="department nav-link" href="#departments" queries="${'department=' + item.idx}" >
                 <img src="" alt="">
                 <div></div>
               </div> `, 
              "text/html").body.firstChild;
              
             const dv = department.querySelector("div");
             const img = department.querySelector("img");
              
             dv.innerHTML = item.department_name;
              
              fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Departments&tableIdx=${item.idx}`)
             .then(response => response.json())
             .then((data) => 
              {   
                var proc = true; 
                if(data.recordset)
                {
                  console.log(data.recordset);
                  data.recordset.forEach((item)=>
                  {  
                         if(item.file_name && item.file_size && item.gallery == "NO" && proc)
                         {
                            proc = false ;
                            
                            img.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Departments&idx=${encodeURI(item.idx)}`;
                         }				   
                    });
                }
                  
                if(proc){
                  const icon = document.createElement("i");
                    icon.className = "fas fa-image";
                    icon.title = "No image available";
                    img.insertAdjacentElement("afterend", icon);
                    img.style.display = "none";
           
                }
             })
             .catch(error => console.error('Error:', error));
              
             img.alt = item.department_name;

             document.querySelector('.departments-grid.final').appendChild(department);
         });
    }
})
.catch((error) => {
    console.error(error);
});
// Article Section

const readMoreButton = document.querySelector('.read-more');
const articleContent = document.querySelector('.article-content');
const readLessButton = document.querySelector('.read-less');

readMoreButton.addEventListener('click', () => {
    articleContent.style.display = 'block';
    readMoreButton.style.display = 'none';
    readLessButton.style.display = 'block';
});

readLessButton.addEventListener('click', () => {
    articleContent.style.display = 'none';
    readMoreButton.style.display = 'block';
    readLessButton.style.display = 'none';
});

// Departments Section

const departmentButtons = document.querySelectorAll('.department-button');

departmentButtons.forEach(button => {
    button.addEventListener('click', () => {
        const departmentName = button.textContent;
        console.log(`Department: ${departmentName}`);
    });
});

// Popular Picks Section

const popularPickButtons = document.querySelectorAll('.popular-pick button');

popularPickButtons.forEach(button => {
    button.addEventListener('click', () => {
        const popularPickName = button.textContent;
        console.log(`Popular Pick: ${popularPickName}`);
    });
});

// Related Categories Section

const relatedCategoryButtons = document.querySelectorAll('.related-category-button');

relatedCategoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const relatedCategoryName = button.textContent;
        console.log(`Related Category: ${relatedCategoryName}`);
    });
});

// Related Searches Section

const relatedSearchButtons = document.querySelectorAll('.related-search-button');

relatedSearchButtons.forEach(button => {
    button.addEventListener('click', () => {
        const relatedSearchName = button.textContent;
        console.log(`Related Search: ${relatedSearchName}`);
    });
});

// Discounts Section

const discountButtons = document.querySelectorAll('.discount button');

discountButtons.forEach(button => {
    button.addEventListener('click', () => {
        const discountName = button.textContent;
        console.log(`Discount: ${discountName}`);
    });
});

// Tips and Guides Section

const tipButtons = document.querySelectorAll('.tip button');

tipButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tipName = button.textContent;
        console.log(`Tip: ${tipName}`);
    });
});

// Department Filtering

const departmentFilters = document.querySelectorAll('.department-filter');

departmentFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        const departmentName = filter.textContent;
        console.log(`Department Filter: ${departmentName}`);
    });
});

// Search Functionality

const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    console.log(`Search Term: ${searchTerm}`);
});

// Mobile Navigation

const mobileNavButton = document.querySelector('.mobile-nav-button');
const mobileNavMenu = document.querySelector('.mobile-nav-menu');

mobileNavButton.addEventListener('click', () => {
    mobileNavMenu.classList.toggle('open');
});

// Scroll to Top

const scrollTopButton = document.querySelector('.scroll-top-button');

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


