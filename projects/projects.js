import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedIndex = -1; // index in current pie data
let selectedYear = null; // actual year (IMPORTANT FIX)

let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

/* ---------------- PIE RENDER ---------------- */
function renderPieChart(projectsGiven) {
  let svg = d3.select('#projects-pie-plot');
  let legend = d3.select('.legend');

  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  // STEP 1: roll data by year
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  // STEP 2: build arcs
  let pie = d3.pie().value(d => d.value);
  let arcData = pie(data);

  /* ---------------- DRAW PIE ---------------- */
  arcData.forEach((d, i) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(i))
      .classed('selected', selectedYear === data[i].label)
      .on('click', () => {
        // toggle selection
        selectedYear = selectedYear === data[i].label ? null : data[i].label;
        selectedIndex = i;
        updateView();
      });
  });

  /* ---------------- DRAW LEGEND ---------------- */
  data.forEach((d, i) => {
    legend.append('li')
      .attr('style', `--color: ${colors(i)}`)
      .classed('selected', selectedYear === d.label)
      .on('click', () => {
        selectedYear = selectedYear === d.label ? null : d.label;
        selectedIndex = i;
        updateView();
      })
      .html(`
        <span class="swatch"></span>
        <span class="label">${d.label}</span>
        <em>(${d.value})</em>
      `);
  });
}

/* ---------------- MAIN UPDATE FUNCTION ---------------- */
function updateView() {
  let filtered = projects;

  /* ---------------- SEARCH FILTER ---------------- */
  filtered = filtered.filter((project) => {
    let values = Object.values(project).join(' ').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  /* ---------------- PIE FILTER ---------------- */
  if (selectedYear !== null) {
    filtered = filtered.filter(p => String(p.year) === String(selectedYear));
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