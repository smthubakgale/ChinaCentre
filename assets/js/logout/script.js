 
setTimeout(()=>
{
  session = null;
  session_local = null;
  window.logout();
  
  loadPage('register');
  renderFill('screen'); 
},2000);
    
