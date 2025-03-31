let query = '';
// 1. Read Deoartments 
const department = document.querySelector('.shop-by-department .department').cloneNode(true);

query =  `SELECT TOP 6 *
FROM Departments
ORDER BY NEWID();`;

fetch(d_config.url + `database/query/exec?session=${encodeURIComponent(session)}&query=${btoa(query)}`)
.then((response) => response.json())
.then((data) => { 
     consoel.log(data);
    if(data.success && data.results){
    }
})
.catch((error) => {
    console.error(error);
});

