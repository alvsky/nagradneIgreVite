<template>
  <q-page>
    <div
      class="column"
      style="max-width: 16rem; margin: 0 auto"
    >
      <div class="text-subtitle1 text-center q-mt-xl">
        Odaberite državu
      </div>
      <q-separator class="q-my-md" />
      <div class="column items-center">
        <div
          v-for="(country, index) in countries"
          :key="index"
          class="column q-my-sm"
        >
          <q-btn
            flat
            round
            dense
            size="xl"
            class="q-mx-sm"
            :icon="country.icon"
            :disable="disableLang"
            :loading="loading[index]"
            @click="selectCountry(country.name, index)"
          >
            <!-- @click="selectCountry(country.name, index)" -->
            <template #loading>
              <q-spinner-puff color="primary" />
            </template>
          </q-btn>
          <div class="text-caption text-center">
            {{ country.label }}
          </div>
        </div>
      </div>
    </div>
    <!-- <q-dialog
      v-model="dialog"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="text-purple text-bold">
        <q-card-section>
          <div class="text-h6">Suglasnost</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Ova aplikacija za prikaz reklama koristi Google AdMob servis.

          Sukladno europskim zakonima (GDPR), potrebna je Vaša suglasnost da reklame koje se prikazuju budu prilagođene Vašim navikama.

          Za prikaz takvih personaliziranih reklama, Google koristi identifikatore Vašeg uređaja.
        </q-card-section>
        <q-card-section class="q-pt-none">
          Dozvoljavate li da Google prikazuje personalizirane reklame?
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-option-group
            :options="options"
            type="radio"
            v-model="admobNPA"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          Ova opcija se u svakom trenutku može promijeniti u Postavkama
        </q-card-section>
        <q-card-section class="q-pt-none">
          Da biste mogli koristiti aplikaciju Nagradne igre, potrebno je prihvatiti Uvjete korištenja i <a
            href="https://nagradnaigra.com.hr/privacy-policy/"
            class="q-pt-none text-blue"
            style="font-color: black"
          >Politiku privatnosti</a>!
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-checkbox
            v-model="terms"
            color="secondary"
            label="Slažem se s Politikom privatnosti"
            true-value="yes"
            false-value="no"
          />
        </q-card-section>
        <q-card-section>
          <q-btn
            color="primary"
            label="Dalje"
            :disabled="terms === 'no' ? true : false"
            v-close-popup
            @click="saveSuglasnost()"
          />
        </q-card-section>
      </q-card>
    </q-dialog> -->
  </q-page>
</template>

<script>
/* eslint-disable */
// import { useStore } from 'vuex'
import { defineComponent, inject, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SelectCountry',
  setup () {
    const store = inject('store')
    // const store = useStore()
    // const countries = store.state.global.countries
    const countries = store.global.state.countries
    const disableLang = ref(false)
    const loading = ref(countries.map((el) => false))
    const router = useRouter()
    // const dialog = ref(false)
    // const admobNPA = computed({
    //   get: () => store.global.state.niSettings.npa,
    //   set: (value) => store.global.methods.updateSetting('npa', value)
    // })
    // const terms = ref('no')
    // const consent = computed(() => store.global.state.niSettings.suglasnost)
    console.log(countries)
    // console.log('suglasnost:', consent.value)

    // if (!consent.value) {
    //   dialog.value = true
    // }


    const selectCountry = async (country, index) => {
      loading.value[index] = true
      disableLang.value = true
      await store.global.actions.updateHost(country)
      console.log(country)

      let lang
      if (country === 'si') lang = 'sl'
      if (country === 'rs') lang = 'sr'
      if (country === 'hr') lang = 'hr'

      await updateLocale(lang)

      router.push({ name: 'Home', params: { country, filter: store.global.state.niSettings.filter } })
    }

    const updateLocale = async (lang) => {
      await store.global.methods.updateSetting('locale', lang)
      // locale.value = lang
      // langCntryIcon = langCntry.value[0].icon
      // console.log('langCntryIcon', langCntryIcon)
    }

    // async function saveSuglasnost () {
    //   await store.global.methods.updateSetting('suglasnost', true)

    // }

    // const options = ref([
    //   { label: 'Da, prikazuj personalizirane reklame', value: '0' },
    //   { label: 'Ne, prikazuj općenite reklame', value: '1' }
    // ])
    const updateHost = (country) => store.dispatch('updateHost')

    return {
      // store,
      // dialog,
      // admobNPA,
      // options,
      // terms,
      // saveSuglasnost,
      countries,
      disableLang,
      loading,
      selectCountry,
      updateHost,
      updateLocale
      // updateHost: (country) => store.dispatch('updateHost')
    }
  }
})
</script>
