import { useRuntimeConfig } from 'nuxt/app'
interface response {
    promoFound: boolean
    type: 'percent' | 'ruble'
    discountValue: number
    code: string
}
export default async function (code: string): Promise<response | null | Error> {
    const config = useRuntimeConfig()
    if (code) {
        const payload = {
            code
        }
        try {
            const response = await fetch(
                `${config.public.BACKEND_BASE_ADDRESS}promo.php`,
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: new Headers({ 'content-type': 'application/json' })
                }
            )
            if (response.ok) {
                const res: response = await response.json()
                return res
            }
            return null
        } catch (err: any) {
            console.log(err)
            return err
        }
    } else {
        return null
    }
}
