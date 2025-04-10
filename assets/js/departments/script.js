let urlParams = new URLSearchParams(window.location.search);
let qrs = urlParams.get('queries');
qrs = qrs ? atob(qrs) : null;

console.log(qrs); 

const urs = "https://example.com" + ( (qrs) ? '?' + qrs : '');

//console.log(urs);

let Params = getQueryParams(urs);
let did = Params['department'];

console.log(Params , did);

if(did)
{
// Read Categorys
let query =  `
SELECT TOP 16 
  c.*,
  d.department_name
FROM 
  Categories c
  INNER JOIN Departments d ON c.department_no = d.idx
WHERE 
  c.department_no = ${did}
ORDER BY 
  NEWID();
`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     console.log(data);
    if(data.success && data.results)
    {
         data.results.recordset.forEach((item , index)=>
         {
              //console.log(item);
             if(index == 0){
               document.querySelectorAll(".dept").forEach((dep)=>{
                  dep.innerHTML = item.department_name;
                  dep.style.opacity = 1;
               }); 
               //
             }
              
             let category = new DOMParser().parseFromString( `
                  <div href="#products" class="category nav-link"  queries="${'category=' + item.idx}"  >
                     <img src="" alt="">
                     <div>${item.category_name}</div>
                  </div>
              `, 
              "text/html").body.firstChild; 
            
              const img = category.querySelector("img");
                
              fetch(d_config.url + `list-files?session='${encodeURIComponent(session)}'&tableName=Categories&tableIdx=${item.idx}`)
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
                            
                            img.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Categories&idx=${encodeURI(item.idx)}`;
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
              
             img.alt = item.category_name;

             document.querySelector('.categories-grid.final').appendChild(category);
         });
    }
})
.catch((error) => {
    console.error(error);
});
   
}
