export default function sendTelegramMessageApi(config: any, options: any) {
    return $fetch(`${config.public.BACKEND_BASE_ADDRESS}sendTelegramMessage.php`, {
        method: 'POST',
        body: { msgContent: options }
    })
}