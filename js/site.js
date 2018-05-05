function Site(x, y) {
  this.x = x;
  this.y = y;

  this.vertices = [];
}

Site.prototype.process = function() {
  console.log("Site event");
  console.log(this);

  if(T.isEmpty()) {
    T.setRoot(this);
    return;
  }

  let alpha = T.findAbove(this);
  if(alpha.event !== undefined) {
    alpha.event.valid = false;
  }

  let [l, c, r] = T.split(alpha, this);

  // TODO: handle edge information

  // create new vertex event on either side
  let ll = l.prev();
  let rr = r.next();

  if(ll !== undefined && cross(ll.site, l.site, c.site) > 0.01) {
    l.event = new VertexEvent(ll, l, c);
    Q.add(l.event);
  }

  if(rr !== undefined && cross(c.site, r.site, rr.site) > 0.01) {
    r.event = new VertexEvent(c, r, rr);
    Q.add(r.event);
  }
}
