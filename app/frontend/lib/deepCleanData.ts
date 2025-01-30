export default function deepCleanData (obj: any): any {
  if (Array.isArray(obj)) {
    // Recursively clean arrays and remove empty values
    return obj
      .map(deepCleanData)
      .filter((item) =>
        item !== undefined &&
        item !== '' &&
        !(typeof item === 'object' && !isFile(item) && Object.keys(item).length === 0)
      )
  } else if (typeof obj === 'object' && obj !== null) {
    // Don't process File objects
    if (isFile(obj)) {
      return obj
    }
    // Recursively clean objects
    const cleanedObject = Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => [key, deepCleanData(value)])
        .filter(([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(typeof value === 'object' && !isFile(value) && Object.keys(value).length === 0)
        )
    )
    return Object.keys(cleanedObject).length === 0 ? undefined : cleanedObject // Remove empty objects
  }
  return obj // Return other values as-is
}

function isFile (value: any): boolean {
  return value instanceof File || (typeof value === 'object' && value !== null && value instanceof Blob)
}
