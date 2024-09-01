export default (path: string): string => {
  return `${import.meta.env.VITE_API_HOST}${path}`
}
