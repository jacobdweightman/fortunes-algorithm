function Segment(site, parent) {
  this.site = site;
  this.parent = parent;
  this.event = undefined;
}

Segment.prototype.prev = function() {
  /* Returns the segment to the left of this one on the beach line, or undefined
   * if this is the leftmost segment on the beach line. */

  let ante = this;

  // go up until you're no longer a left child or root is reached
  while(ante.parent !== undefined && ante === ante.parent.left) {
    ante = ante.parent;
  }

  // if root was reached, this is the leftmost and there is no previous segment
  if(ante.parent === undefined) {
    return undefined;
  }

  // go up and left
  ante = ante.parent.left;

  // find the rightmost descendent
  while(ante.right) {
    ante = ante.right;
  }

  return ante;
}

Segment.prototype.next = function() {
  /* Returns the segment to the right of this one on the beach line, or
   * undefined if this is the rightmost segment on the beach line. */

  let succ = this;

  // go up until you're no longer a right child
  while(succ.parent !== undefined && succ === succ.parent.right) {
    succ = succ.parent;
  }

  // if root was reached, this is the rightmost and there is no previous segment
  if(succ.parent === undefined) {
    return undefined;
  }

  // go up and right
  succ = succ.parent.right;

  // find the leftmost descendent
  while(succ.left) {
    succ = succ.left;
  }

  return succ;
}

Segment.prototype.inOrderList = function() {
  return [this];
}

Segment.prototype.draw = function(left, right, directrix) {
  if(left > right) {console.log("omitted"); return;}
  console.log("segment draw");

  let s = this.site;

  if(directrix - this.site.y < 2) {
    // directrix very close to the site! Don't want to divide by ~zero.
    // TODO: draw vertical line to the rest of beachline
    c.moveTo(s.x, s.y);
    c.lineTo(s.x, s.y-100);
    c.stroke();
  } else {
    let x = left;
    let y = ((x-s.x)**2 + s.y**2 - directrix**2) / (2*(s.y - directrix));

    c.moveTo(x, y);

    while(x < right) {
      x += 3;
      y = ((x-s.x)**2 + s.y**2 - directrix**2) / (2*(s.y - directrix));
      c.lineTo(x, y);
    }

    c.stroke();
  }
}

if(typeof module !== "undefined") {
  module.exports = Segment;
}
