export default function sendRetailCrmApi(config: any, options: any) {
    return $fetch(`${config.public.BACKEND_BASE_ADDRESS}retailcrm.php`, {
        method: 'POST',
        body: { orderData: options }
    })
}