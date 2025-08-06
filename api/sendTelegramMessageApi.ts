import { useRuntimeConfig } from 'nuxt/app'
export default async function (formData: FormData) {
    if (formData) {
        const payload = {
            formData
        }
        const config = useRuntimeConfig()
        try {
            const response = await fetch(
                `${config.public.BACKEND_BASE_ADDRESS}sendTelegramMessage.php`,
                {
                    method: 'POST',
                    body: payload.formData
                }
            )
            if (response.ok) {
                return 'success'
            }
            return null
        } catch (err) {
            console.log(err)
            return err
        }
    }
}