console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
        ? "/"                  // Local server
        : "/website/";  
navLinks = $$("nav a")
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);

if (currentLink) {
  // or if (currentLink !== undefined)
  currentLink?.classList.add('current');
}
let pages = [
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'index.html', title: 'Home' },
  { url: 'resume.html', title: 'Resume' }
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
    
    
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );
    nav.append(a);
}

