function BeachLineTree() {
  this.leaves = 0;
  this.root = undefined;
}

BeachLineTree.prototype.setRoot = function(site) {
  this.root = new Segment(site);
}

BeachLineTree.prototype.isEmpty = function() {
  /* Returns true if there are no segments on the beach line. */
  return this.root === undefined;
}

BeachLineTree.prototype.findAbove = function(site) {
  /* Return the segment on the beach line above the given site. */
  let node = this.root;

  // traverse to leaf
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
  /* Insert a new segment for the given site into the beach line, splitting the
   * given segment (should be above it) into two pieces (if the tree is not
   * empty). On the tree, this creates two new breakpoints in the place of the
   * leaf, with the three segments as new leaves. An array of the three new
   * segments is returned, in left to right order. */

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
   while(node === node.parent.right) { // TODO: handle root. Not really an issue since if the root is a leaf there aren't enough segments on the beach line for a vertex event.
     node = node.parent;
   }
   node.parent.s1 = leftmost.site;

   // update node with segment as its right comparison
   node = segment;
   while(node === node.parent.left) { // TODO: handle root
     node = node.parent;
   }
   node.parent.s2 = rightmost.site;

   // promote sibling to replace parent
   sibling.parent = segment.parent.parent;

   if(segment.parent === segment.parent.parent.left) {
     segment.parent.parent.left = sibling;
   } else {
     segment.parent.parent.right = sibling;
   }

   // allow removed segment to be garbage collected
   /* TODO: fix memory leak! */
   /*segment.parent.parent = undefined;

   if(segment === segment.parent.left) {
     segment.parent.left = undefined;
   } else {
     segment.parent.right = undefined;
   }

   segment.parent = undefined;*/
}

/* TODO: remove! */
BeachLineTree.prototype.traverse = function() {
  this.root.traverse();
}
