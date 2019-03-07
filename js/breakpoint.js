
function Breakpoint(site1, site2) {
  /* A breakpoint is the point of intersection between the parabolas with site1
   * and site2 as their foci, and with the sweep line as their directrix. */
  this.parent = undefined;
  this.left = undefined;
  this.right = undefined;

  this.s1 = site1;
  this.s2 = site2;

  this.edge = undefined; // for identifying DCEL edges
}

Breakpoint.prototype.compute = function(d) {
  /* This function computes the x-coordinate of the breakpoint between the left
   * and right sites. The parameter d is the y-coordinate of the sweep line, and
   * correspondingly defines the directrix of the parabolic arcs that make up
   * the beach line. The breakpoint is then computed for these two parabolas,
   * and the x-coordinate is returned. */
  let s1 = this.s1;
  let s2 = this.s2;

  let a = s2.y - s1.y;
  let b = 2*(s2.x*(s1.y - d) - s1.x*(s2.y - d));
  let c = s1.x**2 * (s2.y - d) - s2.x**2 * (s1.y - d) + (s1.y - s2.y)*(s1.y - d)*(s2.y - d);

  if(Math.abs(a) < 0.001) { // if a=0, quadratic formula does not apply
    return -c / b;
  }

  let x1 = (-b + Math.sqrt(b**2 - 4*a*c)) / (2*a);
  let x2 = (-b - Math.sqrt(b**2 - 4*a*c)) / (2*a);

  if(s1.x < x1 && x1 < s2.x) {
    return x1;
  } else {
    return x2;
  }
}

Breakpoint.prototype.inOrderList = function() {
  /* This method is used for testing only. It is used for the in-order traversal
   * of a beach line tree, defined in BeachLineTree.js. It works recursively
   * on the left and right subtrees, then joining them in the order left, this,
   * right. */
  let llist = this.left.inOrderList();
  let rlist = this.right.inOrderList();
  return llist.concat([this], rlist);
}

if(typeof module !== "undefined") {
  module.exports = Breakpoint;
}
