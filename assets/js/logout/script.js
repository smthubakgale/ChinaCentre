 
setTimeout(()=>
{
  localStorage.setItem('chinacentre_local' , JSON.stringify({
        usertype: 'default' ,
        timestamp: new Date().toISOString()
      }));
  localStorage.removeItem('chinacentre');
  
  fill = "screen";
  loadPage('register');
  renderFill('screen'); 
},2000);
    
