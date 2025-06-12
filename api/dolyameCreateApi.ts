import { useRuntimeConfig } from 'nuxt/app'
interface payloadType {
    orderId: string | null
    phone: string
    email: string
    name: {
        firstName: string
        lastName: string
        middleName: string
    }
    amount: number
    items: {
        name: string
        quantity: number
        price: number
    }[]
}
interface resType {
    status: string
    amount: number
    link: string
    xCorrelationId: string
    orderId: string
}
export default async function (
    payload: payloadType
): Promise<resType | null | Error> {
    if (payload.orderId) {
        const config = useRuntimeConfig()
        try {
            const response = await fetch(
                `${config.public.BACKEND_BASE_ADDRESS}dolyame-create.php`,
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: new Headers({ 'content-type': 'application/json' })
                }
            )
            if (response.ok) {
                const res: resType = await response.json()
                return res
            }
            return null
        } catch (err: any) {
            console.log(err)
            return err
        }
    }
    return null
}
