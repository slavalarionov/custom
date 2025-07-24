import axios from 'axios'
import { optionsType } from '~/types/optionsType'

/**
 * Sends a message to a Telegram chat using the Telegram Bot API.
 * @returns {Promise<void>} - A promise that resolves when the message is sent.
 * @param order
 */

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

interface sendTelegramMessageParams {
    msgContent: optionsType
    telegramToken?: string
    telegramChatId?: string
}

export default async function sendTelegramMessage(
    params: sendTelegramMessageParams
): Promise<void> {
    const { msgContent, telegramToken, telegramChatId } = params
    if (!telegramToken || !telegramChatId) {
        return
    }
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`
    try {
        await axios.post(url, {
            chat_id: telegramChatId,
            text: createOrderMessage(msgContent),
            parse_mode: 'HTML'
        })
    } catch (error) {
        console.error('Ошибка отправки сообщения в Telegram:', error)
    }
}
