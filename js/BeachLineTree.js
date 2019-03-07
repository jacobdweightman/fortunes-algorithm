// import dependencies for node, or leave untouched for browser
Segment = typeof module !== "undefined" ? require('../js/segment.js') : Segment;
Breakpoint = typeof module !== "undefined" ? require('../js/breakpoint.js') : Breakpoint;

function BeachLineTree() {
  /* This is a tree data structure used to represent the current state of the
   * beach line. As the sweep line progresses, segments are added and removed
   * from this structure according to the site and vertex events that occur.
   *
   * The beach line tree stores the segments that make up the beach line. Each
   * leaf corresponds to a segment on the beach line, and each internal vertex
   * corresponds to an intersection between the segments represented by its
   * rightmost left descendent and leftmost right descendent (a breakpoint). We
   * traverse the tree using a modified binary search, where we move left if the
   * point in question is to the left of the intersection point of the current
   * node, or to the right if it is to the right. */
  this.leaves = 0;
  this.root = undefined;
}

BeachLineTree.prototype.setRoot = function(site) {
  /* Used to set the root of the tree before there are any segments on it. This
   * takes the site which is the focus (in the sense of conic sections) of the
   * first segment. */
  this.root = new Segment(site);
}

BeachLineTree.prototype.isEmpty = function() {
  /* Returns true if there are no segments on the beach line. */
  return this.root === undefined;
}

BeachLineTree.prototype.findAbove = function(site) {
  /* Given a site, this function returns the segment on the beach line that is
   * directly above that given site. This assumes the sweep line is at the
   * y-coordinate of the site. This is done using a modified binary search. for
   * each breakpoint from root to leaf, we check if the site is to the left or
   * right of the breakpoint. */
  let node = this.root;

  // If the site being checked is left of the breakpoint go left, otherwise
  // go right.
  while(node instanceof Breakpoint) {
    if(site.x < node.compute(site.y)) {
      node = node.left;
    } else {
      node = node.right;
    }
  }

  return node;
}

BeachLineTree.prototype.split = function(segment, site) {
  /* This function inserts a new segment corresponding to the given site into
   * the beach line, splitting the given segment into two pieces on either side
   * (if the tree is not empty). On the tree, this creates two new breakpoints
   * in the place of the leaf, with the three segments as new leaves. An array
   * of the three new segments is returned, in left to right order. */

   // create new subtree
   let nb1 = new Breakpoint(segment.site, site);
   let nb2 = new Breakpoint(site, segment.site);

   let ns1 = new Segment(segment.site, nb1);
   let ns2 = new Segment(site, nb2);
   let ns3 = new Segment(segment.site, nb2);

   nb1.parent = segment.parent;
   nb1.left = ns1;
   nb1.right = nb2;

   nb2.parent = nb1;
   nb2.left = ns2;
   nb2.right = ns3;

   // update events involving segment
   let ll = segment.prev();
   if(ll && ll.event) {
     ll.event.c = ns1;
   }

   let rr = segment.next();
   if(rr && rr.event) {
     rr.event.a = ns3;
   }

   // attach new subtree in place of cut segment
   if(segment !== this.root) {
     if(segment === segment.parent.left) {
       segment.parent.left = nb1;
     } else {
       segment.parent.right = nb1;
     }
   } else {
     this.root = nb1;
   }

   segment.parent = undefined;

   // No need to modify breakpoint sites further up the tree, because the sites
   // associated with the leftmost and rightmost segments of the new subtree
   // are unchanged.
   return [nb1.left, nb2.left, nb2.right];
}

BeachLineTree.prototype.remove = function(segment) {
  /* removes the given segment from the beachline. This is done by clipping the
   * leaf and walking up to the root, fixing site references on the encountered
   * breakpoints. */

   // each segment is the left segment of one breakpoint and the right segment
   // of one breakpoint. if s is a segment and bp is a breakpoint, then bp.s1
   // is s iff the path between them is LRR...R. Similarly, bp.s2 is s iff the
   // path between them is RLL...L.

   // get sibling of clipped leaf
   let sibling;
   if(segment === segment.parent.left) {
     sibling = segment.parent.right;
   } else {
     sibling = segment.parent.left;
   }

   // get leftmost child of sibling
   let leftmost = sibling;
   while(leftmost.left !== undefined) {
     leftmost = leftmost.left;
   }

   // get rightmost child of sibling
   let rightmost = sibling;
   while(rightmost.right !== undefined) {
     rightmost = rightmost.right;
   }

   // update node with segment as its left comparison
   let node = segment;
   while(node === node.parent.right) {
     node = node.parent;
   }
   node.parent.s1 = segment.prev().site;//leftmost.site; CHANGED

   // update node with segment as its right comparison
   node = segment;
   while(node === node.parent.left) {
     node = node.parent;
   }
   node.parent.s2 = segment.next().site;//rightmost.site; CHANGED

   // promote sibling to replace parent
   sibling.parent = segment.parent.parent;

   if(segment.parent === segment.parent.parent.left) {
     segment.parent.parent.left = sibling;
   } else {
     segment.parent.parent.right = sibling;
   }
}

BeachLineTree.prototype.inOrderList = function() {
  /* Returns a list containing the in-order traversal of the beach line tree. */
  if(this.root) {
    return this.root.inOrderList();
  } else {
    return [];
  }
}

BeachLineTree.prototype.draw = function(sweepLineY) {
  /* Used for visualizing the beach line. sweepLineY represents the y-coordinate
   * of the sweepline, which determines how "wide" the arcs of the beachline
   * are. */
   console.log("beachline draw");

   c.strokeStyle = "#F00";

   let order = this.inOrderList();
   for(let i=0; i<order.length; i++) {
     if(order[i] instanceof Breakpoint) {
       if(order[i].s1 != order[i-1].site) console.log("PROBLEM TO THE LEFT");
       if(order[i].s2 != order[i+1].site) console.log("PROBLEM TO THE RIGHT");
       continue;
     }

     let left = 0, right = 800;

     if(i >= 1) {
       if(!(order[i-1] instanceof Breakpoint)) console.log("NOT A BREAKPOINT!");
       left = order[i-1].compute(sweepLineY);
     }

     if(i < order.length-1) {
       right = order[i+1].compute(sweepLineY)
     }
     //console.log("left: ", left);
     //console.log("right: ", right);
     order[i].draw(left, right, sweepLineY);
   }
};

if(typeof module !== "undefined") {
  module.exports = BeachLineTree;
}
