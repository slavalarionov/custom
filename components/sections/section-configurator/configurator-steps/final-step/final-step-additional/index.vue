<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
const configuratorStore = useConfiguratorStore()
const additionalOptions = computed(() => {
    return configuratorStore.additionalOption?.data.attributes
        .additional_options
})
const initialsText: Ref<string> = ref('')
const postCardText: Ref<string> = ref('')
watch(initialsText, (val: string) => {
    configuratorStore.steps.final.additionalOptions.initials.text = val
})
watch(postCardText, (val: string) => {
    configuratorStore.steps.final.additionalOptions.postCard.text = val
})
</script>

<template>
    <div :class="s.additional">
        <div
            v-for="(option, idx) in additionalOptions"
            :key="idx"
            :class="[
                s.additionalOption,
                {
                    [s.choosen]: option.choosen,
                    [s.captionOption]:
                        option.option_name === 'initials' ||
                        option.option_name === 'postcard'
                }
            ]"
        >
            <div
                :class="s.additionalOptionField"
                @click="option.choosen = !option.choosen"
            >
                <div :class="s.additionalOptionInner">
                    <div :class="s.additionalOptionTitle">
                        {{ option.option_title }}
                    </div>
                    <div :class="s.additionalOptionPrice">
                        + {{ option.option_price }}₽
                    </div>
                </div>
                <input
                    v-if="option.option_name === 'initials'"
                    v-model="initialsText"
                    :class="s.captionOptionInput"
                    placeholder="А.А."
                    :maxlength="4"
                    @click.prevent.stop
                />
                <textarea
                    v-else-if="option.option_name === 'postcard'"
                    v-model="postCardText"
                    :class="[s.captionOptionInput, s.postCardInput]"
                    placeholder="Надпись"
                    @click.prevent.stop
                ></textarea>
                <div :class="s.additionalOptionPlus">+</div>
            </div>
            <div :class="s.additionalOptionImageInner">
                <img
                    :src="
                        $config.public.API_BASE_URL +
                        option.option_image.data.attributes.url
                    "
                    alt=""
                    :class="s.additionalOptionImage"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" module="s">
.additional {
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    margin-top: 120px;
    @media (max-width: 1200px) {
        flex-direction: column;
        max-width: 700px;
        margin: 70px auto 0;
    }
}
.additionalOption {
    flex: 1 1 auto;
    max-width: 440px;
    margin-right: 20px;
    &:last-child {
        margin-right: 0;
    }
    &.choosen {
        & .additionalOptionField {
            border-color: $secondary-color;
        }
        & .additionalOptionPlus {
            color: $secondary-color;
        }
    }
    &.captionOption {
        &.choosen {
            & .additionalOptionInner {
                display: none;
            }
            & .captionOptionInput {
                display: block;
            }
        }
    }
    @media (max-width: 1200px) {
        width: 100%;
        max-width: none;
        margin: 0;
        &:nth-child(n + 2) {
            margin-top: 56px;
        }
    }
}
.additionalOptionField {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 19px 34px;
    min-height: 100px;
    border-radius: 20px;
    border: 1px solid #d0d0d0;
    transition: 0.2s ease;
    cursor: pointer;
    &:hover {
        border-color: #9e9e9e;
    }
    @media (max-width: 750px) {
        padding: 17px 28px;
    }
}
.additionalOptionInner {
    width: 100%;
    max-width: 250px;
}
.additionalOptionTitle {
    font-size: 24px;
    font-weight: 300;
    line-height: normal;
    color: #656565;
    @media (max-width: 750px) {
        font-size: 20px;
    }
}
.additionalOptionPrice {
    font-size: 20px;
    font-weight: 300;
    line-height: 25px;
    color: #656565;
    margin-top: 5px;
    @media (max-width: 750px) {
        font-size: 16px;
        line-height: 20px;
    }
}
.captionOptionInput {
    width: 100%;
    max-width: 120px;
    font-size: 16px;
    padding: 9px 16px;
    color: #949494;
    border-radius: 1px;
    border: 1px dashed #a9a9a9;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.1) inset;
    display: none;
}
.postCardInput {
    resize: none;
    width: 100%;
    max-width: 220px;
}
.additionalOptionPlus {
    font-size: 34px;
    font-weight: 300;
    line-height: 1;
    color: #949494;
}
.additionalOptionImageInner {
    width: 100%;
    min-height: 256px;
    margin-top: 36px;
    border-radius: 20px;
    background-color: #f6f6f6;
    overflow: hidden;
    @media (max-width: 750px) {
        width: 100%;
        max-width: none;
        margin-top: 15px;
        min-height: 200px;
    }
}
.additionalOptionImage {
    width: 100%;
}
</style>
