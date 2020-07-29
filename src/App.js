import React from 'react';
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import './App.css';


const request = new XMLHttpRequest();
  request.open('GET', 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
  request.send();
  request.onload = function() {
    let data = JSON.parse(request.responseText);
    
    let info = d3.select('.App') //copied from my Choropleth map
                 .append('div')
                 .style('height', "40px")
                 .style('background-color', 'rgb(63,63,64,0.8')
                 .style('padding', "5px 10px")
                 .style('border-radius', '5%')
                 .style('color', 'white')
                 .style('font-size', '12px')
                 .style('display', 'none')
                 .style('position', 'absolute') 
                 .attr('id', 'tooltip') //inspired by the last answer on this post (https://www.freecodecamp.org/forum/t/d3-tooltip-wanted-is-that-15-chars-now/92398/6)
        
    d3.select('.App').append('h1').text('Movie Sales by Category').attr('id', 'title')
    d3.select('.App').append('h4').text('Highest Selling Movies of the Time').attr('id', 'description')
      
    const svg = d3.select('.App')
                    .append('svg')
                    .attr('height', 550)
                    .attr('width', 900)
                    .style('margin-bottom', '1%')
                    

      var root = d3.hierarchy(data)
      var treemap = d3.treemap()
                      .size([900, 550])
                      .padding(0.5);
                      

      var nodes = treemap(root
        .sum(function (d) {return d.value; })
      ).leaves()   // used raphaeluziel's answer as my reference https://forum.freecodecamp.org/t/treemap-test-5-6/227929/4             
     
     

     d3.select('.App svg') //reference to https://www.d3indepth.com/layouts/ for showing me how to append the treemap to the svg
     .selectAll('rect')
     .data(nodes)
     .enter()
     .append('rect')
     .attr('x', d => d.x0)
     .attr('y', d => d.y0)
     .attr('width', d=> d.x1 - d.x0)
     .attr('height', d=> d.y1 - d.y0)
     .style('stroke', 'white')
     .style('stroke-width', '1')
     .attr('data-value', d=> d.data.value)
     .attr('data-name', d=> d.data.name)
     .attr('data-category', d=> d.data.category)
     .attr('class', 'tile')
     .style('fill', d=> d.data.category === "Action"? "hsl(214, 75%, 61%)" : d.data.category=== "Childrens"? "hsl(40, 75%, 61%)" :  d.data.category==="Drama"? "hsl(161, 75%, 61%)" :  d.data.category==="Adventure"? "hsl(108, 75%, 61%)": d.data.category==="Family"? "hsl(26, 75%, 61%)" : d.data.category==="Animation"? "hsl(277, 75%, 61%)": d.data.category==="Comedy"? "hsl(313, 75%, 61%)": "hsl(360, 75%, 61%)" )   
     .on('mouseover', function(e) {
      info = info.style('display', 'inline')
                 .attr('data-value', this.getAttribute('data-value'))
                 .style('transform', i => 'translate(' + (this.getAttribute('x') -450) + 'px,' + (this.getAttribute('y')+50) +'px)')
                 .html('<div>' + this.getAttribute('data-name') + ', ' + this.getAttribute('data-category') + ' </div><div>' + 'Value: ' + this.getAttribute('data-value') +'</div>')
                
    }) //all event data taken from my choropleth map
    .on('mouseout', function (e) {
     info = info.style('display', 'none')
   }); 

     d3.select('.App svg')
     .selectAll('foreignObject')
     .data(nodes)
     .enter()
     .append('foreignObject')
     .html(d=> '<div>'+ d.data.name + '</div>')
     .attr('x', d => d.x0)
     .attr('y', d => d.y0 + 10)
     .attr('width', d=> d.x1 - d.x0)
     .attr('height', '5')
     .style('font-size', '10px')
     .style('overflow', 'visible')
     .style('line-height', '100%')   
     
     const legend = d3.select('.App') //Took my legend from my Heat Map and altered it
                      .append('svg')
                      .attr('height', 120)
                      .attr('width', 500)
                      .attr('id', 'legend')
                      .style('text-align', 'left')
                     

      const leg = [1,2,3,4,5,6,7]     
      
      legend.selectAll('rect')
            .data(leg) 
            .enter()
            .append('rect') 
            .attr('height', 20)
            .attr('width', 20)
            .attr('y', i => i < 5? -22.5 + i*25 : -123 + i*25)
            .attr('x', i => i < 5? 30 : 230)
            .style('fill', i => i===7? "hsl(214, 75%, 61%)" : i===6? "hsl(360, 75%, 61%)" : i===5? "hsl(161, 75%, 61%)" : i==4? "hsl(108, 75%, 61%)" : i===3? "hsl(26,75%,61%)" : i===2? "hsl(277, 75%, 61%)" : "hsl(313, 75%, 61%)")
            .attr('class', 'legend-item')

      legend.selectAll('text')
            .data(leg) 
            .enter()
            .append('text') 
            .attr('height', 20)
            .attr('width', 100)
            .attr('y', i => i < 5? -7 + i*25 : -107 + i*25)
            .attr('x', i => i < 5? 55 : 255)
            .text(i => i===7? "Action" : i===6? "Biography" : i===5? "Drama" : i==4? "Adventure" : i===3? "Family" : i===2? "Animation" : "Comedy")                
      
      }




function App() {
  return (
    <div className="App">
     
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'))
export default App;
