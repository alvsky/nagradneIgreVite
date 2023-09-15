<template>
  <q-page class="flex">
    <div
      class="page-wrapper column self-stretch"
      style="width: 100%;"
    >
      <q-toolbar class="bg-primary text-white shadow-2 col-shrink">
        <q-toolbar-title
          v-if="!showSearch"
          class="col-8 text-subtitle1 "
        >
          {{ selectedFilter.label }}
        </q-toolbar-title>
        <!-- {{appExit}} -->
        <!-- <q-btn
          flat
          round
          dense
          class="q-mr-sm"
          icon="mdi-close"
          @click="bannerAdShow"
        /> -->
        <!-- <q-btn
          flat
          round
          dense
          class="q-mr-sm"
          icon="mdi-close"
          @click="bannerAdHide"
        /> -->
        <q-btn
          flat
          round
          dense
          class="q-mr-sm"
          icon="mdi-refresh"
          @click="selectCountry(drzava.name)"
        />
        <q-input
          v-if="showSearch"
          v-model="filterKeyword"
          debounce="500"
          class="text-white"
          placeholder="Pretraži nagradne igre"
          type="search"
          dense
          outlined
          color="green"
          bg-color="white"
          @keyup.enter="filterByTheKeyword"
        >
          <template #prepend>
            <q-icon
              name="mdi-magnify"
              @click="filterByTheKeyword"
            />
          </template>
          <template #append>
            <q-btn
              v-if="filterKeyword !== ''"
              :disable="filterKeyword === ''"
              round
              dense
              flat
              @click="clear()"
            >
              <q-icon
                size="1.5rem"
                name="mdi-close"
                class="text-primary"
                :class="[filterKeyword === '' ? 'text-grey-5' : 'text-primary']"
              />
            </q-btn>
          </template>
        </q-input>
        <q-space />
        <q-btn
          round
          dense
          flat
          @click="showSearch = !showSearch, filterKeyword = ''"
        >
          <q-icon
            v-if="showSearch"
            size="1.5rem"
            name="mdi-cancel"
            class="text-red"
          />
          <q-icon
            v-if="!showSearch"
            size="1.5rem"
            name="mdi-magnify"
          />
        </q-btn>
        <q-btn
          flat
          round
          dense
          class="q-mr-sm"
          icon="mdi-sort"
          @click="setSortDialog(true)"
        />

      </q-toolbar>
      <div
        class="col-grow bg-grey-2"
        :style="{paddingBottom: '63px'}"
      >
        <!-- :style="{paddingBottom: `${bannerHeight}px`}" -->
        <!-- :style="{paddingBottom: `${bannerAdTogglePadding()+3}px`}" -->
        <!-- :style="{paddingBottom: '55px'}" -->

        <q-scroll-area class="fit">
          <div
            v-if="filteredPosts.length !== 0"
            class="bg-grey-2 q-gutter-md q-pa-md"
          >
            <q-card
              v-for="(post) in filteredPosts"
              :key="post.id"
              class="q-pa-sm "
              :class="new Date(post.kraj.year + '-' + post.kraj.month + '-' + post.kraj.day) < new Date() ? 'bg-grey' : ''"
              clickable
              @click="selectNI(post.id, post.title, post.slug, post.content, post.featured_image.large)"
            >
              <img :src="post.featured_image.large">
              <q-card-section class="text-h6 q-pa-xs">
                <div
                  class="text-h6"
                  style="line-height: 1.3;"
                >
                  <!-- v-if="checkFavorite()" -->
                  <q-icon
                    v-if="checkFavorite(post.slug)"
                    name="mdi-heart"
                  />

                  {{ post.title }}
                </div>
                <div
                  v-if="filterName !== 'active' && filterName !== 'ending'"
                  class="row text-caption text-left bg-grey-4 q-pl-xs"
                >
                  Objava dobitnika: {{ post.objava.day }}.{{ post.objava.month }}.{{ post.objava.year }}.
                  <br> Izvlacenje: {{ post.izvlacenje.day }}.{{ post.izvlacenje.month }}.{{ post.izvlacenje.year }}.<br>
                </div>
                <div
                  v-if="filterName === 'ending'"
                  class="row text-caption text-left bg-grey-4 q-pl-xs"
                >
                  Datum završetka: {{ post.kraj.day }}.{{ post.kraj.month }}.{{ post.kraj.year }}.<br>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div
            v-else
            class="bg-grey-2 q-gutter-md q-pa-md"
          >
            <q-card class="q-pa-sm ">
              <q-card-section class="text-h6 q-pa-xs">
                <div class="text-h6 text-center text-red">
                  U ovoj kategoriji nema nagradnih igara
                </div>

              </q-card-section>
            </q-card>
          </div>
        </q-scroll-area>
      </div>
    </div>
    <!-- Sortiranje -->
    <q-dialog v-model="sortiranje">
      <q-card
        style="width: 300px"
        class="q-px-sm q-pb-md"
      >
        <q-toolbar>
          <q-icon
            name="mdi-sort"
            size="sm"
          />

          <q-toolbar-title>{{ $t('sortiranje') }}</q-toolbar-title>
        </q-toolbar>
        <q-item-label header>
          {{ $t('sortUvjet') }}
        </q-item-label>
        <q-card-section dense>
          <q-option-group
            v-model="groupSort"
            :options="sortOptions"
            type="radio"
          />
        </q-card-section>
        <q-item-label header>
          {{ $t('sortSmjer') }}
        </q-item-label>
        <q-item dense>
          <q-item-section>
            <q-option-group
              v-model="groupDirection"
              :options="sortDirection"
              type="radio"
            />
          </q-item-section>
        </q-item>
        <div class="q-px-sm" />
        <q-card-section class="text-center">
          <q-btn
            color="primary"
            icon="check"
            :label="$t('sortApply')"
            @click="sortNI(groupSort, groupDirection)"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Suglasnost -->
    <q-dialog
      v-model="suglasnost"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="text-purple text-bold">
        <q-card-section>
          <div class="text-h6">{{ $t('consentSettingsLabel')}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ $t('consentUvod')}}
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ $t('consentPitanje')}}
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-option-group
            :options="npaOptions"
            type="radio"
            v-model="admobNPA"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ $t('consentSettings')}}
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ $t('consentPolicy')}} <a
            href="https://nagradnaigra.com.hr/privacy-policy/"
            class="q-pt-none text-blue"
            style="font-color: black"
          > {{ $t('consentPolicyLink')}}</a>!
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-checkbox
            v-model="terms"
            color="secondary"
            :label="$t('consentAccept')"
            true-value="yes"
            false-value="no"
          />
        </q-card-section>
        <q-card-section>
          <q-btn
            color="primary"
            :label="$t('consentNastavi')"
            :disabled="terms === 'no' ? true : false"
            v-close-popup
            @click="saveSuglasnost()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
