import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const title = document.querySelector('.projects-title');

if (title && Array.isArray(projects)) {
  title.textContent = projects.length;
}

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);
let data = [
  { value: 1, label: 'apples' },
  { value: 2, label: 'oranges' },
  { value: 3, label: 'mangos' },
  { value: 4, label: 'pears' },
  { value: 5, label: 'limes' },
  { value: 5, label: 'cherries' },
];
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map(d => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);

arcs.forEach((arc, index) => {
  d3.select('#projects-pie-plot')   
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(index));
});