/* Breakpoint test */

// equal y-coordinate - should be halfway between sites
let B = new BeachLineTree();
B.setRoot(new Site(100, 100));
B.split(B.root, new Site(300, 100));
B.root.compute(120);

// unequal y-coordinate - should be closer to y=200 site.
let B = new BeachLineTree();
B.setRoot(new Site(100, 100));
B.split(B.root, new Site(300, 200));
B.root.compute(220);


/*  */
let B = new BeachLineTree();
B.setRoot(new Site(150, 150));
let s1 = new Site(600, 200);
B.split(B.findAbove(s1), s1);
s1 = new Site(350, 300);
B.split(B.findAbove(s1), s1);
let a = B.findAbove(new Site(0, 325));
console.assert(a.site.x === 150 && a.site.y === 150); // test BeachLineTree.findAbove
let a = B.findAbove(new Site(0, 325));
console.assert(a.site.x === 150 && a.site.y === 150);
let a = B.findAbove(new Site(0, 325));
console.assert(a.site.x === 150 && a.site.y === 150);
a = a.next();
console.assert(a.site.x === 350 && a.site.y === 300); // test VertexEvent.next
a = a.next();
console.assert(a.site.x === 150 && a.site.y === 150);
a = a.next();
console.assert(a.site.x === 600 && a.site.y === 200);
a = a.next();
console.assert(a.site.x === 150 && a.site.y === 150);
a = a.prev();
console.assert(a.site.x === 600 && a.site.y === 200); // test VertexEvent.prev
a = a.prev();
console.assert(a.site.x === 150 && a.site.y === 150);
a = a.prev();
console.assert(a.site.x === 350 && a.site.y === 300);
a = a.prev();
console.assert(a.site.x === 150 && a.site.y === 150);