// /* eslint-disable */
import { ref, reactive, inject, computed, watch, onMounted } from 'vue' // eslint-disable-line
import { useRoute, useRouter } from 'vue-router' // eslint-disable-line
import { Platform, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAdmob } from 'boot/admob'

const PushNotifications = inject('PushNotifications') // uključiti
const FCM = inject('FCM') // uključiti

// const platform = Platform.is.ios ? 'IOS' : Platform.is.android ? 'ANDROID' : 'spa'
const store = inject('store')
// const store = useStore()
const route = useRoute()
const quasar = useQuasar()
const router = useRouter() // eslint-disable-line
const i18n = useI18n({})
const admob = useAdmob()
// const bannerAdHeight = ref(0)
// const bannerHeight = computed(() => store.global.state.niSettings.bannerHeight)
const platform = Platform.is.ios ? 'IOS' : Platform.is.android ? 'ANDROID' : 'spa'
const selectedCountry = store.global.state.niSettings.country
const consent = computed(() => store.global.state.niSettings.suglasnost)
// const suglasnost = ref(false)
const suglasnost = ref(false)

const interstitialAdConfig = reactive({
  adId: process.env.AD_IDS[`${selectedCountry.toUpperCase()}_INTERSTITIAL_AD_${platform}`]
  // isTesting: true,
  // npa: false
})

const interstitialAdInit = async () => {
  console.log('HOME - interstitialAdInit', interstitialAdConfig)
  // console.log('interstitialAdInit')
  try {
    await admob.prepareInterstitial({ ...interstitialAdConfig })
    // await admob.showInterstitial()
  } catch (err) {
    console.log(err)
  }
}

