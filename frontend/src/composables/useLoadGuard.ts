import { computed, onUnmounted, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { API_TIMEOUT_MS } from '../utils/api'

export type LoadPhase = 'idle' | 'loading' | 'slow' | 'failed'

export const LOAD_SLOW_MS = 8_000

export function useLoadGuard(
  isLoading: MaybeRefOrGetter<boolean>,
  error: MaybeRefOrGetter<string | null | undefined> = null
) {
  const phase = ref<LoadPhase>('idle')
  let slowTimer: ReturnType<typeof setTimeout> | undefined
  let failTimer: ReturnType<typeof setTimeout> | undefined

  const clearTimers = () => {
    if (slowTimer) clearTimeout(slowTimer)
    if (failTimer) clearTimeout(failTimer)
    slowTimer = undefined
    failTimer = undefined
  }

  const startTimers = () => {
    clearTimers()
    phase.value = 'loading'
    slowTimer = setTimeout(() => {
      if (toValue(isLoading) && phase.value === 'loading') {
        phase.value = 'slow'
      }
    }, LOAD_SLOW_MS)
    failTimer = setTimeout(() => {
      if (toValue(isLoading)) {
        phase.value = 'failed'
      }
    }, API_TIMEOUT_MS)
  }

  watch(
    () => [toValue(isLoading), toValue(error)] as const,
    ([loading, err]) => {
      if (err) {
        clearTimers()
        phase.value = 'failed'
        return
      }

      if (loading) {
        startTimers()
        return
      }

      clearTimers()
      phase.value = 'idle'
    },
    { immediate: true }
  )

  onUnmounted(clearTimers)

  return {
    phase,
    isSlow: computed(() => phase.value === 'slow'),
    isFailed: computed(() => phase.value === 'failed')
  }
}
