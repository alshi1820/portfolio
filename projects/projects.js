import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

/* ---------------- DATA ---------------- */
const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

/* ---------------- STATE ---------------- */
let query = '';
let selectedYear = null;

/* ---------------- PIE SETUP ---------------- */
let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

/* ---------------- PIE RENDER ---------------- */
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

  /* ---------------- DRAW PIE ---------------- */
  arcData.forEach((d) => {
    const year = d.data.label;

    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(year))
      .classed('selected', selectedYear === year)
      .on('click', () => {
        selectedYear = selectedYear === year ? null : year;
        updateView();
      });
  });

  /* ---------------- DRAW LEGEND ---------------- */
  data.forEach((d) => {
    legend.append('li')
      .attr('style', `--color: ${colors(d.label)}`)
      .classed('selected', selectedYear === d.label)
      .html(`
        <span class="swatch"></span>
        <span class="label">${d.label}</span>
        <em>(${d.value})</em>
      `)
      .on('click', () => {
        selectedYear = selectedYear === d.label ? null : d.label;
        updateView();
      });
  });
}

/* ---------------- MAIN UPDATE FUNCTION ---------------- */
function updateView() {
  let filtered = projects;

  /* search filter */
  filtered = filtered.filter((project) => {
    let values = Object.values(project).join(' ').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  /* pie filter */
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