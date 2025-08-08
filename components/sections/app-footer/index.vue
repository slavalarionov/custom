<script setup lang="ts">
import yandexDzenIcon from '@/components/icons/yandex-dzen-icon.vue'
import vkIcon from '@/components/icons/vk-icon.vue'
import whatsappIcon from '@/components/icons/whatsapp-icon.vue'
import telegramIcon from '@/components/icons/telegram-icon.vue'
import pinterestIcon from '@/components/icons/pinterest-icon.vue'
</script>

<template>
    <footer :class="s.footer">
        <div :class="[s.footerContainer, 'container']">
            <div :class="s.footerMain">
                <div :class="[s.footerColumn, s.footerOtherMarkets]">
                    <h4 :class="s.footerColumnTitle">Покупайте нас везде!</h4>
                    <div :class="s.footerOtherMarketsLinks">
                        <a
                            href="https://ozon.ru/seller/slava-larionov-215259/?utm_source=ozonfooter&utm_campaign=vendor_org_147975"
                            :class="s.footerOtherMarketsLink"
                        >
                            <img
                                src="@/assets/img/ozon.svg"
                                alt="ozon"
                                :class="s.footerOtherMarketsLinkImage"
                                width="160"
                                height="35"
                            />
                        </a>
                        <a
                            href="https://market.yandex.ru/business--slava-larionov-official-store/2967837?utm_source=yandexmarket-footer"
                            :class="s.footerOtherMarketsLink"
                        >
                            <img
                                src="@/assets/img/yandex-market.svg"
                                alt="ozon"
                                :class="s.footerOtherMarketsLinkImage"
                                width="160"
                                height="30"
                            />
                        </a>
                    </div>
                    <p :class="[s.footerColumnText, s.footerOtherMarketsText]">
                        Часть наших изделий продаётся на маркетплейсах. Там
                        нельзя выбрать опции с кастомизацией, зато можно
                        использовать бонусы и скидки от озона и яндекс.маркета.
                    </p>
                    <a
                        href="https://slavalarionov.com/marketplaces"
                        :class="s.footerOtherMarketsMoreLink"
                        >подробнее об этом</a
                    >
                </div>
                <div :class="[s.footerColumn, s.footerPayment]">
                    <h4 :class="s.footerColumnTitle">Оплата на сайте</h4>
                    <div :class="s.footerPaymentTypes">
                        <div :class="s.footerPaymentTypesItem">
                            <img
                                src="@/assets/img/yandex-pay.svg"
                                alt=""
                                :class="s.footerPaymentTypesItemImage"
                            />
                            <p :class="s.footerPaymentTypesItemText">
                                через аккаунт в Яндекс
                            </p>
                        </div>
                        <div :class="s.footerPaymentTypesItem">
                            <img
                                src="@/assets/img/visa-mastercard-mir.svg"
                                alt=""
                                :class="s.footerPaymentTypesItemImage"
                            />
                            <p :class="s.footerPaymentTypesItemText">
                                выпущенные в России
                            </p>
                        </div>
                    </div>
                    <div :class="s.footerPaymentTextInner">
                        <p :class="[s.footerColumnText, s.footerPaymentText]">
                            После оплаты вам придёт чек об оплате заказа на
                            почту или в смс.
                        </p>
                        <p :class="[s.footerColumnText, s.footerPaymentText]">
                            После мы подтвердим заказ в WhatsApp, в Telegram или
                            на почте.
                        </p>
                    </div>
                </div>
                <div :class="[s.footerColumn, s.footerContact]">
                    <h4 :class="[s.footerColumnTitle, s.footerContactTitle]">
                        Пишите нам в чат на сайте или тут:
                    </h4>
                    <div :class="s.footerContactSocials">
                        <a
                            href="https://zen.yandex.ru/id/6239b8e506547728a365d388"
                            :class="s.footerContactSocialsItem"
                        >
                            <yandex-dzen-icon
                                :class="s.footerContactSocialsItemIcon"
                                hover-color="#4E68F2"
                            />
                        </a>
                        <a
                            href="https://vk.com/slavalarionov.store"
                            :class="s.footerContactSocialsItem"
                        >
                            <vk-icon
                                :class="s.footerContactSocialsItemIcon"
                                hover-color="#4E68F2"
                            />
                        </a>
                        <a
                            href="https://www.pinterest.ru/slavalarionov_store/"
                            :class="s.footerContactSocialsItem"
                        >
                            <pinterest-icon
                                :class="s.footerContactSocialsItemIcon"
                                hover-color="#4E68F2"
                            />
                        </a>
                        <a
                            href="https://t.me/slavalarionovstore"
                            :class="s.footerContactSocialsItem"
                        >
                            <telegram-icon
                                :class="s.footerContactSocialsItemIcon"
                                hover-color="#4E68F2"
                            />
                        </a>
                        <a
                            href="https://wa.me/79957715030"
                            :class="s.footerContactSocialsItem"
                        >
                            <whatsapp-icon
                                :class="s.footerContactSocialsItemIcon"
                                hover-color="#4E68F2"
                            />
                        </a>
                    </div>
                    <p :class="[s.footerColumnText, s.footerContactText]">
                        А так же можете звонить по телефону и писать на почту:
                    </p>
                    <a
                        href="https://wa.me/79957715030"
                        :class="s.footerContactLink"
                        >+7 (995) 771-50-30</a
                    >
                    <a
                        href="mailto:hello@slavalarionov.store"
                        :class="s.footerContactLink"
                        >hello@slavalarionov.store</a
                    >
                </div>
            </div>
            <div :class="s.footerBottom">
                <p :class="s.footerOwner">
                    ©2024 ИП Ларионов Вячеслав Владимирович
                </p>
                <div :class="s.footerBottomInner">
                    <div :class="s.footerBottomCol">
                        <p :class="s.footerInn">ИНН: 550517616144</p>
                        <p :class="s.footerCity">Санкт-Петербург</p>
                    </div>
                    <div :class="s.footerBottomCol">
                        <a
                            href="https://slavalarionov.com/slavalarionovstore/terms"
                            :class="s.footerBottomLink"
                            >Условия использования</a
                        >
                        <a
                            href="https://slavalarionov.com/slavalarionovstore/policy"
                            :class="s.footerBottomLink"
                            >Политика конфиденциальности</a
                        >
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<style lang="scss" module="s">
.footer {
    padding: 100px 0;
    @media (max-width: 850px) {
        padding: 50px 0;
    }
    @media (max-width: 550px) {
        padding: 40px 0;
    }
}
.footerMain {
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 1100px;
    @media (max-width: 850px) {
        max-width: 320px;
        flex-wrap: wrap;
        justify-content: center;
    }
}
.footerColumn {
    flex: 0 0 30%;
    @media (max-width: 850px) {
        flex-basis: 100%;
        margin-top: 80px;
    }
}
.footerOtherMarkets {
    max-width: 300px;
    @media (max-width: 850px) {
        order: 2;
    }
}
.footerColumnTitle {
    font-size: 20px;
    line-height: 32px;
    color: #424242;
    font-weight: 700;
    text-align: center;
    max-width: 220px;
    margin: 0 auto 20px;
}
.footerOtherMarketsLinks {
    margin-top: 25px;
}
.footerOtherMarketsLink {
    display: flex;
    justify-content: center;
    max-width: 160px;
    margin: 0 auto 15px;
    &:last-child {
        margin-bottom: 0;
    }
}
.footerOtherMarketsLinkImage {
    object-fit: cover;
}
.footerColumnText {
    font-size: 14px;
    line-height: 19px;
    font-weight: 500;
    color: #424242;
    width: 100%;
    max-width: 290px;
}
.footerOtherMarketsText {
    margin: 25px auto 0;
}
.footerOtherMarketsMoreLink {
    display: block;
    width: 100%;
    max-width: 150px;
    font-size: 13px;
    line-height: 1.55;
    font-weight: 400;
    text-align: center;
    color: #fafafa;
    margin: 25px auto 0;
    padding: 4px 10px;
    border-radius: 30px;
    background-color: #858585;
    transition: 0.2s ease;
    &:hover {
        background: #616161;
    }
}
.footerPayment {
    @media (max-width: 850px) {
        order: 3;
    }
}
.footerPaymentTypes {
    margin-top: 40px;
}
.footerPaymentTypesItem {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    &:last-child {
        margin-bottom: 0;
    }
    &:nth-child(2) {
        & .footerPaymentTypesItemImage {
            max-width: 150px;
        }
    }
}
.footerPaymentTypesItemImage {
    max-width: 60px;
}
.footerPaymentTypesItemText {
    margin-left: 15px;
    font-size: 14px;
    line-height: 19px;
    font-weight: 500;
    color: #424242;
}
.footerPaymentTextInner {
    margin-top: 30px;
}
.footerPaymentText {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.footerContact {
    max-width: 240px;
    @media (max-width: 850px) {
        order: 1;
        margin-top: 0;
    }
}
.footerContactTitle {
    max-width: 180px;
}
.footerContactSocials {
    display: flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    max-width: 260px;
    margin: 40px auto 0;
}
.footerContactSocialsItem {
    margin-right: 10px;
    width: 100%;
    max-width: 30px;
    max-height: 30px;
    display: block;
    &:first-child {
        max-width: 66px;
    }
    &:last-child {
        margin-right: 0;
    }
}
.footerContactSocialsItemIcon {
    display: block;
    width: 100%;
    height: 100%;
    &:hover {
        & path:first-child {
            fill: #4e68f2;
        }
    }
}
.footerContactText {
    margin: 40px auto 10px;
    max-width: 200px;
    text-align: center;
}
.footerContactLink {
    font-size: 14px;
    display: block;
    line-height: 1.55;
    font-weight: 600;
    text-align: center;
    transition: 0.2s ease;
    &:hover {
        color: #828282;
    }
}
.footerBottom {
    padding-top: 60px;
    color: #424242;
    font-size: 14px;
    line-height: 19px;
    @media (max-width: 850px) {
        max-width: 300px;
        margin: 0 auto;
    }
}
.footerOwner {
}
.footerBottomInner {
    width: 100%;
    max-width: 420px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 20px;
}
.footerBottomCol {
    display: flex;
    flex-direction: column;
    margin-right: 20px;
    &:last-child {
        margin-right: 0;
    }
    @media (max-width: 850px) {
        flex-basis: 100%;
        &:nth-child(n + 2) {
            margin-top: 20px;
        }
    }
}
.footerInn {
}
.footerCity {
}
.footerBottomCol {
}
.footerBottomLink {
}
.footerBottomLink {
}
</style>
