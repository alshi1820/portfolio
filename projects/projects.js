import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const title = document.querySelector('.projects-title');

if (title && Array.isArray(projects)) {
  title.textContent = `(${projects.length}) Projects`;
}
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// let projects = [];

// try {
//   // original line (kept exactly)
//   projects = await fetchJSON('../lib/projects.json');
//   console.log('PROJECTS:', projects);

//   // extra validation (added)
//   if (!Array.isArray(projects)) {
//     throw new Error('Invalid JSON format: expected an array');
//   }

// } catch (error) {
//   console.error('Error loading projects:', error);
//   return [];

//   const projectsContainer = document.querySelector('.projects');
//   projectsContainer.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
// }

// // original lines (kept exactly)
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');


