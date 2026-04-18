console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
const BASE_PATH =
  (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/portfolio/";

let pages = [
    { url: '', title: 'Home' },
    { url: 'contact/index.html', title: 'Contact' },
    { url: 'projects/index.html', title: 'Projects' },
    { url: 'resume/index.html', title: 'Resume' },
    { url: "https://github.com/alshi1820", title: 'GitHub' }
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
    if (a.host !== location.host ) {
        a.target = "_blank";
    }
    
    if (a.host === location.host && a.pathname === location.pathname 
    ) {
        a.classList.add('current');
    }
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );

    nav.append(a);
    
}
const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
const autoLabel = prefersDark ? "Automatic (Dark)" : "Automatic (Light)";
document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">${autoLabel}</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
		</select>
	</label>`,
);
const select = document.querySelector('.color-scheme select');

// Apply saved theme on load
if ("colorScheme" in localStorage) {
    const saved = localStorage.colorScheme;
    document.documentElement.dataset.theme = saved;
    select.value = saved;
}

// Save + apply on change
select.addEventListener('input', function (event) {
    const value = event.target.value;
    console.log('color scheme changed to', value);

    document.documentElement.dataset.theme = value;
    localStorage.colorScheme = value;
});




