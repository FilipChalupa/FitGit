export default function compareProjects(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}