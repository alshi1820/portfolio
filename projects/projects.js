import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

/* ---------------- DATA ---------------- */
const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

/* ---------------- STATE ---------------- */
let query = '';
let selectedIndex = -1;

/* ---------------- PIE SETTINGS ---------------- */
let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

/* ---------------- RENDER PIE + LEGEND ---------------- */
function renderPieChart(projectsGiven) {
  let svg = d3.select('#projects-pie-plot');
  let legend = d3.select('.legend');

  // clear old render
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  // group by year
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
  let arcs = arcData.map(d => arcGenerator(d));

  // draw pie
  arcs.forEach((arc, i) => {
    svg.append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : null)
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updateView();
      });
  });

  // draw legend
  data.forEach((d, i) => {
    legend.append('li')
      .attr('style', `--color: ${colors(i)}`)
      .attr('class', i === selectedIndex ? 'selected' : null)
      .html(`
        <span class="swatch"></span>
        <span class="label">${d.label}</span>
        <em>(${d.value})</em>
      `);
  });
}

/* ---------------- MASTER UPDATE FUNCTION ---------------- */
function updateView() {
  let filtered = projects;

  // apply search filter
  filtered = filtered.filter((project) => {
    let values = Object.values(project).join(' ').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  // apply pie (year) filter
  if (selectedIndex !== -1) {
    let rolled = d3.rollups(
      filtered,
      (v) => v.length,
      (d) => d.year
    );

    let selectedYear = rolled[selectedIndex][0];

    filtered = filtered.filter(p => p.year === selectedYear);
  }

  renderProjects(filtered, projectsContainer, 'h2');
  renderPieChart(filtered);
}

/* ---------------- INITIAL RENDER ---------------- */
updateView();

/* ---------------- SEARCH ---------------- */
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  updateView();
});
