import { optionsType } from '~/types/optionsType'

export default function sendTelegramMessageApi(config: any, options: optionsType) {
    return $fetch(`${config.public.BACKEND_BASE_ADDRESS}sendTelegramMessage.php`, {
        method: 'POST',
        body: { msgContent: options }
    })
}