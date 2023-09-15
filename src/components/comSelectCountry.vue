<template>
  <q-dialog
    ref="dialogRef"
    :persistent="true"
    @hide="onDialogHide"
  >
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6 text-center">
          Odaberite državu
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <div
          v-for="(country, index) in countries"
          :key="index"
          class="column"
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
            <template #loading>
              <q-spinner-puff color="primary" />
            </template>
          </q-btn>
          <div class="text-caption text-center">
            {{ country.label }}
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, inject, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

export default defineComponent({
  name: 'ComSelectCountry',
  props: {
    countries: {
      type: Array,
      default: () => []
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup (props) {
    const store = inject('store')
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
    const disableLang = ref(false)
    const loading = ref(props.countries.map((el) => false))

    const selectCountry = async (country, index) => {
      loading.value[index] = true
      disableLang.value = true
      await store.global.actions.updateHost(country)

      onDialogOK()
    }

    return {
      dialogRef,
      onDialogHide,
      disableLang,
      loading,
      selectCountry
    }
  }
})
</script>
