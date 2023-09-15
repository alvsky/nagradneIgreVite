<template>
  <q-layout view="hHh lpr fFf">
    <q-header
      elevated
      class="bg-black text-white"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="mdi-menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          Nagradne igre
          <!-- {{ countries.icon }} -->
        </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          class="q-mr-sm"
          :icon="store.global.getters.getCountryIcon()"
          disabled
        />
        <q-btn
          flat
          round
          dense
          icon="mdi-cog-outline"
          class="q-mr-sm"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class=""
      show-if-above
    >
      <div class="drawer-wrapper column fit bg-transparent">
        <q-toolbar
          class="bg-primary text-white shadow-2 col-shrink"
          :style="{border: '3px solid rgba(255,255,255,0.6)'}"
        >
          <q-btn
            flat
            round
            dense
            icon="mdi-arrow-left"
            class="q-mr-sm"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
          <q-toolbar-title>{{ $t('drawerLeftFilter')}}</q-toolbar-title>
        </q-toolbar>
        <div
          class="col-grow bg-grey-2"
          :style="{paddingBottom: '55px'}"
        >
          <q-scroll-area
            class="bg-white fit"
            :style="{borderRight: '3px solid rgba(0,0,0,0.12)'}"
          >
            <q-list>
              <!-- v-ripple -->
              <q-item
                exact
                to="/"
                clickable
                @click="leftDrawerOpen = false"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-home" />
                </q-item-section>

                <q-item-section>
                  <strong>{{ $t('drawerLeftHome')}}</strong>
                </q-item-section>
              </q-item>
              <q-separator />
              <!-- v-ripple -->
              <q-item
                v-for="(xfilter, index) in filters"
                :key="index"
                clickable
                exact
                :to="{ name: 'Home', params: {country: selectedCountry, filter: xfilter.name } }"
                @click="leftDrawerOpen = false"
              >
                <!-- @click="filteredPosts = filter.getFiltered(allPosts)" -->
                <q-item-section avatar>
                  <q-icon name="mdi-magnify" />
                </q-item-section>

                <q-item-section>
                  <!-- {{ $t(section.label) }} -->
                  {{ `${$t(xfilter.label)} (${xfilter.getFiltered(allPosts).length})` }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-drawer>

    <q-drawer
      v-model="rightDrawerOpen"
      show-if-above
      side="right"
    >
      <div class="drawer-wrapper column fit">
        <q-toolbar
          class="bg-primary text-white shadow-2 col-shrink"
          :style="{borderLeft: '1px solid rgba(255,255,255,0.3)'}"
        >
          <q-toolbar-title>{{ $t('drawerRightTitle')}}</q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="mdi-arrow-right"
            class="q-mr-sm"
            @click="rightDrawerOpen = !rightDrawerOpen"
          />
        </q-toolbar>
        <div
          class="col-grow"
          :style="{paddingBottom: '55px'}"
        >
          <q-scroll-area
            class="bg-white fit"
            :style="{borderLeft: '1px solid rgba(0,0,0,0.12)'}"
          >
            <q-list>
              <q-item
                v-for="(section, index) in sections"
                :key="index"
                clickable
                exact
                @click="gotoSettings"
              >
                <q-item-section avatar>
                  <q-icon :name="section.icon" />
                </q-item-section>
                <q-item-section>
                  {{ $t(section.label) }}
                  <!-- {{ section.label }} -->
                </q-item-section>
              </q-item>
              <q-item
                clickable
                exact
                @click="shareNI('shareMe')"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-share-variant-outline" />
                </q-item-section>
                <q-item-section>
                  {{ $t('drawerShare')}}
                </q-item-section>
              </q-item>
              <q-item
                clickable
                exact
                @click="rate"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-star-outline" />
                </q-item-section>
                <q-item-section>
                  {{ $t('drawerRate')}}
                </q-item-section>
              </q-item>
              <q-item
                clickable
                exact
                @click="openMail"
              >
                <!-- @click="share('comment')" -->
                <q-item-section avatar>
                  <q-icon name="mdi-email-outline" />
                </q-item-section>
                <q-item-section>
                  {{ $t('drawerComment')}}
                </q-item-section>
              </q-item>
              <q-item
                clickable
                exact
                @click="gotoPrivacy"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-security" />
                </q-item-section>
                <q-item-section>
                  {{ $t('drawerPrivacy')}}
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <!-- <router-view v-slot="{ Component }">
        <keep-alive>
          <component
            :is="Component"
            :key="$route.fullPath"
          />
        </keep-alive>
      </router-view> -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// /* eslint-disable */
import { ref, inject, computed, watch, onUpdated, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Platform } from 'quasar'
import { useI18n } from 'vue-i18n'
// import { useAdTypes } from 'composables/useAdTypes'
import { useAdmob } from 'boot/admob'

const store = inject('store')
const Share = inject('Share')
const EmailComposer = inject('EmailComposer')
const router = useRouter()
const route = useRoute()
const platform = Platform.is.ios ? 'IOS' : Platform.is.android ? 'ANDROID' : 'spa'

// const adTypes = ref([])
const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)
const countries = store.global.state.countries
const selectedCountry = store.global.state.niSettings.country
const drzava = computed(() => store.global.state.niSettings.drzava)
const selectedCountryIndex = countries.findIndex(el => el.name === selectedCountry)
const disableLang = ref(false)
const loading = ref(countries.map(el => false))
const filters = store.global.state.filters
// const filter = store.global.state.niSettings.filter
const sections = store.settings.state.sections
const allPosts = computed(() => store.global.state.posts)
const filteredPosts = ref(allPosts)
const groupSort = ref('polling')

