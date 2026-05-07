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
    { url: 'meta/index.html',title:'Meta'},
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
    
};

document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme:
            <select>
                <option value="light dark">Automatic</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </label>`,
);






const select = document.querySelector('.color-scheme select');
if ('colorScheme' in localStorage){
    document.documentElement.style.colorScheme = localStorage.colorScheme;

    select.value = localStorage.colorScheme;
};
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.colorScheme = event.target.value;
    localStorage.colorScheme = event.target.value;
});

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!containerElement){
        console.error('No valid container provided');
        return;
    }
    containerElement.innerHTML = '';
    if (!projects || projects.length === 0){
        containerElement.innerHTML = '<p>No projects available yet.</p>';
        return;
    }
    const validHeadings = ['h1','h2','h3','h4','h5','h6'];
    if (!validHeadings.includes(headingLevel)){
        console.warn('Inavlid headingLevel, defuaulting to h2');
        headingLevel = 'h2';
    }
    for (const proj of projects){
        const article = document.createElement('article');
        article.innerHTML = `
            <h${headingLevel}>${proj.title ? proj.title : 'Untitled Project'}</${headingLevel}>
            <img src="${proj.image ? proj.image : 'images/placeholder.png'}" alt="${proj.title ? proj.title : 'Project image'}">
            
            <div class="project-info">
                <p>${proj.description ? proj.description : 'No description available.'}</p>
                <p class="project-year">${proj.year ? proj.year : 'Unknown year'}</p>
            </div>
        `;
        containerElement.appendChild(article);
    }
  
}
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}




