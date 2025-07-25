import axios from 'axios'
import type { optionsType } from '~/types/optionsType'
import { RetailCrmOrder } from '@/types/RetailCRM'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const orderData: optionsType = body.orderData

    if (
        !config.public.RETAIL_CRM_API_TOKEN ||
        !config.public.RETAIL_CRM_API_URL
    ) {
        return { error: 'No retailCRM credentials' }
    }

    // Формируем объект заказа для RetailCRM
    const order: RetailCrmOrder = {
        number: orderData.orderNumber,
        firstName: orderData.receiverFullname,
        email: orderData.email,
        phone: orderData.tel,
        promoCode: orderData.promo?.code,
        delivery: {
            code: 'cdek-pvz',
            cost: orderData.deliveryPrice,
            address: {
                region: orderData.deliveryCity,
                city: orderData.deliveryCity,
                street: orderData.deliveryAddressInfo?.street,
                building: orderData.deliveryAddressInfo?.building,
                housing: orderData.deliveryAddressInfo?.appartament,
                test: orderData.deliveryComment
            }
        },
        items: [
            {
                productName:
                    orderData.strapModel +
                    ' ' +
                    orderData.appleWatchModel +
                    ' ' +
                    orderData.appleWatchModelSize +
                    'мм',
                quantity: 1,
                initialPrice: orderData.totalPrice,
                properties: [
                    {
                        name: 'Цвет кожи',
                        value: orderData.strapLeatherColor || 'Не выбран'
                    },
                    {
                        name: 'Цвет строчки',
                        value: orderData.stitchingColor || 'Не выбран'
                    },
                    {
                        name: 'Цвет края',
                        value: orderData.edgeColor || 'Не выбран'
                    },
                    {
                        name: 'Цвет пряжки',
                        value: orderData.buckleColor || 'Не выбран'
                    },
                    {
                        name: 'Цвет адаптера',
                        value: orderData.adapterColor || 'Не выбран'
                    },
                    {
                        name: 'Инициалы',
                        value: orderData.initials.choosen
                            ? orderData.initials.text
                            : 'Нет'
                    },
                    {
                        name: 'Подарочная коробка',
                        value: orderData.presentBox.choosen ? 'Да' : 'Нет'
                    },
                    {
                        name: 'Открытка',
                        value: orderData.postCard.choosen
                            ? orderData.postCard.text
                            : 'Нет'
                    },
                    {
                        name: 'Бабочка',
                        value: orderData.buckleButterfly.choosen ? 'Да' : 'Нет'
                    },
                    {
                        name: 'Комментарий к доставке',
                        value: orderData.deliveryComment || ''
                    },
                    { name: 'Промокод', value: orderData.promo?.code || 'Нет' }
                ]
            }
        ],
        summ: orderData.totalPrice
    }

    const params = new URLSearchParams()
    params.append('apiKey', String(config.public.RETAIL_CRM_API_TOKEN))
    params.append('order', JSON.stringify(order))

    try {
        await axios.post(String(config.public.RETAIL_CRM_API_URL), params)
        return { success: true }
    } catch (error: any) {
        console.error(
            'RetailCRM API error:',
            error?.response?.data || error.message
        )
        return {
            error:
                error?.response?.data?.errorMsg ||
                error?.message ||
                'Ошибка сервера RetailCRM'
        }
    }
})
