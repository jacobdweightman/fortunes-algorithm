if(typeof module !== "undefined") {
  const VertexEvent = require('../js/vertexevent.js');
}

function Site(x, y) {
  this.x = x;
  this.y = y;

  this.vertices = [];
}

Site.prototype.process = function(fortune) {
  console.log("Site event");
  console.log(this);

  if(fortune.T.isEmpty()) {
    fortune.T.setRoot(this);
    return;
  }

  let alpha = fortune.T.findAbove(this);
  if(alpha.event !== undefined) {
    alpha.event.valid = false;
  }

  let [l, c, r] = fortune.T.split(alpha, this);

  // TODO: handle edge information

  // create new vertex event on either side
  let ll = l.prev();
  let rr = r.next();

  if(ll !== undefined && cross(ll.site, l.site, c.site) > 0.01) {
    l.event = new VertexEvent(ll, l, c);
    fortune.Q.add(l.event);
  }

  if(rr !== undefined && cross(c.site, r.site, rr.site) > 0.01) {
    r.event = new VertexEvent(c, r, rr);
    fortune.Q.add(r.event);
  }
}

if(typeof module !== "undefined") {
  module.exports = Site;
}
