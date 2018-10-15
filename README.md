# An Implementation of Fortune's algorithm

Created by Jacob Weightman and Griffin Barniskis for COMP 225 - Algorithm Design and Analysis at Macalester College.

## Getting Started

To run this code, simply clone this repository and open the file `index.html`
in your HTML5-compliant browser of choice. This software is also hosted at
[https://jacobdweightman.github.io/fortunes-algorithm/](https://jacobdweightman.github.io/fortunes-algorithm/).

## Overview of Program Structure

Fortune's algorithm maintains 3 data structures as it builds the Voronoi diagram
of the given sites: the state of a sweep line, which passes from the top of the
screen to the bottom of the screen and is maintained as a priority queue of
events (described later) sorted by y-coordinate; the beach line, which
represents the boundary between the constructed part of the Voronoi diagram and
the unconstructed part, and controls the events in the sweep line; and finally,
the Voronoi diagram itself, represented as a doubly-connected edge list (DCEL).

For the sweep line, we used the module [`fastpriorityqueue`](https://www.npmjs.com/package/fastpriorityqueue),
which was a complete implementation of a priority queue with support for custom
comparison functions.

For the beach line, we implemented a custom binary search tree. In this tree,
each of the segments constituting the beach line is a leaf; all of the internal
nodes represent breakpoints, which allow the x-coordinate of the intersection of
two segments to be computed on the fly for a particular position of the sweep
line. Thus, if this tree is balanced, then all of the operations on the beach
line are worst case O(log n). This data structure is the really clever part of
Fortune's algorithm; the speedup over the O(n^3) brute force approach is largely
a result of being able to consider only things happening "on the beach line" and
to do all beach line operations in O(log n) time. the implementation of the
breakpoints (inner vertices of the tree) can be found in `js/breakpoint.js`, and
the implementation of the segments (leaves of the tree) can be found in `js/segment.js`.
The implementation of the tree structure itself can be found in `js/BeachLineTree.js`.

We also created our own implementation of a DCEL. We only needed to implement
methods for adding vertices, splitting faces, and drawing the DCEL, though there
are many more algorithms that make use of DCELs for other planar graph applications.
The code for this can be found in `js/dcel.js`.

There are two kinds of events that are processed by the algorithm: site events
and vertex events. Each of these events have a function that is run when the
algorithm processes the event, and maintains the necessary data to do this and
be modified as needed as the beach line changes. The bulk of the actual logic
for Fortune's algorithm is contained in these methods. These implementations can
be found in `js/site.js` and `js/vertexevent.js`.

Lastly, the main runner methods can be found in `main.js`. the code here sets
up a visualization of the algorithm, and allows the user to step through it by
pressing any button on their keyboard. Note that no changes will appear for the
first few key presses while no part of the Voronoi diagram has been constructed.
