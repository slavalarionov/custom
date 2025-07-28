// import { cloneDeep } from 'lodash'
import watchStrapsType from '../types/watchStraps'
import watchModelsType from '../types/watchModels'
import watchModelSizesType from '../types/watchModelSizes'
import frameColorsType from '../types/frameColors'
import watchAngles from '../types/watchAngles'

import additionalOptionType from '../types/additionalOption'
import watchModelsQuery from '@/apollo/query/watchModels.gql'
interface watchModels {
    data: {
        attributes: {
            watch_model: {
                model_name: string
                watch_model_name: string
                watch_model_manufacturer: string
                main_image: {
                    data: {
                        attributes: {
                            url: string
                        }
                    }
                }
                watch_sizes: watchModelSizesType
                frame_colors: frameColorsType
                watch_straps: watchStrapsType
                watch_angles: watchAngles
                choosen: boolean
                is_available: boolean
            }
        }
    }[]
}
interface response {
    watchModels: watchModels
    additionalOption: additionalOptionType
}
export default async function watchModelsApi() {
    let result:
        | {
              watchModels: watchModelsType
              additionalOption: additionalOptionType
          }
        | undefined
    const promise: Promise<{
        watchModels: watchModelsType
        additionalOption: additionalOptionType
    }> = new Promise((resolve, reject) => {
        const { onResult, onError } = useQuery<response>(watchModelsQuery)
        onError((error) => {
            console.log(error)
        })
        onResult((e) => {
            const result = cloneDeep(e.data)
            if (result) {
                const watchModels = result.watchModels.data.map((item) => {
                    return item.attributes.watch_model
                })
                watchModels.forEach((item, idx, arr) => {
                    if (item.is_available === false) {
                        arr.splice(idx, 1)
                    }
                    item.watch_sizes.forEach((size) => {
                        size.choosen = false
                    })
                    item.frame_colors.forEach((color) => {
                        color.choosen = false
                    })
                    item.watch_straps.data.forEach((strap) => {
                        strap.choosen = false
                    })
                    item.choosen = false
                })
                const additionalOption = result.additionalOption
                resolve({ watchModels, additionalOption })
            } else {
                reject(new Error('some-error'))
            }
        })
    })
    await promise.then((data) => {
        result = data
    })
    return result
}
