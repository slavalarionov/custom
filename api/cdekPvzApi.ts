import { useRuntimeConfig } from 'nuxt/app'
import type deliveryPointsListType from '@/types/deliveryPoints'
export default async function (cityPostalCode: string) {
    const config = useRuntimeConfig()

    if (cityPostalCode) {
        const payload = {
            type: 'pvz-list',
            cityPostalCode
        }
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
                const res: deliveryPointsListType = await response.json()
                return res
            }
        } catch (err) {
            console.log(err)
        }
        return null
    }
}
