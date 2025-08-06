export interface CreateOrderResponse {
    success?: boolean
    data?: {
        Data?: {
            paymentLink?: string
        }
        [key: string]: any
    }
    message?: string
    [key: string]: any
}

export default function createOrderApi(
    config: any,
    payload: {
        amount: string
        purpose: string
        paymentMode: string[]
        redirectUrl: string
    }
): Promise<CreateOrderResponse> {
    return $fetch(`${config.public.BACKEND_BASE_ADDRESS}createOrder.php`, {
        method: 'POST',
        body: payload
    })
}