export default defineEventHandler(async (event) => {
  const formData = await readImageFormData(event)
  const Authorization = getRequestHeader(event, 'Authorization')!

  return $fetch<string[]>(apiUrl('threads/post-images/'), {
    method: 'POST',
    body: formData,
    headers: { Authorization },
  })
})
