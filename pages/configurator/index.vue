<script setup lang="ts">
import { onMounted } from 'vue'
import deliveryInfoApi from '@/api/deliveryInfoApi'
import { useConfiguratorStore } from '@/store/configuratorStore'
const configuratorStore = useConfiguratorStore()
const router = useRouter()
const configuratorStepsArr = computed(() => {
    return configuratorStore.steps
})
const steps = ref(configuratorStore.steps)
const currentStepNum = ref(configuratorStore.currentStepNum)
for (const item in steps.value) {
    const stepItem = steps.value[item as keyof typeof steps.value]
    if (stepItem.id === currentStepNum.value) {
        router.push({ query: { step: stepItem.queryParam } })
    }
}
const route = useRoute()
const getCurrentStep = () => {
    for (const item in configuratorStepsArr.value) {
        const parent = configuratorStepsArr.value
        if (
            parent[item as keyof typeof parent].queryParam === route.query.step
        ) {
            configuratorStore.currentStepNum =
                parent[item as keyof typeof parent].id
            return
        } else if (
            parent[item as keyof typeof parent].queryParam === '' &&
            route.query.step === undefined
        ) {
            configuratorStore.currentStepNum = 1
            return
        }
    }
}
getCurrentStep()
watch(
    () => route.query,
    () => {
        getCurrentStep()
    }
)
const isLoading = computed(() => {
    return configuratorStore.isLoading
})
useHead({
    script: [
        {
            src: 'https://widget.cloudpayments.ru/bundles/cloudpayments.js',
            type: 'text/javascript',
            tagPosition: 'head',
            defer: true,
            tagPriority: 'low'
        },
        {
            src: 'https://cdn.jsdelivr.net/gh/cdek-it/widget@latest/dist/cdek-widget.umd.js',
            type: 'text/javascript',
            tagPosition: 'head',
            defer: true,
            tagPriority: 'low'
        }
    ]
})
onMounted(async () => {
    if (!configuratorStore.watchModels) {
        router.push({
            query: { step: configuratorStore.steps.model.queryParam }
        })
        configuratorStore.isLoading = true
        Promise.allSettled([configuratorStore.getWatchData()])
    }
    const res = await deliveryInfoApi()
    if (res) {
        const date = new Date(
            res.deliveryInfo.data.attributes.closest_delivery_date
        )
        const options = {
            month: 'long',
            day: 'numeric'
        }
        const dateString = date.toLocaleDateString('ru-RU', options)
        configuratorStore.setClosestReadyDate(dateString)
    }
})
</script>

<template>
    <div :class="s.page">
        <transition name="fade">
            <section-configurator />
        </transition>
        <data-loader :class="s.loader" :visible="isLoading === true" />
    </div>
</template>
<style lang="scss" module="s">
.page {
    position: relative;
    min-height: 100vh;
}
</style>
