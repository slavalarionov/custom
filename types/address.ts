type addressListItemType = {
    data: {
        city: string
        city_type: string
        city_type_full: string
        city_with_type: string
        country: string
        country_iso_code: string
        federal_district: string
        house: number
        house_type: string
        house_type_full: string
        house_fias_id: string
        house_kladr_id: string
        settlement: string
        settlement_fias_id: string
        settlement_kladr_id: string
        settlement_type: string
        settlement_type_full: string
        settlement_with_type: string
        postal_code: number
        geo_lat: number
        geo_lon: number
        block: number
        region: string
        region_type: string
        region_type_full: string
        region_with_type: string
        street: string
        street_fias_id: string
        street_kladr_id: string
        street_type: string
        street_type_full: string
        street_with_type: string
        fias_id: string
        tax_office: string
        tax_office_legal: string
    }
    selected: boolean
    value: string
    unrestricted_value: string
}
type addressListType = addressListItemType[]

export type { addressListType as default, addressListItemType }
