import img1 from '../assets/img/img1.png';
import img2 from '../assets/img/img2.png';
import img3 from '../assets/img/img3.png';
import img4 from '../assets/img/img4.png';

export { img1, img2, img3, img4 };

// Map of canonical image filenames/paths to imported bundled assets
const IMAGE_MAP: Record<string, string> = {
  img1: img1,
  img2: img2,
  img3: img3,
  img4: img4,
  'img1.png': img1,
  'img2.png': img2,
  'img3.png': img3,
  'img4.png': img4,
  '/assets/img/img1.png': img1,
  '/assets/img/img2.png': img2,
  '/assets/img/img3.png': img3,
  '/assets/img/img4.png': img4,
  'assets/img/img1.png': img1,
  'assets/img/img2.png': img2,
  'assets/img/img3.png': img3,
  'assets/img/img4.png': img4,
};

/**
 * Resolves any shoe image URL or path to a reliable, bundled asset URL.
 * Also handles legacy paths saved in localStorage.
 */
export function getShoeImage(src: string | undefined): string {
  if (!src) return img1;
  
  // Direct match in map
  if (IMAGE_MAP[src]) {
    return IMAGE_MAP[src];
  }

  // Check if it ends with img1.png, img2.png, etc.
  for (const [key, value] of Object.entries(IMAGE_MAP)) {
    if (src.endsWith(key) || src.includes(key)) {
      return value;
    }
  }

  return src;
}

/**
 * Clean SVG fallback shoe image in case of image network errors.
 */
export const FALLBACK_SHOE_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" fill="none">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <path d="M40 135 C60 135 75 145 100 145 C150 145 220 140 310 148 C340 151 365 145 375 130 C360 115 320 100 290 85 C270 75 250 60 215 50 C180 40 150 48 135 65 C120 82 95 100 65 110 C50 115 42 122 40 135 Z" fill="url(#grad)" />
  <path d="M35 145 C80 145 150 150 250 150 C320 150 365 145 380 138 C375 160 340 165 290 165 C190 165 90 165 30 155 C28 150 30 146 35 145 Z" fill="#0f172a" />
  <path d="M120 75 C145 65 170 60 200 68" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 6" />
  <path d="M130 95 C160 85 190 82 220 88" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 6" />
  <circle cx="280" cy="115" r="14" fill="#ffffff" fill-opacity="0.3" />
</svg>
`);

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  // If it wasn't already fallback, try img1 or svg
  if (!target.src.includes('data:image/svg+xml')) {
    target.src = FALLBACK_SHOE_SVG;
  }
}