const interstitialAdShow = async () => {
  await admob.showInterstitial()
}

// const bannerAdTogglePadding = (height) => {
//   console.log('BANNER height', height)
//   // bannerHeight.value = height
// }

// const bannerAdShow = async () => {
//   // bannerAdTogglePadding()
//   // await bannerAdInit('bottom')
//   console.log('SHOW -- bannerAdShow')

//   await admob.resumeBanner()
// }

// const bannerAdHide = async () => {
//   console.log('HIDE -- bannerAdShow')
//   await admob.hideBanner()
// }

const bannerAdConfig = computed(() => {
  const common = {
    // adId: process.env.AD_IDS[`${selectedCountry}_BANNER_AD_${platform}`],
    adId: process.env.AD_IDS[`${selectedCountry.toUpperCase()}_BANNER_AD_${platform}`],
    adSize: 'ADAPTIVE_BANNER'
    // isTesting: false,
    // npa: false
  }
  return {
    top: {
      ...common,
      position: 'TOP_CENTER',
      margin: 10
    },
    bottom: {
      ...common,
      position: 'BOTTOM_CENTER',
      margin: 0
    } // * window.devicePixelRatio
  }
})

const bannerAdInit = async (position) => {
  // console.log('bannerAdInit', bannerAdConfig.value[position])

  try {
    // await admob.removeBanner()
    if (consent.value === true) {
      console.log('INIT consent.value', consent.value)
      await admob.showBanner({ ...bannerAdConfig.value[position] })
      // bannerAdTogglePadding()
    }
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  console.log('consent1', consent.value)
  if (!consent.value) {
    //   console.log('consent2', consent.value)
    //   // bannerAdHide()
    //   // bannerAdShow()
    suglasnost.value = true
  }
  // else {
  //   // bannerAdHide()
  //   // bannerAdShow()
  //   console.log('consent3', consent.value)
  //   // suglasnost.value = false
  // }

  admob.addListener('bannerAdSizeChanged', (evt) => {
    // bannerAdHeight.value = evt.height
    // bannerAdTogglePadding(evt.height)
    // bannerAdTogglePadding()
    console.log('Banner Ad size changed', evt)
  })

  await bannerAdInit('bottom')

  admob.addListener('interstitialAdShowed', (evt) => {
    // isLoading.value = false
    console.log('Interstitial Ad showed', evt)
    admob.hideBanner()
  })

  admob.addListener('interstitialAdLoaded', (evt) => {
    // isLoading.value = false
    console.log('Interstitial Ad loaded', evt)
  })

  admob.addListener('interstitialAdDismissed', (evt) => {
    console.log('Interstitial Ad dismissed', evt)
    admob.resumeBanner()
  })
  await interstitialAdInit()
})

// const { locale } = useI18n({ useScope: 'global' })
const appExit = ref(false)

const admobNPA = computed({
  get: () => store.global.state.niSettings.npa,
  set: (value) => store.global.methods.updateSetting('npa', value)
})
const terms = ref('no')

// if (!consent.value) {
//   // bannerAdHide()
//   suglasnost.value = true
//   bannerAdHide()
// }
// console.log('consent1', consent)
// if (consent.value) {
//   console.log('consent2', consent)
//   // bannerAdHide()
//   bannerAdShow()
// } else {
//   console.log('consent3', consent)
//   suglasnost.value = true
// }

// if (suglasnost.value) {
// }
const drzava = computed(() => store.global.state.niSettings.drzava)
const filterKeyword = ref('')
const allPosts = computed(() => store.global.state.posts)
// const filteredPosts = computed(() => allPosts.value)
const filteredPosts = ref(allPosts.value)
const filters = computed(() => store.global.state.filters)
const filterName = computed(() => store.global.state.niSettings.filter)
const selectedFilter = computed(() => filters.value.find(el => el.name === filterName.value))
const groupSort = ref('id')
const groupDirection = ref('desc')
const sortiranje = ref(false)
const showSearch = ref(false)
const sortOptions = ref([
  { label: i18n.t('sortObjava'), value: 'objava' },
  { label: i18n.t('sortIzvlacenje'), value: 'izvlacenje' },
  { label: i18n.t('sortZavrsetak'), value: 'kraj' },
  { label: i18n.t('sortDatumObjave'), value: 'id' }
])
const sortDirection = ref([
  { label: i18n.t('sortAsc'), value: 'asc' },
  { label: i18n.t('sortDesc'), value: 'desc' }
])
const npaOptions = ref([
  { label: i18n.t('consentDA'), value: '0' },
  { label: i18n.t('consentNE'), value: '1' }
])

