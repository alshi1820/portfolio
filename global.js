console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
let navLinks = $$("nav a");
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                  // Local server
    : "/website/";  

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname,
);

currentLink?.classList.add('current');

let pages = [
    { url: 'contact/', title: 'Contact' },
    { url: 'projects/', title: 'Projects' },
    { url: '', title: 'Home' },
    { url: 'resume/', title: 'Resume' }
];
let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url; 
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let title = p.title;
    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );
    
}

