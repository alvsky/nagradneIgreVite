<template>
  <q-header
    elevated
    class="bg-black text-white"
  >
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="mdi-arrow-left"
        aria-label="Menu"
        @click="goToHome()"
      />
      <q-toolbar-title>
        {{ $t('titleSettings')}}
      </q-toolbar-title>
      <!-- to="settings" -->
    </q-toolbar>
  </q-header>

  <br>
  <!-- <q-btn :label="$t('hello')" /> -->
  <!-- ...... -->

  <q-list bordered>
    <q-expansion-item
      v-if="showUserData === '1'"
      group="somegroup"
      icon="perm_identity"
      label="Osobni podaci"
      header-class="text-primary"
    >
      <q-card class="h-form-card column">
        <q-card-section class="col-grow q-pa-none">
          <!-- <q-scroll-area class="col fit"> -->
          <q-form
            ref="employeeForm"
            style="padding: 1rem 1rem 66px 1rem"
            @submit="saveUser"
          >
            <!-- <div class="text-center text-subtitle2 q-pt-md q-pb-sm">
              General info
            </div> -->
            <q-input
              v-model="firstName"
              label="Ime"
              class="q-mb-md"
              placeholder="Upiši Ime"
            />
            <q-input
              v-model="lastName"
              label="Prezime"
              class="q-mb-md"
              placeholder="Upiši Prezime"
            />
            <q-input
              v-model="oib"
              label="OIB"
              class="q-mb-md"
              placeholder="Upiši OIB"
              maxlength="11"
            />
            <div class="flex justify-center">
              <q-option-group
                v-model="gender"
                size="sm"
                inline
                :options="[
                  {label: 'Muško', value: 'm'},
                  {label: 'Žensko', value: 'f'}
                ]"
              />
            </div>
            <!-- <div class="text-center text-subtitle2 q-pt-md q-pb-sm">
              Contact info
            </div> -->
            <q-input
              v-model="street"
              label="Ulica i broj"
              class="q-mb-md"
              placeholder="Upiši naziv ulice i kućni broj"
              lazy-rules
              stack-label
            />
            <q-input
              v-model="city"
              label="Mjesto"
              class="q-mb-md"
              placeholder="Upiši naziv mjesta"
              lazy-rules
              stack-label
            />
            <q-input
              v-model="zemlja"
              label="Država"
              class="q-mb-md"
              placeholder="Unesi državu"
              lazy-rules
              stack-label
            />
            <q-input
              v-model="email"
              label="Email"
              class="q-mb-md"
              placeholder="Upiši email"
              lazy-rules
              stack-label
            />
            <q-input
              v-model="phone"
              label="Telefon"
              class="q-mb-md"
              placeholder="Upiši broj telefona"
              lazy-rules
              stack-label
            />

            <q-toolbar class="justify-center bg-white">
              <q-btn
                unelevated
                rounded
                no-caps
                dense
                color="primary"
                type="submit"
                icon="mdi-content-save-settings-outline"
                class="q-px-sm"
                label="Save Employee"
              />
            </q-toolbar>
          </q-form>
          <!-- </q-scroll-area> -->
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-separator />

    <q-expansion-item
      group="somegroup"
      :icon="store.global.getters.getCountryIcon()"
      :label="$t('changeCountry')"
      header-class="text-teal"
    >
      <q-card>
        <q-card-section>
          <q-btn
            v-for="(country, index) in countries"
            :key="index"
            flat
            round
            dense
            size="lg"
            class="q-mr-sm"
            :icon="country.icon"
            :disable="country.name === currentCountry ? true : false"
            :loading="loading[index]"
            @click="selectCountry(country.name, index)"
          >
            <q-tooltip class="bg-black">
              {{ country.label }}
            </q-tooltip>
            <template #loading>
              <q-spinner-puff color="black" />
            </template>
          </q-btn>
        </q-card-section>
        <q-card-section>
          {{ $t('settings_p1')}}
        </q-card-section>
        <q-card-section>
          {{ $t('settings_p2')}}
        </q-card-section>

      </q-card>
    </q-expansion-item>

    <q-separator />

    <q-expansion-item
      group="somegroup"
      :icon="store.global.getters.getLangCountryIcon()"
      :key="langCntryIcon"
      :label="$t('changeLanguage')"
      header-class="text-purple"
    >
      <q-card>
        <q-card-section>
          <!-- {{ locale }} -->
          <q-btn
            v-for="(country, index) in countries"
            :key="index"
            flat
            round
            dense
            size="lg"
            class="q-mr-sm"
            :icon="country.icon"
            :disable="country.locale === locale ? true : false"
            :loading="loading[index]"
            @click="updateLocale(country.locale)"
          >
            <q-tooltip class="bg-black">
              {{ country.label }}
            </q-tooltip>
            <template #loading>
              <q-spinner-puff color="black" />
            </template>
          </q-btn>
        </q-card-section>
        <q-card-section>
          {{ $t('settingsLang_p1')}}
        </q-card-section>
        <q-card-section>
          {{ $t('settingsLang_p2')}}
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-separator />

    <q-expansion-item
      group="somegroup"
      icon="policy"
      :label="$t('consentSettingsLabel')"
      header-class=""
      expand-icon-class="text-primary"
    >
      <q-card class="">
        <q-card-section class="q-pt-none">
          {{ $t('consentPitanje')}}
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-option-group
            :options="options"
            type="radio"
            v-model="admobNPA"
          />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { inject, ref, computed, reactive } from 'vue' // eslint-disable-line
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router' // eslint-disable-line
import { useQuasar, Platform } from 'quasar'
export default {
  name: 'Settings',
  setup () {
    const FCM = inject('FCMPlugin')

    const store = inject('store')
    const { locale } = useI18n({ useScope: 'global' })
    const i18n = useI18n({})
    const router = useRouter() // eslint-disable-line
    const route = useRoute() // eslint-disable-line
    const filter = store.global.state.niSettings.filter
    const currentCountry = store.global.state.niSettings.country
    const drzava = computed(() => store.global.state.niSettings.drzava)
    const showUserData = computed(() => store.global.state.niSettings.showUserData)
    const countries = store.global.state.countries
    const loading = ref(countries.map(el => false))
    const disableLang = ref(true)
    const disableCntry = ref(false)
    const lang = computed(() => store.global.state.niSettings.locale)
    const admobNPA = computed({
      get: () => store.global.state.niSettings.npa,
      set: (value) => store.global.methods.updateSetting('npa', value)
    })
    locale.value = lang.value
    const langCntry = computed(() => countries.filter(el => el.locale === locale.value))
    let langCntryIcon = langCntry.value[0].icon
    const $q = useQuasar()
    const ime = ref(null)
    const prezime = ref(null)
    const imeRef = ref(null)
    const prezimeRef = ref(null)
    const age = ref(null)
    const ageRef = ref(null)
    const accept = ref(false)

    const user = computed(() => store.global.state.niSettings.user)
    console.log(user.value.firstName)

    const firstName = ref(store.global.state.niSettings.user.firstName)
    const lastName = ref(store.global.state.niSettings.user.lastName)
    const gender = ref(store.global.state.niSettings.user.gender)
    const oib = ref(store.global.state.niSettings.user.pid)
    const email = ref(store.global.state.niSettings.user.email)
    const phone = ref(store.global.state.niSettings.user.phone)
    const zemlja = ref(store.global.state.niSettings.user.zemlja)
    const city = ref(store.global.state.niSettings.user.city)
    const street = ref(store.global.state.niSettings.user.street)

    console.log('NPA: ', admobNPA.value)

    const selectCountry = async (country, index) => {
      loading.value[index] = true
      disableCntry.value = true
      await store.global.actions.updateHost(country)
      loading.value[index] = false
      disableCntry.value = false
      unsubscribePush()
    }

    const updateLocale = async (lang) => {
      await store.global.methods.updateSetting('locale', lang)
      locale.value = lang
      langCntryIcon = langCntry.value[0].icon
      console.log('langCntryIcon', langCntryIcon)
    }

    console.log('Država: ', currentCountry)
    console.log('LOCALE: ', locale.value)
    console.log('LOCALE ICON: ', langCntry.value[0].icon)

    async function unsubscribePush () {
      console.log('....DRŽAVA unsubscribePush: ', drzava.value.name)
      if (Platform.is.capacitor) {
        if (drzava.value.name === 'hr') {
          FCM.unsubscribeFrom({ topic: 'NI-Hrvatska' })
            .then(() => {
              // alert('-- 1 -- unsubscribed from Hrvatska')
            })
        }
        if (drzava.value.name === 'si') {
          FCM.unsubscribeFrom({ topic: 'NI-Slovenija' })
            .then(() => {
              // alert('-- 1 -- unsubscribed from Slovenija')
            })
        }
        if (drzava.value.name === 'rs') {
          FCM.unsubscribeFrom({ topic: 'NI-Srbija' })
            .then(() => {
              // alert('-- 1 -- unsubscribed from Srbija')
            })
        }
      }
    }

    function goToHome () {
      console.log('Settings filter  ', filter)
      console.log('zemla  ', currentCountry)
      router.push({
        name: 'Home',
        params: {
          country: currentCountry,
          filter: filter
        }
      })
    }

    function onSubmit () {
      imeRef.value.validate()
      prezimeRef.value.validate()
      ageRef.value.validate()

      if (imeRef.value.hasError || ageRef.value.hasError || prezimeRef.value.hasError) {
        // form has error
      } else if (accept.value !== true) {
        $q.notify({
          color: 'negative',
          message: 'You need to accept the license and terms first',
          position: 'top'
        })
      } else {
        $q.notify({
          icon: 'done',
          color: 'positive',
          message: 'Submitted',
          position: 'top'
        })
      }
    }

    function onReset () {
      ime.value = null
      prezime.value = null
      age.value = null

      imeRef.value.resetValidation()
      prezimeRef.value.resetValidation()
      ageRef.value.resetValidation()
    }

    const options = ref([
      { label: i18n.t('consentDA'), value: '0' },
      { label: i18n.t('consentNE'), value: '1' }
    ])

    return {
      store,
      unsubscribePush,
      locale,
      currentCountry,
      langCntry,
      langCntryIcon,
      updateLocale,
      countries,
      drzava,
      selectCountry,
      loading,
      disableCntry,
      disableLang,
      ime,
      prezime,
      imeRef,
      prezimeRef,

      age,
      ageRef,
      accept,
      goToHome,

      firstName,
      lastName,
      oib,
      email,
      phone,
      zemlja,
      gender,
      city,
      street,
      showUserData,
      // updateUser,
      admobNPA,

      errorFirstName () {
        let message = ''
        if (!firstName.value) {
          message = 'Please enter first name'
        }
        if (!firstName.value) {
          message = 'First name must be at least 2 characters long'
        }
        return message
      },
      errorLastName () {
        let message = ''
        if (!lastName.value) {
          message = 'Please enter last name'
        }
        if (!lastName.value) {
          message = 'Last name must be at least 2 characters long'
        }
        return message
      },
      errorOib () {
        let message = ''
        if (!oib.value || !oib.value.maxLength) {
          message = 'OIB must be exactly 11 characters long'
        }
        if (!oib.value.numeric) {
          message = 'OIB must be all numbers'
        }
        return message
      },
      errorEmail () {
        let message = ''
        if (!email.value.email) {
          message = 'Please enter valid email address'
        }
        return message
      },
      errorPhone () {
        let message = ''
        if (!phone.value.numeric) {
          message = 'Phonenumber must be all numbers'
        }
        if (!phone.value) {
          message = 'Phone number must be at least 6 characters long'
        }
        return message
      },
      async saveUser () {
        console.log('I M E: ', firstName)
        await store.global.actions.updateUser(firstName, lastName, gender, oib, email, phone, zemlja, city, street)
        $q.notify({
          icon: 'done',
          color: 'positive',
          message: 'Promjene su spremljene',
          position: 'top'
        })
      }
    }
  }
}
</script>
