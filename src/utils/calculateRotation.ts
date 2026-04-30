/** Maximum rotation angle in degrees */
const MAX_ROTATION_DEG = 5;

/** Intensity multiplier for rotation calculation */
const ROTATION_INTENSITY = 3;

/**
 * Calculate 3D rotation for an element based on mouse position
 * @param mouseX Mouse X position
 * @param mouseY Mouse Y position
 * @param rect Element's bounding rectangle
 * @returns Transform string for CSS
 */
export function calculateRotation(
  mouseX: number,
  mouseY: number,
  rect: DOMRect
): string {
  const x = mouseX - rect.left;
  const y = mouseY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = Math.max(-MAX_ROTATION_DEG, Math.min(MAX_ROTATION_DEG, (y - centerY) / centerY * -ROTATION_INTENSITY));
  const rotateY = Math.max(-MAX_ROTATION_DEG, Math.min(MAX_ROTATION_DEG, (x - centerX) / centerX * ROTATION_INTENSITY));
  
  return `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}