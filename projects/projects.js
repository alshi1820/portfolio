import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedIndex = -1;

let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

/* ---------------- PIE RENDER ---------------- */
function renderPieChart(projectsGiven) {
  const svg = d3.select('#projects-pie-plot');
  const legend = d3.select('.legend');

  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  // 1. roll up by year
  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  const data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  const pie = d3.pie().value(d => d.value);
  const arcData = pie(data);

  /* ---------------- DRAW PIE ---------------- */
  svg.selectAll('path')
    .data(arcData)
    .join('path')
    .attr('d', arcGenerator)
    .attr('fill', (_, i) => colors(i))
    .attr('class', (_, i) =>
      i === selectedIndex ? 'selected' : null
    )
    .on('click', (_, i) => {
      selectedIndex = selectedIndex === i ? -1 : i;
      updateView();
    });

  /* ---------------- DRAW LEGEND ---------------- */
  legend.selectAll('li')
    .data(data)
    .join('li')
    .attr('style', (_, i) => `--color: ${colors(i)}`)
    .attr('class', (_, i) =>
      i === selectedIndex ? 'selected' : null
    )
    .html(d => `
      <span class="swatch"></span>
      <span class="label">${d.label}</span>
      <em>(${d.value})</em>
    `);
}

/* ---------------- MAIN UPDATE ---------------- */
function updateView() {
  let filtered = projects;

  // search filter
  filtered = filtered.filter(project => {
    const values = Object.values(project).join(' ').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  // pie filter (IMPORTANT: must be applied AFTER search)
  if (selectedIndex !== -1) {
    const rolled = d3.rollups(
      filtered,
      v => v.length,
      d => d.year
    );

    const data = rolled.map(([year]) => year);
    const selectedYear = data[selectedIndex];

    filtered = filtered.filter(p =>
      String(p.year) === String(selectedYear)
    );
  }

  renderProjects(filtered, projectsContainer, 'h2');
  renderPieChart(filtered);
}

/* ---------------- INITIAL ---------------- */
updateView();

/* ---------------- SEARCH ---------------- */
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  selectedIndex = -1; // optional but prevents confusion
  updateView();
});