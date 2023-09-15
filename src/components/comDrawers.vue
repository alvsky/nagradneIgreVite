<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
  >
    <div class="drawer-wrapper column fit">
      <q-toolbar
        class="bg-primary text-white shadow-2 col-shrink"
        :style="{borderRight: '1px solid rgba(255,255,255,0.3)'}"
      >
        <q-btn
          flat
          round
          dense
          icon="mdi-arrow-left"
          class="q-mr-sm"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>Filtriranje</q-toolbar-title>
      </q-toolbar>
      <div
        class="col-grow"
        :style="{paddingBottom: '50px'}"
      >
        <q-scroll-area
          class="bg-white fit"
          :style="{borderRight: '1px solid rgba(0,0,0,0.12)'}"
        >
          <q-list>
              <!-- v-ripple -->
            <q-item
              exact
              to="/"
              clickable
            >
              <q-item-section avatar>
                <q-icon name="mdi-home" />
              </q-item-section>

              <q-item-section>
                <strong>Naslovnica</strong>
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
            >
              <!-- @click="filteredPosts = filter.getFiltered(allPosts)" -->
              <q-item-section avatar>
                <q-icon name="mdi-magnify" />
              </q-item-section>

              <q-item-section>
                {{ `${xfilter.label} (${xfilter.getFiltered(allPosts).length})` }}
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
        <q-toolbar-title>Postavke i pomoć</q-toolbar-title>
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
        :style="{paddingBottom: '50px'}"
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
                {{ section.label }}
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
                Pravila privatnosti
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>
    </div>
  </q-drawer>

</template>

<script>
export default {
  // name: 'ComponentName',
  setup () {
    return {}
  }
}
</script>
