import { useRuntimeConfig } from 'nuxt/app'
import type { addressListType } from '@/types/address'
type responseType = addressListType

export default async function (id: string, query: string) {
    const config = useRuntimeConfig()
    const url = `${config.public.BACKEND_BASE_ADDRESS}address.php`
    const options = {
        method: 'POST',
        body: JSON.stringify({
            type: 'building',
            streetFiasId: id,
            query
        }),
        headers: new Headers({ 'content-type': 'application/json' })
    }

    try {
        const response = await fetch(url, options)
        if (response.ok) {
            try {
                const res: responseType = await response.json()
                return res
            } catch (err) {
                console.log(err)
            }
        }
    } catch (err) {
        console.log(err)
    }
}
