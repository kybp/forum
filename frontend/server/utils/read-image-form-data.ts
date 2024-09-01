import type { H3Event } from 'h3'

/**
 * Read multipart data from `event` and convert it to a new `FormData`
 * with `Blob` data.
 *
 * This is needed for forwarding image uploads from the Nuxt backend
 * to the Django backend.
 */
export default async (event: H3Event) => {
  const multipartData = await readMultipartFormData(event)
  const formData = new FormData()

  multipartData?.forEach((value) => {
    if (!(value.name && value.data)) return

    const blob = new Blob([value.data], { type: value.type })
    formData.append(value.name, blob)
  })

  return formData
}
