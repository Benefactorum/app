export default function deepCleanData (obj: any): any {
  console.log('deepCleanData called with:', obj, 'type:', typeof obj)

  if (Array.isArray(obj)) {
    console.log('Processing array:', obj)
    // Recursively clean arrays and remove empty values
    return obj
      .map(deepCleanData)
      .filter((item) => {
        console.log('Array filter item:', item)
        return item !== undefined &&
          item !== '' &&
          !(typeof item === 'object' && !isFile(item) && Object.keys(item).length === 0)
      })
  } else if (typeof obj === 'object' && obj !== null) {
    console.log('Processing object:', obj)
    // Don't process File objects
    if (isFile(obj)) {
      console.log('Found File/Blob object:', obj)
      return obj
    }
    // Recursively clean objects
    const cleanedObject = Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => {
          console.log('Processing object key:', key, 'value:', value)
          return [key, deepCleanData(value)]
        })
        .filter(([_, value]) => {
          console.log('Object filter value:', value)
          return value !== undefined &&
            value !== '' && value !== null &&
            !(typeof value === 'object' && !isFile(value) && Object.keys(value).length === 0)
        })
    )
    return Object.keys(cleanedObject).length === 0 ? undefined : cleanedObject // Remove empty objects
  }
  console.log('Returning primitive value:', obj)
  return obj // Return other values as-is
}

function isFile (value: any): boolean {
  console.log('isFile check for:', value)
  if (value === null) return false
  return value instanceof File || (typeof value === 'object' && value !== null && value instanceof Blob)
}
