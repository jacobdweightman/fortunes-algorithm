var count = 0;

function Breakpoint(site1, site2) {
  /* A breakpoint is the point of intersection between the parabolas with site1
   * and site2 as their foci, and with the sweep line as their directrix. It is
   * assumed that site1.x < site2.x. */
  this.parent = undefined;
  this.left = undefined;
  this.right = undefined;
  this.count = count;
  count++;

  this.s1 = site1;
  this.s2 = site2;

  this.edge = undefined; // for identifying DCEL edges
}

Breakpoint.prototype.compute = function(d) {
  /* Compute x-coordinate of the breakpoint between left and right sites. */
  let s1 = this.s1;
  let s2 = this.s2;

  let a = s2.y - s1.y;
  let b = 2*(s2.x*(s1.y - d) - s1.x*(s2.y - d));
  let c = s1.x**2 * (s2.y - d) - s2.x**2 * (s1.y - d) + (s1.y - s2.y)*(s1.y - d)*(s2.y - d);
  //let a = 1/(s1.y-d) - 1/(s2.y-d);
  //let b = -2*(s1.x/(s1.y-d) - s2.x/(s2.y-d));
  //let c = s1.y - s2.y;

  if(Math.abs(a) < 0.001) { // if a=0, quadratic formula does not apply
    console.log("a = 0");
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

/* TODO: remove! */
Breakpoint.prototype.traverse = function() {
  this.left.traverse();
  console.log(this.count);
  this.right.traverse();
}
