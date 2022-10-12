import {keyword, range} from "./options.js";

export function maybeFacet({fx, fy, facet = "auto"} = {}) {
  if (facet === null || facet === false) return null;
  if (facet === true) facet = "include";
  return {x: fx, y: fy, method: keyword(facet, "facet", ["auto", "include", "exclude"])};
}

// facet filter, by mark
export function filterFacets(facets, {fx, fy}, facetChannels) {
  const vx = fx != null ? fx.value : facetChannels?.fx?.value;
  const vy = fy != null ? fy.value : facetChannels?.fy?.value;
  if (!vx && !vy) return;
  const index = range(vx || vy);
  return facets.map(({x, y}) => {
    let I = index;
    if (vx) I = I.filter((i) => facetKeyEquals(vx[i], x));
    if (vy) I = I.filter((i) => facetKeyEquals(vy[i], y));
    return I;
  });
}

// test if a value equals a facet key
export function facetKeyEquals(a, b) {
  return a instanceof Date && b instanceof Date ? +a === +b : a === b;
}

// This must match the key structure of facets
export function facetTranslate(fx, fy) {
  return fx && fy
    ? ({x, y}) => `translate(${fx(x)},${fy(y)})`
    : fx
    ? ({x}) => `translate(${fx(x)},0)`
    : ({y}) => `translate(0,${fy(y)})`;
}
