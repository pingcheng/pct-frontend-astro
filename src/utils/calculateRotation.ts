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
  
  const rotateX = Math.max(-5, Math.min(5, (y - centerY) / centerY * -3));
  const rotateY = Math.max(-5, Math.min(5, (x - centerX) / centerX * 3));
  
  return `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}