/*eslint-disable*/
import { boot } from 'quasar/wrappers'
import { inject } from 'vue'
import { AdMob } from '@capacitor-community/admob'

const admobSym = Symbol('AdMob')

export default boot(async ({ app, router }) => {
  const admobInit = async () => {
    console.log('- - - A D   M O B - - - init')

    const { status } = await AdMob.trackingAuthorizationStatus()
    if (status === 'notDetermined') {
      /**
       * If you want to explain TrackingAuthorization before showing the iOS dialog,
       * you can show the modal here.
       * ex)
       * const modal = await this.modalCtrl.create({
       *   component: RequestTrackingPage,
       * });
       * await modal.present();
       * await modal.onDidDismiss();  // Wait for close modal
       **/
    }
    AdMob.initialize({
      requestTrackingAuthorization: true
      // testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'],
      // initializeForTesting: true
    })
  }
  await admobInit()

  app.config.globalProperties.$AdMob = AdMob
  app.provide(admobSym, AdMob)
})

export const useAdmob = () => {
  const admob = inject(admobSym)
  if (!admob) throw new Error('No Admob!')
  return admob
}
