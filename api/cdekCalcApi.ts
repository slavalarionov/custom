import { useRuntimeConfig } from 'nuxt/app'
type responseType = {
    price: number
    minDays: number
    tariffId: number
}[]
export default async function (cityPostalCode: string) {
    if (cityPostalCode) {
        const payload = {
            type: 'calc',
            cityPostalCode: String(cityPostalCode)
        }
        const config = useRuntimeConfig()
        try {
            const response = await fetch(
                `${config.public.BACKEND_BASE_ADDRESS}cdek.php`,
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: new Headers({ 'content-type': 'application/json' })
                }
            )
            if (response.ok) {
                const res: responseType = await response.json()
                return res
            }
        } catch (err: any) {
            console.log(err)
        }
        window.alert(
            'Ошибка при рассчете стоимости доставки, попробуйте открыть форму оформления заказа повторно'
        )
        return null
    }
}
