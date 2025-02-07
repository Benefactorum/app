// Generic helper function: takes an array of MIME types and returns an array of allowed format strings.
export default function getAllowedFormats (mimeTypes: string[]): string {
  return mimeTypes.map((mimeType) => {
    // Remove 'image/' prefix and any '+xml' suffix, then convert to uppercase.
    const format = mimeType.split('/')[1].replace('+xml', '')
    return format.toUpperCase()
  }).join(', ')
}

// Example usage:
// const allowedFormats = getAllowedFormats(['image/svg+xml', 'image/png', 'image/webp'])
// console.log(allowedFormats) // Output: "SVG, PNG, WEBP"
