import axios from 'axios'
import { optionsType } from '~/types/optionsType'

function createOrderMessage(order: optionsType): string {
    return `
Order #${order.orderNumber}
Модель ремешка: ${order.strapModel}
Цвет кожи: ${order.strapLeatherColor}
Модель Apple Watch: ${order.appleWatchModel} (${order.appleWatchModelSize}, ${
        order.appleWatchModelColor
    })
Цвет строчки: ${order.stitchingColor}
Цвет края: ${order.edgeColor}
Цвет пряжки: ${order.buckleColor}
Цвет адаптера: ${order.adapterColor}
Инициалы: ${order.initials.text ? order.initials.text : 'Нет'}
Подарочная коробка: ${order.presentBox.choosen ? 'Да' : 'Нет'}
Открытка: ${order.postCard.choosen ? order.postCard.text : 'Нет'}
Бабочка: ${order.buckleButterfly.choosen ? 'Да' : 'Нет'} 
Комментарий к доставке: ${order.deliveryComment}
Промокод: ${order.promo.code ? order.promo.code : 'Нет'}

Тип доставки: ${order.deliveryType || 'Не указано'}
Город доставки: ${order.deliveryCity || 'Не указано'}
Улица: ${order.deliveryAddressInfo?.street || 'Не указано'}
Дом: ${order.deliveryAddressInfo?.building || 'Не указано'}
Квартира: ${order.deliveryAddressInfo?.appartament || 'Не указано'}
Комментарий к заказу: ${order.deliveryComment || 'Не указано'}
Цена доставки: ${order.deliveryPrice}
Full name: ${order.receiverFullname}
Payment Amount: ${
        order.deliveryPrice
            ? order.totalPrice + order.deliveryPrice
            : order.totalPrice
    } руб.
Payment system: ${order.paymentType}

Purchaser information:
Email: ${order.email}
Телефон: ${order.tel}
`.trim()
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    const { msgContent } = body
    if (!config.public.TELEGRAM_BOT_TOKEN || !config.public.TELEGRAM_CHAT_ID) {
        return { error: 'No telegram credentials' }
    }
    const url = `https://api.telegram.org/bot${config.public.TELEGRAM_BOT_TOKEN}/sendMessage`
    try {
        await axios.post(url, {
            chat_id: config.public.TELEGRAM_CHAT_ID,
            text: createOrderMessage(msgContent),
            parse_mode: 'HTML'
        })
        return { success: true }
    } catch (error) {
        console.error('Ошибка отправки сообщения в Telegram:', error)
        return { error: 'Ошибка отправки сообщения в Telegram' }
    }
})
