
window.logout();

setTimeout(()=>
{
  session = null;
  session_local = null;
  
  loadPage('register');
  renderFill('screen'); 
},2000);
    
