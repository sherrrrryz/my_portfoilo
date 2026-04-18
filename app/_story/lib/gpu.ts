// Tag elements that are heavily animated (parallax, scrubbed transforms) with this
// class. Promotes to its own compositor layer — fixes iOS/Safari jank on transform-
// driven scroll animations. Paired CSS lives in app/_story/styles/flashlight.css.
export const GPU = 'gpu';
