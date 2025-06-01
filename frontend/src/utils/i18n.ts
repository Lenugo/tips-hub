import { useI18n } from 'vue-i18n'

export const getCategoryLabel = (category: string): string => {
  const { t } = useI18n()
  return t(`categories.${category}`)
}
