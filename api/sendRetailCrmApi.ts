import { optionsType } from '~/types/optionsType'

export default function sendRetailCrmApi(config: any, options: optionsType) {
    return $fetch(`${config.public.BACKEND_BASE_ADDRESS}retailcrm.php`, {
        method: 'POST',
        body: { orderData: options }
    })
}