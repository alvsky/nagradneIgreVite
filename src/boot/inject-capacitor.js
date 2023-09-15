/* eslint-disable */
import { boot } from 'quasar/wrappers'
// import { Plugins } from '@capacitor/core'
// import { AdSize, AdPosition } from '@capacitor-community/admob'
// const { AdMob } = Plugins
// import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob'

// const { PushNotifications } = Plugins
// const { FCMPlugin } = Plugins
import { FCM } from '@capacitor-community/fcm'
import { PushNotifications } from '@capacitor/push-notifications'
// const { Share } = Plugins
import { Share } from '@capacitor/share'
import { EmailComposer } from 'capacitor-email-composer'

export default boot(async ({ app }) => {
  // app.config.globalProperties.$AdMob = AdMob
  // app.provide('AdMob', AdMob)

  // app.config.globalProperties.$BannerAdSize = BannerAdSize
  // app.provide('BannerAdSize', BannerAdSize)

  // app.config.globalProperties.$BannerAdPosition = BannerAdPosition
  // app.provide('BannerAdPosition', BannerAdPosition)

  // app.config.globalProperties.$BannerAdPluginEvents = BannerAdPluginEvents
  // app.provide('BannerAdPluginEvents', BannerAdPluginEvents)

  app.config.globalProperties.$PushNotifications = PushNotifications
  app.provide('PushNotifications', PushNotifications)

  app.config.globalProperties.$FCM = FCM
  app.provide('FCM', FCM)

  app.config.globalProperties.$Share = Share
  app.provide('Share', Share)

  app.config.globalProperties.$EmailComposer = EmailComposer
  app.provide('EmailComposer', EmailComposer)
})
