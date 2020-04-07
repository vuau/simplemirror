export const fillCommand = (obj1, obj2) => {
  const merged = {}
  for (const key in obj1) {
    merged[key] = {
      ...obj1[key],
      command: obj2[key].command
    }
  }
  console.log('merged', merged)
  return merged
}
