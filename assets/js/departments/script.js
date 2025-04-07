let urlParams = new URLSearchParams(window.location.search);
let qrs = urlParams.get('queries');
qrs = qrs ? atob(qrs) : null;

console.log(qrs); 

const urs = "https://example.com" + ( (qrs) ? '?' + qrs : '');

//console.log(urs);

let Params = getQueryParams(urs);
let did = Params['department'];

console.log(Params , did);