const setSortDialog = (val) => {
  sortiranje.value = val
  console.log(val)
  appExit.value = val
}

const filterPosts = () => {
  const filter = filters.value.find(el => el.name === filterName.value)
  filteredPosts.value = filter.getFiltered(allPosts.value)
  sortNI(groupSort.value, groupDirection.value)
}

// const bannerOptions = {
//   adId: 'ca-app-pub-3940256099942544/6300978111',
//   adSize: BannerAdSize.BANNER,
//   position: BannerAdPosition.BOTTOM_CENTER,
//   margin: 0,
//   isTesting: true
//   // npa: true
// }

// App.addListener('backButton', () => {
//   backButtonHandler()
// })

console.log('POSTOVI: ', filteredPosts.value)
console.log('PATH: ', route.value)
// const favorites = ref(store.global.state.niSettings.favorites)

// const checkFavorite = () => {
//   return store.global.state.niSettings.favorites.includes('poli-nagradna-igra-2022-igraj-se-s-poli-lude-nagrade-osvoji')
// }

function checkFavorite (slug) {
  const check = store.global.state.niSettings.favorites.includes(slug)
  return check
}

// function backButtonHandler () {
//   // if (route.name === 'Home') {
//   //   console.log('*** appExit.value', appExit.value)
//   //   if (appExit.value === false) {
//   //     navigator.app.exitApp()
//   //   } else {
//   //     console.log('*** appExit.value === true')
//   //     // do noting
//   //   }
//   // }
// }

async function saveSuglasnost () {
  await store.global.methods.updateSetting('suglasnost', true)
  // if (Platform.is.android) {
  //   AdMob.showBanner(bannerOptions)
  bannerAdInit()
  // bannerAdShow()
  // }
}

console.log('PLATFORM: ', Platform.is)

console.log('....DRŽAVA HOME: ', drzava.value.name)

store.global.actions.fetchSettings()

// store.global.actions.fetchSettings()

onMounted(async () => {
  // if (Platform.is.android) {
  //   // await AdMob.initialize() - napravljeno prilikom BOOT-a
  //   // AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
  //   //   // Subscribe Banner Event Listener
  //   // })
  //   // AdMob.addListener(BannerAdPluginEvents.SizeChanged, () => {
  //   //   // Subscribe Change Banner Size
  //   // })

  //   const optionsInt = {
  //     adId: 'ca-app-pub-3940256099942544/1033173712',
  //     isTesting: true
  //     // npa: true
  //   }
  //   if (!suglasnost.value) {
  //     // suglasnost.value = true
  //     // AdMob.showBanner(bannerOptions)
  //   }
  //   // await AdMob.prepareInterstitial(optionsInt)

  //   const prepareInterstitial = async button => { // eslint-disable-line
  //     try {
  //       await AdMob.prepareInterstitial({
  //         adId, // eslint-disable-line
  //         autoShow: false
  //       })
  //     } catch (err) {
  //       buttonNotif(button, 'negative', 'Interstitial Ad Failed To Prepare.') // eslint-disable-line
  //       console.error(err)
  //     }
  //     AdMob.addListener('onInterstitialAdLoaded', async info => {
  //       buttonNotif(button, 'positive', 'Interstitial Ad Loaded.') // eslint-disable-line
  //     })
  //     AdMob.addListener('onInterstitialAdOpened', async info => {
  //       console.log('Interstitial Ad Opened.')
  //     })
  //   }
  // }
}

)

watch(sortiranje, (newValue) => {
  // gledam varijablu sortiranje i kad se promijeni novu vrijednost pridružim varijabli appExit
  console.log('-+-+-+ sortiranje newValue: ', newValue)
  appExit.value = newValue
})

