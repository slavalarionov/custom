import { useRuntimeConfig } from 'nuxt/app'
// import type addressListType from '@/types/address'
import type deliveryCitiesListType from '@/types/deliveryCities'

export default async function (cityName: string = '') {
    const config = useRuntimeConfig()
    const url = `${config.public.BACKEND_BASE_ADDRESS}address.php`
    const options = {
        method: 'POST',
        body: JSON.stringify({
            type: 'city',
            query: cityName.toLowerCase()
        }),
        headers: new Headers({ 'content-type': 'application/json' })
    }

    try {
        const response = await fetch(url, options)
        if (response.ok) {
            const res: deliveryCitiesListType = await response.json()
            return res
        }
    } catch (err) {
        console.log(err)
    }
}
