import createOrder from './createOrder'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await createOrder(body)
})
