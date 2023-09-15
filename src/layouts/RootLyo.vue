<template>
  <q-layout
    view="hHh lpR fFf"
    container
    style="height: calc(100vh - 51px); border-bottom: 2px solid black;"
  >
    <q-header
      elevated
      class="bg-black text-white"
    >
      <q-toolbar>
        <q-toolbar-title class="text-center">
          Nagradne igre
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'comRoot',
  setup () {
    return {
    }
  }
})
</script>
