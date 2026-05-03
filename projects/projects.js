import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedIndex = -1; // IMPORTANT: use index, not year string

let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

/* ---------------- PIE RENDER ---------------- */
function renderPieChart(projectsGiven) {
  let svg = d3.select('#projects-pie-plot');
  let legend = d3.select('.legend');

  // clear old chart
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  // group data by year
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  let sliceGenerator = d3.pie().value(d => d.value);
  let arcData = sliceGenerator(data);

  /* ---------------- DRAW PIE ---------------- */
  arcData.forEach((d, i) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(i))
      .classed('selected', selectedIndex === i)
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updateView();
      });
  });

  /* ---------------- DRAW LEGEND ---------------- */
  data.forEach((d, i) => {
    legend.append('li')
      .attr('style', `--color: ${colors(i)}`)
      .classed('selected', selectedIndex === i)
      .html(`
        <span class="swatch"></span>
        <span class="label">${d.label}</span>
        <em>(${d.value})</em>
      `);
  });
}

/* ---------------- FILTER + RENDER ---------------- */
function updateView() {
  let filtered = projects;

  // search filter
  filtered = filtered.filter((project) => {
    let values = Object.values(project).join(' ').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  // pie filter (by year)
  if (selectedIndex !== -1) {
    let rolled = d3.rollups(
      filtered,
      (v) => v.length,
      (d) => d.year
    );

    let data = rolled.map(([year]) => year);
    let selectedYear = data[selectedIndex];

    filtered = filtered.filter(p => String(p.year) === String(selectedYear));
  }

  renderProjects(filtered, projectsContainer, 'h2');
  renderPieChart(filtered);
}

/* ---------------- INITIAL LOAD ---------------- */
updateView();

/* ---------------- SEARCH ---------------- */
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  updateView();
});