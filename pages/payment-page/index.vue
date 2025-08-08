<script setup lang="ts">
import { onMounted, ref } from 'vue'

const paymentLink = ref<string | null>(null)

onMounted(() => {
    paymentLink.value = localStorage.getItem('paymentLink')
    if (paymentLink.value) {
        window.location.href = paymentLink.value
    }
})
</script>

<template>
    <div v-if="!paymentLink">
        <p>Ссылка для оплаты не найдена. Попробуйте оформить заказ заново.</p>
    </div>
    <div v-else>
        <p>Если вы не были автоматически перенаправлены, <a :href="paymentLink" target="_blank">нажмите здесь для перехода к оплате</a>.</p>
    </div>
</template>