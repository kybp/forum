import { send } from 'h3'

export default defineEventHandler(async (event) => {
  const url = apiUrl(`media/${event.context.params?._}`)

  const response = await $fetch.raw(url, { responseType: 'arrayBuffer' })
  const contentType = response.headers.get('Content-Type') ?? 'text/plain'

  return send(event, Buffer.from(response._data as string), contentType)
})
