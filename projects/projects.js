import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const title = document.querySelector('.projects-title');

if (title && Array.isArray(projects)) {
  title.textContent = projects.length;
}

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
let arc = d3.arc().innerRadius(0).outerRadius(50)({
  startAngle: 0,
  endAngle: 2 * Math.PI,
});



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


