var canvas, c;
var sites;
var dcel;

var Q; // priority queue of site events and vertex events
var T; // tree representing beach line
var y; // the y-coordinate of the sweepline

var voronoi_vertices;

function fortune(sites) {
  /* This method initializes the priority queue and beach line tree for the
   * running of Fortune's algorithm. The actual execution of the algorithm is
   * handled by the keydown event listener below so that the user can step
   * through it. */

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

  // initialize DCEL for storing diagram
  dcel = new DCEL();
  voronoi_vertices = [];

  draw();
}

function infiniteEdges() {
  // for each internal node
  let stack = [];
  stack.push(T.root);
  while(stack.length !== 0) {
    let bp = stack.pop();
    if(bp.left !== undefined) {
      stack.push(bp.left);
      stack.push(bp.right);

      // construct infinite edge for this breakpoint
      for(let v of bp.s1.vertices) {
        if(v.sites.has(bp.s2)) {
          // v is the vertex. Compute slope perpendicular bisector.
          let m = (bp.s1.x - bp.s2.x) / (bp.s2.y - bp.s1.y);

          let xb = (bp.s1.x + bp.s2.x) / 2
          let yb = (bp.s1.y + bp.s2.y) / 2

          let v1 = new Vertex(xb + 100000, yb + m*100000);
          let v2 = new Vertex(xb - 100000, yb - m*100000);

          if(cross(v, v.incidentEdge.prev.target, v1) * cross(v, v1, v.incidentEdge.next.target) * (v.x - 400) > 0) {
            console.log("v1");
            dcel.addVert(v1.x, v1.y, v.incidentEdge);
          } else {
            console.log("v2");
            dcel.addVert(v2.x, v2.y, v.incidentEdge);
          }
        }
      }
    }
  }
}

function keydown() {
  /* When the user presses a key, run the next event from the priority queue for
   * Fortune's algorithm. This way, the user can move through the algorithm
   * step by step. */
  if(Q.isEmpty()) {
    console.log("done.");
    infiniteEdges();
    draw();
    document.removeEventListener("keydown", keydown);
    return;
  }

  let p = Q.poll();
  y = p.y;
  p.process();

  draw();
}

document.addEventListener("keydown", keydown);

function draw() {
  /* Draw the current state of the Voronoi diagram on the canvas. */

  // clear screen
  c.fillStyle = "#FFF";
  c.fillRect(0, 0, 800, 600);

  // draw beachline
  T.draw(y);

  // vertices
  dcel.draw()
  /*c.fillStyle = "#0F0";
  for(let v of dcel.vertices) {
    c.fillRect(v.x-5, v.y-5, 10, 10);
  }*/

  // draw sites
  c.fillStyle = "#000";
  for(let s of sites) {
    c.fillRect(s.x-2.5, s.y-2.5, 5, 5);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  /* This is the first code that runs. It initializes the page for drawing, and
   * kicks off the running of the algorithm by defining the sites it should be
   * run on. */
  canvas = document.getElementById("voronoi");
  c = canvas.getContext('2d');

  sites = [];
  // These sites were used for testing. We manually worked out what the beach
  // line and priority queue should look like at each step for these, and
  // used this to verify the correctness.
  sites.push(new Site(150, 150));
  sites.push(new Site(600, 200));
  sites.push(new Site(350, 300));
  sites.push(new Site(300, 500));
  sites.push(new Site(700, 450));
  sites.push(new Site(100, 410));
  sites.push(new Site(420, 390));
  sites.push(new Site(430, 75));

  // Select 10 randomly distributed sites on the canvas
  /*for(let i=0; i<10; i++) {
    sites.push(new Site(Math.floor(800 * Math.random()), Math.floor(600 * Math.random())));
  }*/

  fortune(sites);
});
