/**
 * Utility functions for handling images in the application
 */

/**
 * Handles image loading errors by providing a data URI fallback image
 * @param event - The error event from the img element
 * @param type - The type of image (product or template)
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>, 
  type: 'product' | 'template'
): void => {
  const target = event.target as HTMLImageElement;
  target.onerror = null; // Prevent infinite error loop
  
  // Generate a data URI for a colorful placeholder based on image type
  if (type === 'product') {
    // Light blue placeholder for products
    target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20fill%3D%22%23a8d8ff%22%20width%3D%22300%22%20height%3D%22200%22%2F%3E%3Ctext%20fill%3D%22%23555%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2216%22%20x%3D%22150%22%20y%3D%22100%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EProduct%20Image%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E';
  } else {
    // Light purple placeholder for design templates
    target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20fill%3D%22%23d8a8ff%22%20width%3D%22300%22%20height%3D%22200%22%2F%3E%3Ctext%20fill%3D%22%23555%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2216%22%20x%3D%22150%22%20y%3D%22100%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EDesign%20Template%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E';
  }
}