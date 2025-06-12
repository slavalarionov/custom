import { useRuntimeConfig } from 'nuxt/app'
interface payloadType {
    xCorrelationId: string
    orderId: string
}
interface resType {
    status: string
    amount: number
    link: string
}
export default async function (
    payload: payloadType
): Promise<resType | null | Error> {
    if (payload) {
        const config = useRuntimeConfig()
        try {
            const response = await fetch(
                `${config.public.BACKEND_BASE_ADDRESS}dolyame-info.php`,
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
