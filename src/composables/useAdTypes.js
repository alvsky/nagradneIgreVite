import { Platform } from 'quasar'

export const useAdTypes = () => {
  const platform = Platform.is.ios ? 'IOS' : Platform.is.android ? 'ANDROID' : 'spa'

  return {
    BannerAd: {
      slug: 'banner-ad',
      title: 'Banner',
      caption: 'A basic ad that appears at the top & bottom of the screen.',
      icon: 'mdi-page-layout-header-footer',
      color: 'orange',
      adUnitId: process.env.AD_IDS[`BANNER_AD_${platform}`]
    },
    InterstitialAd: {
      slug: 'interstitial-ad',
      title: 'Interstitial',
      caption: 'Full-page ads appear at natural breaks & transitions.',
      icon: 'mdi-cellphone-screenshot',
      color: 'light-green',
      adUnitId: process.env.AD_IDS[`INTERSTITIAL_AD_${platform}`]
    },
    InterstitialVideoAd: {
      slug: 'interstitial-video-ad',
      title: 'Interstitial Video',
      caption: 'Full-page ads appear at natural breaks & transitions.',
      icon: 'mdi-cellphone-screenshot',
      color: 'indigo',
      adUnitId: process.env.AD_IDS[`INTERSTITIAL_VIDEO_AD_${platform}`]
    },
    RewardVideoAd: {
      slug: 'reward-video-ad',
      title: 'Reward Video',
      caption: 'Ads reward users for watching short videos and interaction.',
      icon: 'mdi-video-box',
      color: 'pink',
      adUnitId: process.env.AD_IDS[`REWARDED_AD_${platform}`]
    }
  }
}
