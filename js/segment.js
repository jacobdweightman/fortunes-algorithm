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

/* TODO: remove! */
Segment.prototype.traverse = function() {
  //console.log(this.site.x, this.site.y);
  console.log(this);
}