watch(
  () => route.params.country,
  async countryName => {
    console.log('....COUNTRY HOME: ', route.params.country)
    if (route.name === 'Home') {
      filterPosts()
      startPush() // uključiti
    }
  },
  { immediate: true }
)

watch(
  () => route.params.filter,
  async filterName => {
    if (route.name === 'Home') {
      if (filterName === 'active') {
        // console.log('~~ filterName: ', filterName)
        groupSort.value = 'id'
        groupDirection.value = 'desc'
      }
      if (filterName === 'ending') {
        // console.log('~~ filterName: ', filterName)
        groupSort.value = 'kraj'
        groupDirection.value = 'asc'
      }
      if (filterName === 'winners') {
        // console.log('~~ filterName: ', filterName)
        groupSort.value = 'objava'
        groupDirection.value = 'desc'
      }
      if (filterName === 'favorites') {
        // console.log('~~ filterName: ', filterName)
        groupSort.value = 'objava'
        groupDirection.value = 'asc'
      }
      if (filterName === 'polling') {
        // console.log('~~ filterName: ', filterName)
        groupSort.value = 'izvlacenje'
        groupDirection.value = 'asc'
      }
      if (filterName === 'all') {
        // console.log('~~ filterName: ', filterName)
        groupSort.value = 'id'
        groupDirection.value = 'desc'
      }
      store.global.methods.updateSetting('filter', filterName)
      await filterPosts()
    }
  },
  { immediate: true }
)

watch(filterKeyword, (newValue) => {
  // console.log('newValue', newValue)
  filterByTheKeyword()
})

async function startPush () {
  console.log('....DRŽAVA startPUSH: ', drzava.value.name)

  if (Platform.is.android) {
    if (drzava.value.name === 'hr') {
      await PushNotifications.requestPermissions().then(result => {
        // if (result.granted) {

        PushNotifications.register()
          .then(() => {
            FCM.unsubscribeFrom({ topic: 'NI-Hrvatska' })
            FCM.unsubscribeFrom({ topic: 'NI-Slovenija' })
            FCM.unsubscribeFrom({ topic: 'NI-Srbija' })
            FCM.subscribeTo({
              topic: 'NI-Hrvatska'
            })
              .then((r) => {
                console.log('PUSH: subscribed to HR topic')
              }
              )
              .catch((err) => console.log(err))
          })
          .catch((err) => alert(JSON.stringify(err)))
        // } else {
        // Show some error
        // }
      })
    }
    if (drzava.value.name === 'rs') {
      await PushNotifications.requestPermissions().then(result => {
        // if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM

        PushNotifications.register()
          .then(() => {
            FCM.unsubscribeFrom({ topic: 'NI-Hrvatska' })
            FCM.unsubscribeFrom({ topic: 'NI-Slovenija' })
            FCM.unsubscribeFrom({ topic: 'NI-Srbija' })
            FCM.subscribeTo({
              topic: 'NI-Srbija'
            })
              .then((r) => {
                console.log('PUSH: subscribed to RS topic')
              }
              )
              .catch((err) => console.log(err))
          })
          .catch((err) => alert(JSON.stringify(err)))
        // } else {
        // Show some error
        // }
      })
    }
    if (drzava.value.name === 'si') {
      await PushNotifications.requestPermissions().then(result => {
        // if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM

        PushNotifications.register()
          .then(() => {
            FCM.unsubscribeFrom({ topic: 'NI-Hrvatska' })
            FCM.unsubscribeFrom({ topic: 'NI-Slovenija' })
            FCM.unsubscribeFrom({ topic: 'NI-Srbija' })
            FCM.subscribeTo({
              topic: 'NI-Slovenija'
            })
              .then((r) => {
                console.log('PUSH: subscribed to SI topic')
              }
              )
              .catch((err) => console.log(err))
          })
          .catch((err) => alert(JSON.stringify(err)))
        // } else {
        // Show some error
        // }
      })
    }

    PushNotifications.addListener('pushNotificationReceived',
      (notification) => {
        // console.log('notification', notification)
        // console.log('notification.data', notification.data)
        // console.log('notification.data.refreshME1', notification.data.refreshMe)
        if (notification.data.fetchNI) {
          console.log('notification.data.refreshME2', notification.data.refreshMe)
          // store.global.actions.fetchPosts(drzava.value.host)
          selectCountry(drzava.value.name)
          // filterPosts()
          // showSearch.value = true
        }
        quasar.notify({
          color: 'orange',
          multiLine: true,
          // message: '<strong>' + JSON.stringify(notification.title) + '</strong><br />' + JSON.stringify(notification.title),
          message: '<strong>' + notification.title + '</strong><br />' + notification.body,
          position: 'top',
          timeout: 20000,
          closeBtn: 'ZATVORI',
          html: true
        })
      }
    )

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification) => {
        console.log('Push notification action performed', notification, notification.notification.data)
        if (notification.notification.data.fetchNI) {
          // console.log('action performed notification.data.refreshME2', notification.notification.data.fetchNI)
          selectCountry(drzava.value.name)
          // store.global.actions.fetchPosts(drzava.value.host)
          // filterPosts()
          // showSearch.value = true
        }
      })
  }
} // startPush

