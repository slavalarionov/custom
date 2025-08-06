import buckleButterflyType from '@/types/buckleButterfly'
import { useRuntimeConfig } from '#imports'
import watchModelsApi from '@/api/watchModelsApi'
import watchStrapsApi from '@/api/watchStrapsApi'
import buckleButterflyApi from '@/api/buckleButterflyApi'
import watchStrapParamsApi from '@/api/watchStrapParamsApi'
import dolyameCreateApi from '@/api/dolyameCreateApi'
import createOrderApi from '@/api/createOrderApi'
import type additionalOptionType from '@/types/additionalOption'
import type { additionalOptionsType } from '@/types/additionalOption'
import type watchModelsType from 'types/watchModels'
import type { singleWatchModelType } from 'types/watchModels'
import type watchModelSizesType from 'types/watchModelSizes'
import type frameColorsType from 'types/frameColors'
import type configuratorSteps from 'types/configuratorSteps'
import type watchStrapsType from 'types/watchStraps'
import type {
    singleWatchStrap,
    strapParamsType,
    strapColorParam
} from 'types/watchStraps'
import type finalImagesListType from '@/types/finalImages'
type promoType = {
    promoFound: boolean
    type: 'percent' | 'ruble'
    discountValue: number
    code: string
}
interface state {
    isLoading: boolean | null
    watchModels: watchModelsType | null
    watchStraps: singleWatchStrap[] | null
    buckleButterfly: buckleButterflyType | null
    currentStepNum: number
    stepsAmount: number
    steps: configuratorSteps
    additionalOption: additionalOptionType | null
    finalImages: finalImagesListType
    completeImage: string | null
    orderPopupVisible: boolean
    productAmount: number
    deliveryPrice: number | null
    closestReadyDate: string
    orderNumber: string | null
    promoCode: string | null
    promoAccepted: boolean
    usedPromo: promoType | null
}
export const useConfiguratorStore = defineStore('configuratorStore', {
    state(): state {
        return {
            isLoading: true,
            watchModels: null,
            watchStraps: null,
            buckleButterfly: null,
            currentStepNum: 1,
            stepsAmount: 4,
            additionalOption: null,
            steps: {
                model: {
                    id: 1,
                    title: 'Ваша модель часов',
                    queryParam: 'watch-model',
                    isChoosen: false,
                    modelName: null,
                    modelSize: null,
                    color: {
                        name: '',
                        code: ''
                    }
                },
                strap: {
                    id: 2,
                    title: 'Выберите модель ремешка',
                    queryParam: 'strap-model',
                    isChoosen: false,
                    strapName: null,
                    strapPrice: null
                },
                strapDesign: {
                    id: 3,
                    title: 'Создайте уникальный дизайн',
                    queryParam: 'strap-design',
                    isChoosen: null,
                    leatherColor: {
                        title: '',
                        name: ''
                    },
                    stitchingColor: {
                        title: '',
                        name: ''
                    },
                    edgeColor: {
                        title: '',
                        name: ''
                    },
                    buckleColor: {
                        title: '',
                        name: ''
                    },
                    adapterColor: {
                        title: '',
                        name: ''
                    },
                    buckleButterflyChoosen: false,
                    price: null
                },
                final: {
                    id: 4,
                    title: 'Добавьте надпись на ремешок',
                    queryParam: 'final',
                    isChoosen: null,
                    additionalOptions: {
                        totalPrice: 0,
                        initials: {
                            choosen: false,
                            price: null,
                            text: null
                        },
                        presentBox: {
                            choosen: false,
                            price: null
                        },
                        postCard: {
                            choosen: false,
                            price: null,
                            text: null
                        }
                    },
                    promo: {
                        code: '',
                        used: false,
                        discountValue: 0,
                        discountValueFull: ''
                    },
                    email: '',
                    phone: '',
                    name: {
                        firstName: '',
                        lastName: '',
                        middleName: ''
                    }
                }
            },
            finalImages: {
                view1: null,
                view2: null,
                view3: null
            },
            completeImage: null,
            orderPopupVisible: false,
            productAmount: 1,
            deliveryPrice: null,
            closestReadyDate: '',
            orderNumber: null,
            promoCode: null,
            promoAccepted: false,
            usedPromo: null
        }
    },
    actions: {
        async getWatchData(): Promise<watchModelsType | null> {
            if (this.watchModels === null) {
                const data = await watchModelsApi()
                await this.getWatchStrapsData()
                this.watchModels = data?.watchModels ? data.watchModels : []
                this.additionalOption = data?.additionalOption
                    ? data.additionalOption
                    : null
                this.steps.final.additionalOptions.initials.price =
                    Number(
                        this.additionalOption?.data.attributes
                            .additional_options[0].option_price
                    ) || null
                this.steps.final.additionalOptions.presentBox.price =
                    Number(
                        this.additionalOption?.data.attributes
                            .additional_options[1].option_price
                    ) || null
                this.steps.final.additionalOptions.postCard.price =
                    Number(
                        this.additionalOption?.data.attributes
                            .additional_options[2].option_price
                    ) || null
                this.isLoading = false
                return data?.watchModels ? data.watchModels : null
            }
            return null
        },
        async getWatchStrapsData() {
            const { watchStraps } = await watchStrapsApi()
            const { buckleButterfly } = await buckleButterflyApi()
            this.buckleButterfly = buckleButterfly || null
            if (watchStraps) {
                this.watchStraps = watchStraps
            }
        },
        async getWatchStrapParams(id: number) {
            this.isLoading = true
            const { params } = await watchStrapParamsApi(id)
            this.isLoading = false
            if (params) {
                const target = this.watchStraps?.find(
                    (strap) => strap.attributes.watch_strap.id === id
                )
                if (target) {
                    Object.assign(target.attributes.watch_strap, params)
                    target.dataFetched = true
                }
            }
        },
        async cardPay(): Promise<void> {
            try {
                const config = useRuntimeConfig()
                const response = await createOrderApi(config, {
                    amount: String(this.totalPriceWithDiscount),
                    purpose: `Заказ ремешка ${this.steps.strap.strapName} для модели ${this.steps.model.modelName}`,
                    paymentMode: ['sbp', 'card', 'tinkoff'],
                    redirectUrl: 'https://slavalarionov.com/success'
                })
                const link =
                    typeof response?.data?.Data?.paymentLink === 'string'
                        ? response.data.Data.paymentLink
                        : undefined

                if (link) {
                    window.open(link, '_blank')
                    this.closeOrderPopup()
                } else {
                    let errorMessage = 'Ошибка оплаты: Что-то пошло не так'
                    if (!response?.success) {
                        if (
                            response &&
                            typeof response === 'object' &&
                            !Array.isArray(response) &&
                            'message' in response &&
                            response.message
                        ) {
                            errorMessage = 'Ошибка оплаты: ' + response.message
                        } else if ('data' in response && response.data) {
                            const errorData = response.data as any
                            if (typeof errorData === 'string') {
                                errorMessage = 'Ошибка оплаты: ' + errorData
                            } else if (errorData.error) {
                                errorMessage = 'Ошибка оплаты: ' + errorData.error
                            } else if (errorData.message) {
                                errorMessage = 'Ошибка оплаты: ' + errorData.message
                            } else if (errorData.errors) {
                                errorMessage = 'Ошибка оплаты: ' + JSON.stringify(errorData.errors)
                            }
                        }
                    }
                    alert(errorMessage)
                }
            } catch (e) {
                alert(
                    'Ошибка оплаты: ' +
                    (e instanceof Error ? e.message : 'Что-то пошло не так')
                )
            }
        },
        dolyamePay(deliveryOptions: {
            deliveryType: string
            deliveryPrice: number
        }) {
            const orderItems = [
                {
                    name: `Ремешок ${this.steps.strap.strapName} для модели ${this.steps.model.modelName}`,
                    quantity: 1,
                    price: this.selectedStrapPrice
                }
            ]
            this.additionalOption?.data.attributes.additional_options.forEach(
                (option) => {
                    option.choosen &&
                        orderItems.push({
                            name: option.option_title,
                            quantity: 1,
                            price: Number(option.option_price)
                        })
                }
            )
            if (
                deliveryOptions.deliveryType !== '' &&
                deliveryOptions.deliveryPrice !== 0
            ) {
                orderItems.push({
                    name: deliveryOptions.deliveryType,
                    quantity: 1,
                    price: Number(deliveryOptions.deliveryPrice)
                })
            }
            const orderData = {
                orderId: this.orderNumber,
                phone: this.steps.final.phone,
                email: this.steps.final.email,
                name: this.steps.final.name,
                amount: this.totalPriceWithDiscount,
                items: orderItems
            }
            const popupWindow = window.open()
            dolyameCreateApi(orderData).then((res) => {
                if (res && !(res instanceof Error)) {
                    if (popupWindow) {
                        popupWindow.location = res.link
                    }
                } else if (popupWindow) {
                    popupWindow.location = 'https://slavalarionov.com/oh-no'
                }
            })
        },
        chooseWatchModel(modelId: number, sizeId: number = 0): void {
            if (this.watchModels) {
                this.watchModels.forEach((item, id) => {
                    item.watch_sizes.forEach((sizeItem) => {
                        sizeItem.choosen = false
                    })
                    if (id === modelId) {
                        item.choosen = true
                        item.watch_sizes[sizeId].choosen = true
                        this.steps.model.modelSize =
                            item.watch_sizes[sizeId].watch_size
                        this.steps.model.modelName = item.model_name
                        if (!item.frame_colors.find((color) => color.choosen)) {
                            this.chooseFrameColor()
                        }
                    } else {
                        item.choosen = false
                    }
                })
            }
        },
        updateSelectedModel(option: string): void {
            if (this.watchModels) {
                for (const item of this.watchModels) {
                    item.watch_sizes.forEach((sizeItem) => {
                        sizeItem.choosen = false
                    })
                    if (item.watch_model_name === option) {
                        item.choosen = true
                        item.watch_sizes[0].choosen = true
                    } else {
                        item.choosen = false
                    }
                }
                if (!this.selectedStrapModel && this.currentStepNum > 2) {
                    this.updateSelectedStrap()
                }
                if (this.selectedWatchModelFrameColors?.length) {
                    this.chooseFrameColor()
                }
            }
        },
        updateWatchModelSize(option: string): void {
            option = option.replace(/\D/g, '')
            if (this.selectedWatchModelAllSizes) {
                for (const item of this.selectedWatchModelAllSizes) {
                    if (option === item.watch_size) {
                        item.choosen = true
                    } else {
                        item.choosen = false
                    }
                }
            }
        },
        updateSelectedFrameColor(option: string): void {
            if (this.selectedWatchModelFrameColors) {
                for (const item of this.selectedWatchModelFrameColors) {
                    if (option === item.color_name) {
                        item.choosen = true
                    } else {
                        item.choosen = false
                    }
                }
            }
        },
        chooseFrameColor(name: string = ''): void {
            if (name === '') {
                if (
                    !this.selectedWatchModel?.frame_colors.find(
                        (color) => color.choosen
                    )
                ) {
                    if (this.selectedWatchModel) {
                        this.selectedWatchModel.frame_colors[0].choosen = true
                    }
                }
            } else {
                this.selectedWatchModel?.frame_colors.forEach((color) => {
                    if (color.color_name === name) {
                        color.choosen = true
                    } else color.choosen = false
                })
            }
        },
        async chooseStrapModel(id: number): Promise<void> {
            if (this.watchStraps) {
                const target = this.watchStraps.find(
                    (strap) => strap.attributes.watch_strap.id === id
                )
                if (target?.choosen === false) {
                    this.watchStraps.forEach((strap) => {
                        strap.choosen = false
                    })
                    target.choosen = true
                    if (!target.dataFetched) {
                        await this.getWatchStrapParams(id)
                    }
                }
                this.steps.strap.isChoosen = true
            }
        },
        async updateSelectedStrap(title: string = ''): Promise<void> {
            if (this.selectedWatchModelStraps) {
                const target =
                    title !== ''
                        ? this.selectedWatchModelStraps.data.find(
                              (item) =>
                                  item.attributes.watch_strap.strap_title ===
                                  title
                          ) || this.selectedWatchModelStraps.data[0]
                        : this.selectedWatchModelStraps.data[0]
                target.choosen = true
                if (!target.dataFetched) {
                    await this.getWatchStrapParams(
                        target.attributes.watch_strap.id
                    )
                }
                if (this.watchStraps) {
                    this.watchStraps.forEach((item) => {
                        item.choosen = false
                    })
                    target.choosen = true
                }
            }
        },
        chooseStrapLeatherColor(title: string): void {
            if (this.selectedStrapModel) {
                this.selectedStrapModel.attributes.watch_strap.leather_colors.forEach(
                    (color) => {
                        color.choosen = color.color_title === title
                    }
                )
            }
        },
        chooseStitchingColor(title: string): void {
            if (this.selectedStrapModel) {
                this.selectedStrapModel.attributes.watch_strap.stitching_colors.forEach(
                    (color) => {
                        color.choosen = color.color_title === title
                    }
                )
            }
        },
        chooseEdgeColor(title: string): void {
            if (this.selectedStrapModel) {
                this.selectedStrapModel.attributes.watch_strap.edge_colors.forEach(
                    (color) => {
                        color.choosen = color.color_title === title
                    }
                )
            }
        },
        chooseBuckleColor(title: string): void {
            if (this.selectedStrapModel) {
                this.selectedStrapModel.attributes.watch_strap.buckle_colors.forEach(
                    (color) => {
                        color.choosen = color.color_title === title
                    }
                )
            }
        },
        chooseBuckleButterfly() {
            if (this.buckleButterfly) {
                const strap = this.watchStraps?.find(
                    (strap) =>
                        strap.attributes.watch_strap.id ===
                        this.selectedStrapModel?.attributes.watch_strap.id
                )
                if (strap) {
                    strap.attributes.watch_strap.buckle_butterfly_choosen =
                        !strap.attributes.watch_strap.buckle_butterfly_choosen
                }
            }
        },
        chooseAdapterColor(title: string): void {
            if (this.selectedStrapModel) {
                this.selectedStrapModel.attributes.watch_strap.adapter_colors.forEach(
                    (color) => {
                        color.choosen = color.color_title === title
                    }
                )
            }
        },
        setFinalImage(view: 1 | 2 | 3, str: string) {
            this.finalImages[`view${view}`] = str
        },
        setCompleteImage(str: string) {
            this.completeImage = str
        },
        showOrderPopup() {
            this.orderPopupVisible = true
        },
        closeOrderPopup() {
            this.orderPopupVisible = false
        },
        increaseProductAmount() {
            this.productAmount++
        },
        decreaseProductAmount() {
            if (this.productAmount > 1) {
                this.productAmount--
            }
        },
        setClosestReadyDate(str: string) {
            this.closestReadyDate = str
        },
        updatePromoCodeValue(str: string) {
            this.promoCode = str
        },
        promoUse(promo: promoType | null) {
            this.promoAccepted = promo !== null
            this.usedPromo = promo
        }
    },
    getters: {
        selectedWatchModel(): singleWatchModelType | null {
            if (this.watchModels) {
                for (const model of this.watchModels) {
                    if (model.choosen) {
                        return model
                    }
                }
                return null
            }
            return null
        },
        isUltraModel(): boolean {
            return !!this.selectedWatchModel?.model_name
                .toLocaleLowerCase()
                .includes('ultra')
        },
        selectedWatchModelAllSizes(): watchModelSizesType | null {
            if (this.selectedWatchModel) {
                return this.selectedWatchModel.watch_sizes
            }
            return null
        },
        selectedWatchModelSize(): watchModelSizesType[0] | null {
            if (this.selectedWatchModelAllSizes) {
                const size =
                    this.selectedWatchModelAllSizes.find(
                        (size) => size.choosen
                    ) || null
                return size
            }
            return null
        },
        selectedWatchModelFrameColors(): frameColorsType | null {
            if (this.selectedWatchModel) {
                return this.selectedWatchModel.frame_colors
            }
            return null
        },
        selectedFrameColor(): frameColorsType[0] | null {
            if (this.selectedWatchModel) {
                const color =
                    this.selectedWatchModel.frame_colors.find(
                        (color) => color.choosen
                    ) || null
                return color
            }
            return null
        },
        selectedWatchModelStraps(): watchStrapsType | null {
            if (this.selectedWatchModel) {
                const res: watchStrapsType = {
                    data: []
                }
                this.watchStraps?.forEach((i) => {
                    const target =
                        this.selectedWatchModel?.watch_straps.data.find(
                            (x) =>
                                x.attributes.watch_strap.strap_name ===
                                i.attributes.watch_strap.strap_name
                        ) || null
                    if (target) {
                        res.data.push(i)
                    }
                })
                return res || null
            }
            return null
        },
        selectedStrapModel(): singleWatchStrap | null {
            if (this.selectedWatchModelStraps) {
                return (
                    this.selectedWatchModelStraps.data.find(
                        (strap) => strap.choosen
                    ) || null
                )
            }
            return null
        },
        selectedStrapFrameColorImages(): any {
            if (this.selectedFrameColor) {
                const view1Image =
                    this.selectedFrameColor.watch_model_color?.data?.attributes?.watch_models_straps_colors?.find(
                        (item) =>
                            item.strap_name ===
                            this.selectedStrapModel?.attributes.watch_strap
                                .strap_name
                    )?.view_1.data.attributes.url || ''
                const view2Image =
                    this.selectedFrameColor.watch_model_color?.data?.attributes?.watch_models_straps_colors?.find(
                        (item) =>
                            item.strap_name ===
                            this.selectedStrapModel?.attributes.watch_strap
                                .strap_name
                    )?.view_2.data.attributes.url || ''
                const obj = {
                    view1: view1Image,
                    view2: view2Image
                }
                return obj
            } else {
                return ''
            }
        },
        selectedStrapModelParams(): strapParamsType | null {
            if (this.selectedStrapModel) {
                return this.selectedStrapModel?.attributes.watch_strap
                    .strap_params
            }
            return null
        },
        selectedLeatherColor(): strapColorParam | null {
            if (this.selectedStrapModel) {
                return (
                    this.selectedStrapModel?.attributes?.watch_strap?.leather_colors?.find(
                        (color) => color.choosen
                    ) || null
                )
            }
            return null
        },
        selectedStitchingColor(): strapColorParam | null {
            if (this.selectedStrapModel) {
                return (
                    this.selectedStrapModel?.attributes?.watch_strap?.stitching_colors?.find(
                        (color) => color.choosen
                    ) || null
                )
            }
            return null
        },
        selectedEdgeColor(): strapColorParam | null {
            if (this.selectedStrapModel) {
                return (
                    this.selectedStrapModel?.attributes?.watch_strap?.edge_colors?.find(
                        (color) => color.choosen
                    ) || null
                )
            }
            return null
        },
        selectedBuckleColor(): strapColorParam | null {
            if (this.selectedStrapModel) {
                return (
                    this.selectedStrapModel?.attributes?.watch_strap?.buckle_colors?.find(
                        (color) => color.choosen
                    ) || null
                )
            }
            return null
        },
        selectedAdapterColor(): strapColorParam | null {
            if (this.selectedStrapModel) {
                return (
                    this.selectedStrapModel?.attributes?.watch_strap?.adapter_colors?.find(
                        (color) => color.choosen
                    ) || null
                )
            }
            return null
        },
        isStrapParamsSelected(): boolean {
            if (this.selectedLeatherColor !== null) {
                return true
            }
            return false
        },
        selectedAdditionalOptions(): additionalOptionsType | null {
            if (this.selectedWatchModel) {
                const arr: additionalOptionsType = []
                this.additionalOption?.data.attributes.additional_options.forEach(
                    (option) => {
                        if (option.choosen) arr.push(option)
                    }
                )
                return arr || null
            }
            return null
        },
        view1Images() {
            const config = useRuntimeConfig()
            const arr: Array<any> = []
            const pushItem = (str: string) => {
                if (str !== '') {
                    const obj = {
                        src: config.public.API_BASE_URL + str
                    }
                    arr.push(obj)
                }
            }
            pushItem(
                !this.isUltraModel
                    ? this.selectedStrapModel?.attributes.watch_strap.view_1
                          ?.main_image?.data?.attributes?.url || ''
                    : this.selectedStrapModel?.attributes.watch_strap.view_1
                          .ultra_main_image.data.attributes.url || ''
            )
            pushItem(this.selectedStrapFrameColorImages.view1)
            pushItem(
                !this.isUltraModel
                    ? this.selectedLeatherColor?.view_1?.data?.attributes.url ||
                          ''
                    : this.selectedLeatherColor?.ultra_view_1.data.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedEdgeColor?.view_1?.data?.attributes.url || ''
                    : this.selectedEdgeColor?.ultra_view_1?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedAdapterColor?.view_1?.data?.attributes.url ||
                          ''
                    : this.selectedAdapterColor?.ultra_view_1?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedBuckleColor?.view_1?.data?.attributes.url ||
                          ''
                    : this.selectedBuckleColor?.ultra_view_1?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedStitchingColor?.view_1?.data?.attributes
                          .url || ''
                    : this.selectedStitchingColor?.ultra_view_1?.data
                          ?.attributes.url || ''
            )
            return arr
        },
        view2Images() {
            const config = useRuntimeConfig()
            const arr: Array<any> = []
            const pushItem = (str: string) => {
                if (str !== '') {
                    const obj = {
                        src: config.public.API_BASE_URL + str
                    }
                    arr.push(obj)
                }
            }
            pushItem(
                !this.isUltraModel
                    ? this.selectedStrapModel?.attributes.watch_strap.view_2
                          ?.main_image?.data?.attributes?.url || ''
                    : this.selectedStrapModel?.attributes.watch_strap.view_2
                          ?.ultra_main_image?.data?.attributes?.url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedLeatherColor?.view_2?.data?.attributes.url ||
                          ''
                    : this.selectedLeatherColor?.ultra_view_2?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedEdgeColor?.view_2?.data?.attributes.url || ''
                    : this.selectedEdgeColor?.ultra_view_2?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedAdapterColor?.view_2?.data?.attributes.url ||
                          ''
                    : this.selectedAdapterColor?.ultra_view_2?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedBuckleColor?.view_2?.data?.attributes.url ||
                          ''
                    : this.selectedBuckleColor?.ultra_view_2?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedStitchingColor?.view_2?.data?.attributes
                          .url || ''
                    : this.selectedStitchingColor?.ultra_view_2?.data
                          ?.attributes.url || ''
            )
            return arr
        },
        view3Images() {
            const config = useRuntimeConfig()
            const arr: Array<any> = []
            const pushItem = (str: string) => {
                if (str !== '') {
                    const obj = {
                        src: config.public.API_BASE_URL + str
                    }
                    arr.push(obj)
                }
            }
            pushItem(
                !this.isUltraModel
                    ? this.selectedStrapModel?.attributes.watch_strap.view_3
                          ?.main_image?.data?.attributes?.url || ''
                    : this.selectedStrapModel?.attributes.watch_strap.view_3
                          ?.ultra_main_image?.data?.attributes?.url || ''
            )
            pushItem(this.selectedStrapFrameColorImages.view2)
            pushItem(
                !this.isUltraModel
                    ? this.selectedLeatherColor?.view_3?.data?.attributes.url ||
                          ''
                    : this.selectedLeatherColor?.ultra_view_3?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedEdgeColor?.view_3?.data?.attributes.url || ''
                    : this.selectedEdgeColor?.ultra_view_3?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedAdapterColor?.view_3?.data?.attributes.url ||
                          ''
                    : this.selectedAdapterColor?.ultra_view_3?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedBuckleColor?.view_3?.data?.attributes.url ||
                          ''
                    : this.selectedBuckleColor?.ultra_view_3?.data?.attributes
                          .url || ''
            )
            pushItem(
                !this.isUltraModel
                    ? this.selectedStitchingColor?.view_3?.data?.attributes
                          .url || ''
                    : this.selectedStitchingColor?.ultra_view_3?.data
                          ?.attributes.url || ''
            )
            return arr
        },
        prevStepQuery(): string | null {
            if (this.currentStepNum - 1 > 0) {
                for (const item in this.steps) {
                    const id = this.steps[item as keyof configuratorSteps].id
                    if (id === this.currentStepNum - 1) {
                        return this.steps[item as keyof configuratorSteps]
                            .queryParam
                    }
                }
                return null
            } else {
                for (const item in this.steps) {
                    const id = this.steps[item as keyof configuratorSteps].id
                    if (id === 1) {
                        return this.steps[item as keyof configuratorSteps]
                            .queryParam
                    }
                }
                return null
            }
        },
        nextStepQuery(): string | null {
            if (this.currentStepNum !== this.stepsAmount) {
                for (const item in this.steps) {
                    const id = this.steps[item as keyof configuratorSteps].id
                    if (id === this.currentStepNum + 1) {
                        return this.steps[item as keyof configuratorSteps]
                            .queryParam
                    }
                }
            }
            return null
        },
        nextStepReady(): boolean {
            const steps = this.steps
            const currentId = this.currentStepNum
            for (const step in steps) {
                const id = steps[step as keyof typeof steps].id
                const isStepChoosen =
                    steps[step as keyof typeof steps].isChoosen
                if (id === currentId && isStepChoosen) {
                    return true
                }
            }
            return false
        },
        currentAvailableStep(): number {
            if (this.steps) {
                let count = 1
                for (const item in this.steps) {
                    const step = this.steps[item as keyof typeof this.steps]
                    if (step.isChoosen) {
                        count++
                    }
                }
                return count
            }
            return 0
        },
        selectedStrapPrice(): number {
            if (this.selectedStrapModel?.attributes) {
                const buckleButterflyPrice =
                    Number(
                        this.selectedStrapModel.attributes.watch_strap
                            .buckle_butterfly_choosen &&
                            this.buckleButterfly?.data.attributes.buckle_price
                    ) || 0
                return (
                    buckleButterflyPrice +
                        this.selectedStrapModel?.attributes.watch_strap.price ||
                    0
                )
            }
            return 0
        },
        selectedStrapPriceWithDiscount(): number {
            const hasDiscount = this.promoAccepted && this.usedPromo
            if (!hasDiscount) {
                return this.selectedStrapPrice
            } else {
                const discount =
                    this.usedPromo?.type === 'percent'
                        ? this.selectedStrapPrice *
                          this.productAmount *
                          (this.usedPromo.discountValue / 100)
                        : this.usedPromo?.discountValue || 0
                return this.selectedStrapPrice - discount > 0
                    ? this.selectedStrapPrice - discount
                    : 0
            }
        },
        additionalOptionsSum(): number {
            if (this.selectedAdditionalOptions) {
                return this.selectedAdditionalOptions.reduce(
                    (acc, item) => acc + Number(item.option_price),
                    0
                )
            }
            return 0
        },
        productsPrice(): number {
            if (
                this.selectedStrapModel !== null &&
                this.selectedAdditionalOptions
            ) {
                return this.selectedStrapPrice + this.additionalOptionsSum
            }
            return 0
        },
        productsPriceWithDiscount(): number {
            if (
                this.selectedStrapModel !== null &&
                this.selectedAdditionalOptions
            ) {
                return (
                    this.selectedStrapPriceWithDiscount +
                    this.additionalOptionsSum
                )
            }
            return 0
        },
        totalPrice(): number {
            return (
                this.selectedStrapPrice +
                this.additionalOptionsSum +
                (this.deliveryPrice || 0)
            )
        },
        totalPriceWithDiscount(): number {
            const hasDiscount = this.promoAccepted && this.usedPromo
            if (!hasDiscount) {
                return this.totalPrice
            } else {
                return (
                    this.selectedStrapPriceWithDiscount +
                    this.additionalOptionsSum +
                    (this.deliveryPrice || 0)
                )
            }
        }
    }
})
