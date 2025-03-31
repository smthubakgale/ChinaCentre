let query = '';
// 1. Read Deoartments 

query =  `SELECT TOP 6 *
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
              
             let department = document.querySelector('.shop-by-department .department').cloneNode(true);
             const h5 = department.querySelector("h5");
             const img = department.querySelector("img");
              
             h5.innerHTML = item.department_name;
              
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

             document.querySelector('.shop-by-department .final').appendChild(department);
         });
    }
})
.catch((error) => {
    console.error(error);
});

// 2. Read Brands 

query =  `SELECT TOP 6 *
FROM Brands
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
              
             let brand = document.querySelector('.explore-brands .item').cloneNode(true);
             const h5 = brand.querySelector("h5");
             const img = brand.querySelector("img");
              
             h5.innerHTML = item.brand_name;
              
              fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Brands&tableIdx=${item.idx}`)
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
          			   
          			   img.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Brands&idx=${encodeURI(item.idx)}`;
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
              
             img.alt = item.brand_name;

             document.querySelector('.explore-brands .final').appendChild(brand);
         });
    }
})
.catch((error) => {
    console.error(error);
});
