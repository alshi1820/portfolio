console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
const BASE_PATH =
  (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/portfolio/";

let pages = [
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'index.html', title: 'Home' },
  { url: 'resume/index.html', title: 'Resume' }
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
    
    if (a.host === location.host &&
        (
            a.pathname === location.pathname ||
            (a.pathname.endsWith('index.html') && location.pathname.endsWith('/'))
        )
    ) {
        a.classList.add('current');
    }

    nav.append(a);
    
}