function sortNI (sortOption, direction) {
  if (direction === 'asc') {
    // console.log('groupSort > : ', sortOption, direction)
    if (sortOption === 'id') {
      // console.log('sortiram po ID uzlazno')
      const sortOption = 'published'
      // filteredPosts.value.sort((a, b) => (a[sortOption] > b[sortOption]) ? 1 : -1)
      filteredPosts.value.sort((a, b) =>
        (a[sortOption].year > b[sortOption].year) ? 1
          : (a[sortOption].year === b[sortOption].year) ? ((a[sortOption].month > b[sortOption].month) ? 1 : (a[sortOption].month === b[sortOption].month) ? ((a[sortOption].day > b[sortOption].day) ? 1 : -1) : -1) : -1)

      console.log(filteredPosts.value)
    } else {
      filteredPosts.value.sort((a, b) =>
        (a[sortOption].year > b[sortOption].year) ? 1
          : (a[sortOption].year === b[sortOption].year) ? ((a[sortOption].month > b[sortOption].month) ? 1 : (a[sortOption].month === b[sortOption].month) ? ((a[sortOption].day > b[sortOption].day) ? 1 : -1) : -1) : -1)
    }
  } else {
    // console.log('groupSort < : ', sortOption, direction)
    if (sortOption === 'id') {
      // console.log('sortiram po ID silazno')
      const sortOption = 'published'
      // filteredPosts.value.sort((a, b) => (a[sortOption] < b[sortOption]) ? 1 : -1)
      filteredPosts.value.sort((a, b) =>
        (a[sortOption].year < b[sortOption].year) ? 1
          : (a[sortOption].year === b[sortOption].year) ? ((a[sortOption].month < b[sortOption].month) ? 1 : (a[sortOption].month === b[sortOption].month) ? ((a[sortOption].day < b[sortOption].day) ? 1 : -1) : -1) : -1)

      // console.log(filteredPosts.value)
    } else {
      filteredPosts.value.sort((a, b) =>
        (a[sortOption].year < b[sortOption].year) ? 1
          : (a[sortOption].year === b[sortOption].year) ? ((a[sortOption].month < b[sortOption].month) ? 1 : (a[sortOption].month === b[sortOption].month) ? ((a[sortOption].day < b[sortOption].day) ? 1 : -1) : -1) : -1)
    }
  }
  // sortiranje.value = false
  setSortDialog(false)
}

async function selectNI (id, title, slug, content, image) {
  await store.global.methods.updateSetting('slug', slug)
  router.push({
    name: 'Post',
    params: {
      slug
    }
  })

  // uključiti u produkciji - prikazuje Interstitial reklamu
  if (Platform.is.android) {
    await interstitialAdShow()
  }
}

function filterByTheKeyword (evt) {
  const filtered = allPosts.value.filter(item => {
    const fromName = item.title.toLowerCase().match(filterKeyword.value.toLowerCase())
    return fromName
  })
  filteredPosts.value = filtered
  // store.global.state.filteredPosts = filtered
  // console.log('filtered', filtered)
}

function clear () {
  filterKeyword.value = ''
  store.global.state.filteredPosts = store.global.state.posts
}

const selectCountry = async (country) => {
  await store.global.actions.updateHost(country)
  filterPosts()
}

</script>
