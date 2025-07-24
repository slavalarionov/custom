import axios from 'axios'
import { CreateOrderParams, CreateOrderResult } from '~/types/orderTypes'

const createOrder = async (
    params: Partial<CreateOrderParams>
): Promise<CreateOrderResult> => {
    const config = useRuntimeConfig()
    const url = 'https://enter.tochka.com/uapi/acquiring/v1.0/payments'

    const data = {
        Data: {
            customerCode: config.public.TOCHKA_CUSTOMER_CODE,
            amount: params.amount,
            purpose: params.purpose,
            paymentMode: params.paymentMode,
            redirectUrl: params.redirectUrl,
            merchantId: config.public.TOCHKA_MERCHANT_ID
        }
    }

    try {
        const response = await axios.post<unknown>(url, data, {
            headers: {
                Authorization: `Bearer ${config.public.TOCHKA_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })
        return { success: true, data: response.data }
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                status: error.response.status,
                data: error.response.data
            }
        } else {
            return { success: false, message: (error as Error).message }
        }
    }
}

export default createOrder
