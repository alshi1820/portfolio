import { fetchJSON, renderProjects } from '../global.js';

let projects = [];

try {
  // original line (kept exactly)
  projects = await fetchJSON('../lib/projects.json');
  console.log('PROJECTS:'.projects);

  // extra validation (added)
  if (!Array.isArray(projects)) {
    throw new Error('Invalid JSON format: expected an array');
  }

} catch (error) {
  console.error('Error loading projects:', error);

  const projectsContainer = document.querySelector('.projects');
  projectsContainer.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
}

// original lines (kept exactly)
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

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
            <h${headingLevel}${proj.title ? proj.title : 'Untitled Project'}</${headingLevel}>
            <img src="${proj.image ? proj.image : 'images/placeholder.png'}" alt="${proj.title ? proj.title : 'Project image'}">
            <p>${proj.description ? proj.description : 'No description available.'}</p>
        `;
        containerElement.appendChild(article);
    }
  
}
