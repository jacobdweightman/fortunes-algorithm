// import dependencies when running under test
if(typeof module !== "undefined") {
  FastPriorityQueue = require('../dep/FastPriorityQueue.js');
  BeachLineTree = require('./BeachLineTree.js');
  DCEL = require('./dcel.js').DCEL;
}

var canvas, c;

var F;

function Fortune(sites) {
  /* Represents a runner object for Fortune's algorithm. This object will
   * maintain the state of the algorithm, so that the user may step through
   * its execution using its step method. */
   this.Q = new FastPriorityQueue(function(p,q) {
     if(p.y != q.y) {
       return p.y < q.y;
     } else {
       return p.x <= q.x;
     }
   });

   for(let site of sites) {
     this.Q.add(site);
   }

   this.T = new BeachLineTree();
   this.dcel = new DCEL();
   this.y = undefined; // the y-coordinate of the sweep line
}

Fortune.prototype.draw = function(ctx) {
  /* Draw the current state of the Voronoi diagram on the canvas with the given
   * context. */

   // clear screen
   c.fillStyle = "#FFF";
   c.fillRect(0, 0, 800, 600);

   this.T.draw(this.y);

   this.dcel.draw();

   // draw sites
   c.fillStyle = "#000";
   for(let s of sites) {
     c.fillRect(s.x-2.5, s.y-2.5, 5, 5);
   }
}

Fortune.prototype.step = function() {
  if(this.Q.isEmpty()) {
    this.finish();
    return false;
  }

  let p = this.Q.poll();
  this.y = p.y;
  p.process(this);

  return true;
}

Fortune.prototype.finish = function() {
  // for each internal node
  let stack = [];
  stack.push(this.T.root);
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
            this.dcel.addVert(v1.x, v1.y, v.incidentEdge);
          } else {
            console.log("v2");
            this.dcel.addVert(v2.x, v2.y, v.incidentEdge);
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

  if(!F.step()) {
    document.removeEventListener("keydown", keydown);
  }

  F.draw();
}

document.addEventListener("keydown", keydown);

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

  //fortune(sites);
  F = new Fortune(sites);
  F.draw();
});

if(typeof module !== "undefined") {
  module.exports = Fortune;
}