console.log('selectedCountry', selectedCountry)

const selectCountry = async (country, index) => {
  loading.value[index] = true
  disableLang.value = true
  await store.global.actions.updateHost(country)
  await store.global.actions.updateCountry(country)
  loading.value[index] = false
  disableLang.value = false
  if (route.name === 'Post') {
    router.push({ name: 'Home', params: { country, filter: 'all' } })
  } else {
    router.push({ name: 'Home', params: { country } })
  }

  console.log('--- Mains route params', route.name)
}

const favorites = ref(store.global.state.niSettings.favorites)
// const fvr = ref([])
const isFavorite = ref(false)
const lang = computed(() => store.global.state.niSettings.locale)
const { locale } = useI18n({ useScope: 'global' })
locale.value = lang.value

// console.log('++++ +++ LANG: ', lang.value)
// console.log('++++ +++ LOCALE: ', locale.value)
onMounted(async () => {
  // adTypes.value = await useAdTypes()
})

/*
  +++ AD MOB
*/
console.log('- - - HR_BANNER_AD_ANDROID', process.env.AD_IDS[`HR_BANNER_AD_${platform}`])
// console.log(`process.env.AD_IDS[`${ selectedCountry }_INTERSTITIAL_AD_${ platform }`]`)

const admob = useAdmob()
const authorizationStatus = ref(null)
// const bannerAdHeight = ref(0)

// const bannerAdConfig = computed(() => {
//   const common = {
//     // adId: process.env.AD_IDS[`${selectedCountry}_BANNER_AD_${platform}`],
//     adId: process.env.AD_IDS[`${selectedCountry.toUpperCase()}_BANNER_AD_${platform}`],
//     adSize: 'ADAPTIVE_BANNER'
//     // isTesting: false,
//     // npa: false
//   }
//   return {
//     top: {
//       ...common,
//       position: 'TOP_CENTER',
//       margin: 10
//     },
//     bottom: {
//       ...common,
//       position: 'BOTTOM_CENTER',
//       margin: 0
//     } // * window.devicePixelRatio
//   }
// })

// const interstitialAdConfig = reactive({
//   adId: process.env.AD_IDS[`${selectedCountry.toUpperCase()}_INTERSTITIAL_AD_${platform}`]
//   // isTesting: true,
//   // npa: false
// })

// const bannerAdInit = async (position) => {
//   // console.log('bannerAdInit', bannerAdConfig.value[position])

//   try {
//     // await admob.removeBanner()
//     await admob.showBanner({ ...bannerAdConfig.value[position] })
//   } catch (err) {
//     console.log(err)
//   }
// }

// const interstitialAdInit = async () => {
//   console.log('interstitialAdInit', interstitialAdConfig)
//   // console.log('interstitialAdInit')
//   try {
//     await admob.prepareInterstitial({ ...interstitialAdConfig })
//     // await admob.showInterstitial()
//   } catch (err) {
//     console.log(err)
//   }
// }

// const bannerAdShow = async () => {
//   // bannerAdTogglePadding()
//   await bannerAdInit('bottom')
//   await admob.resumeBanner()
// }

// const bannerAdHide = async () => {
//   await admob.hideBanner()
// }

onMounted(async () => {
  const { status } = await admob.trackingAuthorizationStatus()
  authorizationStatus.value = status
})

