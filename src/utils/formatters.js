export function formatName(name = '') {
  if (!name) return ''
  return name.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}
