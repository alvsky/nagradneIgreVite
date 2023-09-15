import { boot } from 'quasar/wrappers'
import store from '../store'

export default boot(async ({ app, router }) => {
  app.provide('store', store)
  // console.log(store)
  // store.global.actions.fetchSettings()
  // console.log(store.state.onlineSettings)

  if (!store.global.state.niSettings) {
    store.global.methods.createSettings()
  }
  // if (!store.global.state.onlineSettings) {
  // }
  // if (!store.global.state.niSettings) {
  //   store.global.methods.createSettings()
  // }

  router.beforeEach(async (to, from, next) => {
    const countrySelected = store.global.state.niSettings.country
    if (to.name === 'SelectCountry') {
      if (countrySelected) {
        next({ name: 'Home', params: { country: store.global.state.niSettings.country, filter: 'active' } })
      } else {
        next()
      }
    } else {
      if (countrySelected) {
        // await store.global.actions.fetchPosts(store.global.state.countries.find(el => el.name === countrySelected).host)
        next()
      } else {
        next({ name: 'SelectCountry' })
      }
    }
  })
})
