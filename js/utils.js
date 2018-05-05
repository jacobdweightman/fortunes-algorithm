function cross(a, b, c) {
  /* returns double the signed area of triangle abc. If abc is directed ccw
   * the area is positive, if abc is directed cw the area is negative, and if
   * abc are colinear the area is zero. */
   return (b.x - a.x)*(c.y - a.y) - (c.x - a.x)*(b.y - a.y);
}
