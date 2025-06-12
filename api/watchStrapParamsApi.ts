import cloneDeep from 'lodash/fp/cloneDeep.js'
import watchStrapParams from '@/apollo/query/watchStrapParams.gql'
import { watchStrapDataType } from '@/types/watchStraps'
interface response {
    watchStrap: {
        data: {
            attributes: {
                watch_strap: watchStrapDataType
            }
        }
    }
}
export default async function watchStrapParamsApi(id: number) {
    let result: watchStrapDataType | undefined
    const promise: Promise<{
        params: watchStrapDataType
    }> = new Promise((resolve, reject) => {
        const vars = {
            id
        }
        const { onResult, onError } = useQuery<response>(
            watchStrapParams,
            vars,
            {
                fetchPolicy: 'no-cache'
            }
        )
        onError((error) => {
            console.log(error)
        })
        onResult((res) => {
            const result = cloneDeep(res?.data) || null
            const watchStrap = result.watchStrap.data.attributes.watch_strap
            watchStrap.leather_colors = watchStrap.leather_colors.filter(
                (color) => color.available
            )
            watchStrap.stitching_colors = watchStrap.stitching_colors.filter(
                (color) => color.available
            )
            watchStrap.edge_colors = watchStrap.edge_colors.filter(
                (color) => color.available
            )
            watchStrap.adapter_colors = watchStrap.adapter_colors.filter(
                (color) => color.available
            )
            watchStrap.buckle_colors = watchStrap.buckle_colors.filter(
                (color) => color.available
            )
            if (result) {
                resolve({
                    params: result.watchStrap.data.attributes.watch_strap
                })
            } else reject(new Error('result failed'))
        })
    })
    await promise
        .then((data) => {
            result = data.params
            result.leather_colors.forEach((color) => {
                if (color.default_selected) {
                    color.choosen = true
                } else {
                    color.choosen = false
                }
            })
            result.stitching_colors.forEach((color) => {
                if (color.default_selected) {
                    color.choosen = true
                } else {
                    color.choosen = false
                }
            })
            result.edge_colors.forEach((color) => {
                if (color.default_selected) {
                    color.choosen = true
                } else {
                    color.choosen = false
                }
            })
            result.buckle_colors.forEach((color) => {
                if (color.default_selected) {
                    color.choosen = true
                } else {
                    color.choosen = false
                }
            })
            result.adapter_colors.forEach((color) => {
                if (color.default_selected) {
                    color.choosen = true
                } else {
                    color.choosen = false
                }
            })
            result.strap_params.forEach((param) => {
                param.choosen = false
            })
        })
        .catch((err) => {
            console.log(err)
        })
    return { params: result }
}
