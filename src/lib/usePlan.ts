import { daysBetween, todayISO } from './format'
import { getPlan, planAllows } from './plans'
import { useStore } from './store'
import type { PlanId } from './types'

export function usePlan() {
  const { data } = useStore()
  const subscription = data.subscription
  const plan = getPlan(subscription.plan)
  const used = data.menus.length + data.sites.length
  const limit = plan.menus
  const remaining = limit === null ? Number.POSITIVE_INFINITY : Math.max(0, limit - used)
  const atLimit = limit !== null && used >= limit
  const trialDaysLeft =
    subscription.status === 'trial' && subscription.trialEndsAt
      ? Math.max(0, daysBetween(todayISO(), subscription.trialEndsAt))
      : null
  const active =
    subscription.status === 'active' ||
    (subscription.status === 'trial' && (trialDaysLeft ?? 0) > 0)

  return {
    subscription,
    plan,
    used,
    limit,
    remaining,
    atLimit,
    trialDaysLeft,
    active,
    allows: (required: PlanId) => planAllows(plan.id, required),
  }
}
