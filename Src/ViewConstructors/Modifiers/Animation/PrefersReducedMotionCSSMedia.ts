


export const PrefersReducedMotionCSSMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
PrefersReducedMotionCSSMedia.addEventListener('change', event => PrefersReducedMotionValue = event.matches);



export let PrefersReducedMotionValue: boolean = PrefersReducedMotionCSSMedia.matches;