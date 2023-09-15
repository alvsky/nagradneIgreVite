<template>
  <q-card class="bg-grey-2">
    <q-card-section
      class=" bg-grey-7 text-white"
      style="border-bottom: 5px solid #f5f5f5"
    >
      <div class="text-h6">
        {{ store.global.state.selectedPost.title }}
      </div>
    </q-card-section>
    <img :src="store.global.state.selectedPost.image">
    <!-- eslint-disable vue/no-v-html -->
    <q-card-section
      class="content q-pt-none"
      v-html="store.global.state.selectedPost.content"
    />
  </q-card>
</template>

<script>
import { inject } from 'vue'

export default {
  // name: 'ComponentName',
  setup () {
    const store = inject('store')

    return {
      store
    }
  }
}
</script>
