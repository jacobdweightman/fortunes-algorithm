var canvas, c;
var sites;
var dcel;

var Q; // priority queue of site events and vertex events
var T; // tree representing beach line

var voronoi_vertices;

function fortune(sites) {
  // initialize priority queue Q with all site events
  Q = new FastPriorityQueue(function(p,q) {
    if(p.y != q.y) {
      return p.y < q.y;
    } else {
      return p.x <= q.x;
    }
  });

  for(let site of sites) {
    Q.add(site);
  }

  // initialize beach line structure
  T = new BeachLineTree();

  // initialize output structure
  voronoi_vertices = [];

  draw();

  /*while(!Q.isEmpty()) {
    let p = Q.poll();
    p.process();
  }*/
}

document.addEventListener("keydown", function() {
  if(Q.isEmpty()) {
    console.log("done.");
    return;
  }

  let p = Q.poll();
  p.process();

  draw();
});

function draw() {
  // clear screen
  c.fillStyle = "#FFF";
  c.fillRect(0, 0, 800, 600);

  // draw sites
  c.fillStyle = "#000";
  for(let i=0; i<sites.length; i++) {
    c.fillRect(sites[i].x, sites[i].y, 5, 5);
  }

  // vertices
  c.fillStyle = "#0F0";
  for(let i=0; i<voronoi_vertices.length; i++) {
    c.fillRect(voronoi_vertices[i].x, voronoi_vertices[i].y, 10, 10);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  canvas = document.getElementById("voronoi");
  c = canvas.getContext('2d');

  /*sites = [
    new Site(300, 300),
    new Site(320, 500),
    new Site(400, 400)
  ];*/
  sites = [];
  /*sites.push(new Site(150, 150));
  sites.push(new Site(600, 200));
  sites.push(new Site(350, 300));
  sites.push(new Site(300, 500));
  sites.push(new Site(700, 450));*/
  for(let i=0; i<10; i++) {
    sites.push(new Site(Math.floor(800 * Math.random()), Math.floor(600 * Math.random())));
  }

  c.fillStyle = "#000";
  for(let i=0; i<sites.length; i++) {
    c.fillRect(sites[i].x, sites[i].y, 5, 5);
  }

  //dcel = new DCEL();
  //dcel.addVert(0, 0);
  //dcel.addVert(800, 0);
  fortune(sites);
  //dcel.draw();

  c.fillStyle = "#F00";
  for(let i=0; i<voronoi_vertices.length; i++) {
    c.fillRect(voronoi_vertices[i].x, voronoi_vertices[i].y, 10, 10);
  }
});
