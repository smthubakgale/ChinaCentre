document.getElementById('back-button').addEventListener('click', function() {
      window.history.back();
    });

document.getElementById('nav-button').addEventListener('click', function() {
    var url = 'https://www.google.com/maps/dir/?api=1&destination=-26.011694,28.123784';
    if (navigator.userAgent.match(/Mobile|Android|iPhone/i)) {
        window.open(url, '_self');
    } else {
        window.open(url, '_blank');
    }
});
