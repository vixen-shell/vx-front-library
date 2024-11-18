import { BaseApi } from '../api'

export const useLocales = () => {
    return (locale: string, data: (string | number)[] = []) =>
        (BaseApi.locales[locale] || locale).replace(
            /\[(\d+)\]/g,
            (match, index) => {
                const idx = parseInt(index, 10)
                return data![idx] !== undefined ? String(data![idx]) : match
            }
        )
}
