/* type deliveryCitiesListItemType = {
    cityCode: number
    cityName: string
    cityUuid: string
    country: string
    countryCode: string
    kladr: string
    latitude: number
    longitude: number
    region: string
    subRegion: string
    regionCode: number
    selected?: boolean
} */
type deliveryCitiesListItemType = {
    value: string
    unrestricted_value: string
    data: {
        postal_code: string
        country: string
        country_iso_code: string
        federal_district: string
        region_fias_id: string
        region_kladr_id: string
        region_iso_code: string
        region_type: string
        city_fias_id: string
        city_kladr_id: string
        city_with_type: string
        city_type: string
        city_type_full: string
        city: string
        fias_id: string
        fias_level: string
        fias_actuality_state: string
        kladr_id: string
        geoname_id: string
        capital_marker: string
        okato: string
        oktmo: string
        tax_office: string
        tax_office_legal: string
        geo_lat: string
        geo_lon: string
        qc_geo: string
        settlement: string | null
        settlement_type_full: string | null
        settlement_with_type: string | null
        region: string | null
        region_type_full: string | null
        region_with_type: string | null
        area: string | null
        area_type: string | null
        area_type_full: string | null
        area_with_type: string | null
    }
    selected?: boolean
}
type deliveryCitiesListType = deliveryCitiesListItemType[]

export type { deliveryCitiesListType as default, deliveryCitiesListItemType }
