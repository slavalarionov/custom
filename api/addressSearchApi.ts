import { useRuntimeConfig } from 'nuxt/app'
import type addressListType from '@/types/address'
type responseType = addressListType

export default async function (query: string, cityName: string = '') {
    const config = useRuntimeConfig()
    const url = `${config.public.BACKEND_BASE_ADDRESS}address.php`
    const options = {
        method: 'POST',
        body: JSON.stringify({
            type: 'street',
            query,
            cityName: cityName.toLowerCase()
        })
    }

    try {
        const response = await fetch(url, options)
        if (response.ok) {
            const res: responseType = await response.json()
            return res
        }
    } catch (err) {
        console.log(err)
    }
}
