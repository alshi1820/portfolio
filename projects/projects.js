import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';


const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');


let query = '';
let selectedYear = null;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let colors = d3.scaleOrdinal(d3.schemeTableau10);


function renderPieChart(projectsGiven) {
    let svg = d3.select('#projects-pie-plot');
    let legend = d3.select('.legend');

 
    svg.selectAll('path').remove();
    legend.selectAll('li').remove();

  
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

  
    arcData.forEach((d, i) => {
        svg.append('path')
            .attr('d', arcGenerator(d))
            .attr('fill', colors(i))
            .classed('selected', selectedYear === data[i].label)
            .on('click', () => {
            selectedYear = selectedYear === data[i].label ? null : data[i].label;
            updateView();
        });
    });


    data.forEach((d, i) => {
        legend.append('li')
            .attr('style', `--color: ${colors(i)}`)
            .classed('selected', selectedYear === d.label)
            .html(`
            <span class="swatch"></span>
            <span class="label">${d.label}</span>
            <em>(${d.value})</em>
            `);
    });
}


function updateView() {
    let filtered = projects;

    
    filtered = filtered.filter((project) => {
        let values = Object.values(project).join(' ').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    if (selectedYear !== null && selectedYear !== -1) {
        filtered = filtered.filter(p => String(p.year) === String(selectedYear));
    }

    renderProjects(filtered, projectsContainer, 'h2');
    renderPieChart(filtered);
}


updateView();


searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    updateView();
});