onMounted(async () => {
  // admob.addListener('bannerAdSizeChanged', (evt) => {
  //   bannerAdHeight.value = evt.height
  //   // bannerAdTogglePadding()
  //   console.log('Banner Ad size changed', evt)
  // })

  // admob.addListener('interstitialAdShowed', (evt) => {
  //   // isLoading.value = false
  //   console.log('Interstitial Ad showed', evt)
  //   admob.hideBanner()
  // })

  // admob.addListener('interstitialAdLoaded', (evt) => {
  //   // isLoading.value = false
  //   console.log('Interstitial Ad loaded', evt)
  // })

  // admob.addListener('interstitialAdDismissed', (evt) => {
  //   console.log('Interstitial Ad dismissed', evt)
  //   admob.resumeBanner()
  // })
  // await interstitialAdInit()

  // await bannerAdInit('bottom')
})

/*
 --- END AD BOM
*/

onUpdated(() => {
  console.log('UPDATED')
  checkFavorite()
  // }
})

// console.log('--- Mains ROUTE ', route.name)
// console.log('--- Mains route params', route.params.country)
// console.log('--- countries', countries)
// console.log('--- DRŽAVA', drzava)
// console.log('--- DRŽAVA', drzava.value.name)

selectCountry(selectedCountry, selectedCountryIndex)

function gotoSettings () {
  router.push({
    name: 'Settings'
    // params: { country }
  })
}

function gotoPrivacy () {
  window.open('https://nagradnaigra.com.hr/privacy-policy/')
  // router.push({
  //   name: 'Post',
  //   params: {
  //     slug: 'privacy'
  //   }
  // })
}

function rate () {
  console.log('Rate ME')
  window.open('https://play.google.com/store/apps/details?id=com.bn.nagradneigre')
}

watch(() => groupSort.value, () => {
  if (groupSort.value === 'pollling') {
    filteredPosts.value.sort((a, b) =>
      (a.izvlacenje.year > b.izvlacenje.year) ? 1
        : (a.izvlacenje.year === b.izvlacenje.year) ? ((a.izvlacenje.month > b.izvlacenje.month) ? 1 : (a.izvlacenje.month === b.izvlacenje.month) ? ((a.izvlacenje.day > b.izvlacenje.day) ? 1 : -1) : -1) : -1)
  }
  if (groupSort.value === 'winners') {
    filteredPosts.value.sort((a, b) =>
      (a.objava.year > b.objava.year) ? 1
        : (a.objava.year === b.objava.year) ? ((a.objava.month > b.objava.month) ? 1 : (a.objava.month === b.objava.month) ? ((a.objava.day > b.objava.day) ? 1 : -1) : -1) : -1)
  }
})

// function goToHome () {
//   // console.log(filter)
//   router.push({
//     name: 'Home',
//     params: {
//       // country: store.global.niSettings.country,
//       filter: filter
//     }
//   })
// }

// async function addToFavorites () {
//   if (favorites.value != null) {
//     fvr.value = favorites.value
//   }
//   fvr.value.push(route.params.slug)
//   await store.global.methods.updateSetting('favorites', fvr.value)
//   checkFavorite()
// }

// async function removeFromFavorites () {
//   fvr.value = favorites.value
//   const index = fvr.value.indexOf(route.params.slug)
//   if (index > -1) {
//     fvr.value.splice(index, 1)
//   }
//   await store.global.methods.updateSetting('favorites', fvr.value)
//   checkFavorite()
// }

function checkFavorite () {
  if (favorites.value != null) {
    isFavorite.value = favorites.value.includes(route.params.slug)
  } else {
    isFavorite.value = false
  }
}

async function shareNI (type) {
  console.log('SHARE THIS', type)
  let title, text, link
  console.log(Platform.is)

  if (Platform.is.android) {
    if (type === 'comment') {
      title = 'Nagradne igre ' + drzava.value.title + ' - Komentar'
      text = 'Mislim da bi te mogla zanimati ova aplikacija.'
      link = 'https://play.google.com/store/apps/details?id=com.bn.nagradneigre'
    }

    if (type === 'shareMe') {
      title = 'Nagradne igre ' + drzava.value.title + ' - Komentar'
      text = 'Mislim da bi te mogla zanimati ova aplikacija.'
      link = 'https://play.google.com/store/apps/details?id=com.bn.nagradneigre'
    }

    try {
      const result = await Share.share({
        title,
        text,
        url: link, // + '/' + route.params.slug,
        dialogTitle: 'Nagradna igra - Komentar'
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}

function openMail () {
  EmailComposer.open({
    to: ['nagradneigre.portal@gmail.com'],
    // cc: 'erika@mustermann.de',
    // bcc: ['john@doe.com', 'jane@doe.com'],
    subject: 'App komentar - ' + drzava.value.label,
    body: ''
  })
}
</script>
