function VertexEvent(a, b, c) {
  console.log("VertexEvent constructor called:")
  console.log(a);
  console.log(b);
  console.log(c);
  console.log("\n\n");

  /* Constructor for a vertex event. Takes three segments, and creates an object
   * representing the circumcircle of the three. this.x and this.y are the
   * coordinates of the bottom of the circle.  */

   if(Math.abs(cross(a.site, b.site, c.site)) < 0.01) {
     console.log(a.site, b.site, c.site);
     console.trace();
     throw "tried to construct degenerate VertexEvent";
   }

   this.a = a;
   this.b = b;
   this.c = c; // IMPORTANT! this algorithm is incorrect if these are not passed in sorted order by x coordinate

   let as = a.site;
   let bs = b.site;
   let cs = c.site;

   let D = 2*(as.x*(bs.y - cs.y) + bs.x*(cs.y - as.y) + cs.x*(as.y - bs.y));

   this.x = ((as.x**2 + as.y**2)*(bs.y - cs.y) + (bs.x**2 + bs.y**2)*(cs.y - as.y) + (cs.x**2 + cs.y**2)*(as.y - bs.y)) / D;
   this.y = ((as.x**2 + as.y**2)*(cs.x - bs.x) + (bs.x**2 + bs.y**2)*(as.x - cs.x) + (cs.x**2 + cs.y**2)*(bs.x - as.x)) / D;

   this.r = Math.sqrt((as.x - this.x)**2 + (as.y - this.y)**2);
   this.y += this.r;

   this.valid = true;
}

VertexEvent.prototype.process = function() {
  if(!this.valid) {
    return;
  }

  voronoi_vertices.push(new Vertex(this.x, this.y - this.r))

  console.log("VertexEvent:");
  console.log(this);

  // invalidate vertex events involving the disappearing segment
  if(this.a.event) {
    console.log("invalidated:");
    console.log(this.a.event);
    this.a.event.valid = false;
  }
  if(this.c.event) {
    console.log("invalidated:");
    console.log(this.c.event);
    this.c.event.valid = false;
  }

  // remove the disappearing segment from the beach line
  T.remove(this.b);

  // get segment references for potential new VertexEvents
  let lnode = this.a.prev();
  let rnode = this.c.next();

  // if there is a left triple of arcs and the corresponding sites are directed
  // clockwise (so the breakpoints between them converge), create a new VE.
  if(lnode && cross(lnode.site, this.a.site, this.c.site) > 0.01) {
    let ve = new VertexEvent(lnode, this.a, this.c);
    this.a.event = ve;
    Q.add(ve);
  }

  // if there is a right triple of arcs and the corresponding sites are directed
  // clockwise (so the breakpoints between them converge), create a new VE.
  if(rnode && cross(this.a.site, this.c.site, rnode.site) > 0.01) {
    let ve = new VertexEvent(this.a, this.c, rnode);
    this.c.event = ve;
    Q.add(ve);
  }
}
