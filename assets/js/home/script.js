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
             let department = document.querySelector('.shop-by-department .department').cloneNode(true);
             const h5 = department.querySelector("h5");
             const img = department.querySelector("img");
              
             h5.innerHTML = item.department_name;
              
             img.src = `${d_config.url}get-file?session='${encodeURIComponent(session)}'&tableName=Departments&idx=${encodeURI(item.idx)}`;
             img.alt = item.department_name;

             document.querySelector('.shop-by-department .final').appendChild(department);
         });
    }
})
.catch((error) => {
    console.error(error);
});

