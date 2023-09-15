/* eslint-disable */
import { boot } from 'quasar/wrappers'

export default boot(async ({ app }) => {
  app.provide('AdMob', false)
  app.provide('BannerAdSize', false)
  app.provide('BannerAdPosition', false)
  app.provide('BannerAdPluginEvents', false)
  app.provide('PushNotifications', false)
  app.provide('FCM', false)
  app.provide('Share', false)
  app.provide('EmailComposer', false)
})
