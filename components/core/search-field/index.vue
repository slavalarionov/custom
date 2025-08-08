<script setup lang="ts">
import { ref, type Ref, watch, type ComputedRef } from 'vue'
import inputField from '@/components/UI/input-field.vue'
const props = defineProps<{
    isLoading: boolean
    title?: string
    placeholder?: string
    emptyResultText?: string
    isResultEmpty: boolean | null
    modelValue: string
    type?: 'filter'
    readonly?: boolean
    errorMessage?: string
    isValid?: boolean
}>()
const emit = defineEmits([
    'requestEnter',
    'fieldInput',
    'menuItemSelect',
    'fieldChange',
    'update:modelValue'
])
const searchValue: Ref<string> = ref('')
const inputRef = ref<InstanceType<typeof inputField>>()
const inputFocused: Ref<boolean> = ref(false)
const searchMenuVisible: ComputedRef<boolean> = computed(() => {
    return !!(
        (searchValue.value.length || props.type === 'filter') &&
        inputFocused.value
    )
})
const onInputChange = () => {
    emit('fieldChange', searchValue.value)
}
const onInput = (e: InputEvent) => {
    searchValue.value = (e.target as HTMLInputElement).value || ''
    clearTimeout(searchTimeout.value)
    searchTimeout.value = setTimeout(() => {
        emit('requestEnter', searchValue.value)
    }, 300)
    emit('update:modelValue', searchValue.value)
    emit('fieldInput', searchValue.value)
}
const searchTimeout: Ref<any> = ref(null)
const onFocus = () => {
    inputFocused.value = true
}
const onBlur = () => {
    inputFocused.value = false
}
const searchResultEmpty = computed(() => {
    return props.isResultEmpty && searchMenuVisible.value
})
const onItemClick = () => {
    inputRef.value?.$el.querySelector('input').blur()
    clearTimeout(searchTimeout.value)
    emit('menuItemSelect')
}
watch(
    () => props.modelValue,
    (value: string) => {
        searchValue.value = value || ''
    }
)
</script>

<template>
    <div :class="s.fieldWrapper">
        <input-field
            ref="inputRef"
            v-model="searchValue"
            :title="props.title || ''"
            :placeholder="props.placeholder || ''"
            :readonly="props.readonly"
            :error-message="props.errorMessage"
            :is-valid="props.isValid"
            :class="[s.inputField, s.orderDeliveryfield]"
            @focus="onFocus"
            @blur="onBlur"
            @change="onInputChange"
            @input="onInput"
            @click.prevent.stop
        />
        <data-loader
            :visible="props.isLoading"
            :class="s.dataLoaderSpinner"
            type="small"
            :border-colors="['#cccccc', '#4E68F2']"
        />
        <transition name="fade-up">
            <div
                v-if="searchMenuVisible"
                :class="s.searchMenu"
                @mousedown.prevent
                @click="onItemClick"
            >
                <p v-if="searchResultEmpty" :class="s.searchMenuEmptyText">
                    {{ props.emptyResultText }}
                </p>
                <slot name="menuItems"></slot>
            </div>
        </transition>
    </div>
</template>

<style lang="scss" module="s">
.fieldWrapper {
    position: relative;
}
.dataLoaderSpinner {
    position: absolute;
    top: 50%;
    right: 20px;
    left: auto;
    transform: translate(0, -50%);
}
.inputField {
}
.searchMenu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: fit-content;
    max-height: 240px;
    overflow-y: auto;
    overflow-x: hidden;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    border-radius: 0 0 10px 10px;
    z-index: 1000;
    &Item {
        cursor: pointer;
        padding: 12px 20px;
        transition: 0.2s ease;
        &:first-child {
            // padding-top: 20px;
        }
        &:last-child {
            // padding-bottom: 20px;
        }
        &:hover {
            background: #e6e6e6;
        }
    }
    &EmptyText {
        padding: 12px 20px;
    }
    &ItemName {
        font-size: 18px;
        line-height: 24px;
    }
    &ItemOther {
        display: flex;
        align-items: center;
    }
    &ItemSubRegion {
        font-size: 14px;
        line-height: 1;
    }
    &ItemRegion {
        font-size: 16px;
        line-height: 1;
    }
    &ItemCountry {
        font-size: 16px;
        line-height: 1;
    }
}
</style>
