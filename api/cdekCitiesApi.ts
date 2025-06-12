import { useRuntimeConfig } from 'nuxt/app'
type responseType = {
    cityCode: number
    cityName: string
    cityUuid: string
    country: string
    countryCode: string
    kladr: string
    latitude: number
    longitude: number
    region: string
    subRegion: string
    regionCode: number
}[]
export default async function (cityName: string) {
    const config = useRuntimeConfig()
    if (cityName) {
        const payload = {
            type: 'cities-list',
            name: cityName
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
                const res: responseType = await response.json()
                return res
            }
        } catch (err) {
            console.log(err)
        }
        return null
    }
}
