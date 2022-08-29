import { h } from 'vue'
import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouterView,
} from 'vue-router'
import LeaderBoardPage from '~/pages/LeaderBoardPage.vue'
import TreasuryPage from '~/pages/TreasuryPage.vue'
import PortfolioPage from '~/pages/PortfolioPage.vue'
import StakingV2Page from '~/pages/StakingV2Page.vue'
import StakingApprovePage from '~/pages/StakingApprovePage.vue'
import StakingStakePage from '~/pages/StakingStakePage.vue'
import StakingCurrentStakePage from '~/pages/StakingCurrentStakePage.vue'
import HowToUsePage from '~/pages/HowToUsePage.vue'
import NovoPayPage from '~/pages/NovoPayPage.vue'
import { useStore } from '~/store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Dashboard',
      path: '/',
      component: LeaderBoardPage,
      meta: { title: 'Leaderboard', public: true },
    },
    {
      name: 'Leaderboard',
      path: '/',
      component: LeaderBoardPage,
      meta: { title: 'Leaderboard', public: true },
    },
    {
      name: 'Treasury',
      path: '/treasury',
      component: TreasuryPage,
      meta: { title: 'Treasury', public: true },
    },
    {
      name: 'Portfolio',
      path: '/portfolio',
      component: PortfolioPage,
      meta: { title: 'Portfolio' },
    },
    {
      name: 'StakingV2',
      path: '/stakingv2',
      component: StakingV2Page,
      meta: { title: 'StakingV2' },
    },
    {
      name: 'Staking',
      path: '/staking',
      component: { render: () => h(RouterView) },
      meta: {
        title: 'Staking',
        tabs: [
          {
            page: 'StakingApprove',
            text: 'Approve',
          },
          {
            page: 'StakingStake',
            text: 'Stake',
            disabled: () => {
              const { getters } = useStore()
              return getters.selectedAllowance.value == 0
            },
          },
          {
            page: 'StakingCurrentStake',
            text: 'Current Stake',
            disabled: () => {
              const { getters } = useStore()
              return getters.selectedAllowance.value == 0
            },
          },
        ],
      },
      children: [
        {
          name: 'StakingApprove',
          path: '',
          component: StakingApprovePage,
        },
        {
          name: 'StakingStake',
          path: 'stake',
          component: StakingStakePage,
        },
        {
          name: 'StakingCurrentStake',
          path: 'current-stake',
          component: StakingCurrentStakePage,
        },
      ],
    },
    {
      name: 'BuyNovo',
      path: '/buy-novo',
      component: { render: () => h(RouterView) },
      meta: {
        title: 'Buy Novo',
        tabs: [
          {
            page: 'HowToUse',
            text: 'How To Use',
          },
          {
            page: 'NovoPay',
            text: 'Novo Pay',
          },
        ],
      },
      children: [
        {
          name: 'HowToUse',
          path: '',
          component: HowToUsePage,
        },
        {
          name: 'NovoPay',
          path: 'novo-pay',
          component: NovoPayPage,
        },
      ],
    },
    {
      name: 'Documentation',
      path: '/documentation',
      component: TreasuryPage,
      meta: { title: 'Documentation' },
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const { getters, methods } = useStore()

  if (to.meta.public || getters.isAuthorized.value) return next()

  await methods.authorize()

  if (getters.isAuthorized.value) {
    return await routeAuthorized(to, _from, next)
  } else {
    next({ name: 'Dashboard' })
  }
})

router.beforeResolve(async (to, _from, next) => {
  return await routeAuthorized(to, _from, next)
})

const routeAuthorized = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const { getters } = useStore()

  switch (to.path) {
    case '/staking':
      if (
        _from.path === '/staking/stake' ||
        _from.path === '/staking/current-stake'
      ) {
        next()
      } else if (
        getters.selectedAllowance.value > 0 &&
        getters.selectedCurrentStake.value.amount == 0
      ) {
        next({ path: '/staking/stake' })
      } else if (
        getters.selectedAllowance.value > 0 &&
        getters.selectedCurrentStake.value.amount > 0
      ) {
        next({ path: '/staking/current-stake' })
      } else {
        next()
      }
      break
    case '/staking/stake':
      if (getters.selectedAllowance.value == 0 && _from.name != null) {
        next({ path: '/staking' })
      } else {
        next()
      }
      break
    case '/staking/current-stake':
      if (getters.selectedAllowance.value == 0 && _from.name != null) {
        next({ path: '/staking' })
      } else {
        next()
      }
      break
    default:
      next()
  }
}

export default router
