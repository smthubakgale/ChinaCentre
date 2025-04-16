
let query = `
  SELECT TOP 1 *
  FROM User_Payments
  ORDER BY checkout_date DESC
`;

fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
.then((response) => { 
    return response.json();
})
.then((data) => {
    console.log(data); 
    if(data.success && data.results)
    {

    }
})
.catch((error) => {
    console.error(error);
}); 
