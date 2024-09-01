export default defineEventHandler(() => {
  return $fetch<string[]>(apiUrl(`users/themes/`))
})
