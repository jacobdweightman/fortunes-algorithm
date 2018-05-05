function Vertex(x, y) {
  if(x == undefined || y == undefined) {
    console.log("random!");
    this.x = Math.floor(800 * Math.random());
    this.y = Math.floor(600 * Math.random());
  } else {
    this.x = x;
    this.y = y;
  }

  this.incidentEdge = undefined;
}

function Edge() {
  this.target = undefined;
  this.twin = undefined;
  this.incidentFace = undefined;
  this.next = undefined;
  this.prev = undefined;
}

function Face(color) {
  this.start = undefined;

  if(color == undefined) {
    this.color = '#'+(Math.round(Math.random()*0xFFFFFF)).toString(16);
  } else {
    this.color = color;
  }
}

function DCEL() {
  /* Create a new doubly-connected edge list. Initialize it with two vertices
   * at the origin, with two half-edges between them. This means there is one
   * face, i.e. the infinite one. */
  this.order = 0;

  let infiniteFace = new Face();
  this.faces = new Set([infiniteFace]);

  let v1 = new Vertex(0, 0);
  let v2 = new Vertex(0, 0);

  e = new Edge();
  ep = new Edge();

  v1.incidentEdge = ep;
  v2.incidentEdge = e;

  infiniteFace.start = e;

  e.target = v2;
  ep.target = v1;

  e.twin = ep;
  ep.twin = e;

  e.incidentFace = infiniteFace;
  ep.incidentFace = infiniteFace;

  e.next = ep;
  ep.next = e;

  e.prev = ep;
  ep.prev = e;

  this.vertices = [v1, v2];
  this.edges = new Set([e, ep]);
}

DCEL.prototype.addVert = function(x, y, prevEdge) {
  /* Create a vertex with the given coordinates, and insert it into the graph
   * with two half edges from the target of prevEdge and on the same face as
   * prevEdge. A reference to the new vertex is returned. */
   if(this.order < 2) {
     this.vertices[this.order].x = x;
     this.vertices[this.order].y = y;
     this.order++;
     return this.vertices[this.order-1];
   }

   let v = new Vertex(x, y);
   this.vertices.push(v);

   let h1 = new Edge();
   let h2 = new Edge();
   this.edges.add(h1);
   this.edges.add(h2);

   v.incidentEdge = h1;

   h1.twin = h2;
   h2.twin = h1;

   h1.target = v;
   h2.target = prevEdge.target;

   h1.incidentFace = prevEdge.incidentFace;
   h2.incidentFace = prevEdge.incidentFace;

   h1.next = h2;
   h2.next = prevEdge.next;

   h1.prev = prevEdge;
   h2.prev = h1;

   prevEdge.next = h1;
   h2.next.prev = h2;

   this.order++;
   return v;
}

DCEL.prototype.splitFace = function(v, prevEdge) {
  /* Splits the face of prevEdge into two new faces. This is done by inserting
   * two new half edges between the target of prevEdge to v, and reassigning
   * the faces on either side of the new edges. */
   this.faces.delete(prevEdge.incidentFace);

   let f1 = new Face();
   let f2 = new Face();

   let h1 = new Edge();
   let h2 = new Edge();

   f1.start = h1;
   f2.start = h2;

   h1.twin = h2;
   h2.twin = h1;

   h1.target = v;
   h2.target = prevEdge.target;

   h2.next = prevEdge.next;
   h2.next.prev = h2;

   h1.prev = prevEdge;
   prevEdge.next = h1;

   let e = h2;
   while(e.target != v) {
     e.incidentFace = f2;
     e = e.next;
   }
   e.incidentFace = f2;

   h1.next = e.next;
   h1.next.prev = h1;
   e.next = h2;
   h2.prev = e;

   e = h1;
   while(e.target != prevEdge.target) {
     e.incidentFace = f1;
     e = e.next;
   }
   e.incidentFace = f1;

   this.faces.add(f1);
   this.faces.add(f2);
   this.edges.add(h1);
   this.edges.add(h2);
}

DCEL.prototype.draw = function() {
  /* draw this DCEL on the canvas */
  for(let f of this.faces) {
    c.fillStyle = f.color;

    let e = f.start;
    c.moveTo(e.target.x, e.target.y);

    e = e.next;
    while(e != f.start) {
      c.lineTo(e.target.x, e.target.y);
      e = e.next;
    }

    c.closePath();
    c.fill();
  }
}
