<template>
  <q-page class="flex">
    <div
      class="page-wrapper column self-stretch"
      style="width: 100%;"
    >
      <q-toolbar class="bg-primary text-white shadow-2 col-shrink">
        <q-btn
          flat
          round
          dense
          icon="mdi-arrow-left"
          class="q-mr-sm"
          @click="goToHome()"
        />
        <q-space />
        <!-- <q-btn
          flat
          round
          dense
          icon="mdi-home"
          class="q-mr-sm"
          @click="goToHome()"
        /> -->
        <q-btn
          flat
          round
          dense
          :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
          class="q-mr-sm"
          @click="isFavorite ? removeFromFavorites() : addToFavorites()"
        />
        <q-btn
          flat
          round
          dense
          icon="mdi-share-variant-outline"
          class="q-mr-sm"
          @click="shareNI()"
        />
      </q-toolbar>

      <div
        class="col-grow bg-grey-2"
        :style="{paddingBottom: '63px'}"
      >
        <q-scroll-area class="fit">
          <div class="bg-grey-2 q-gutter-md q-pa-md">

            <q-card class="bg-grey-2">
              <q-card-section
                class=" bg-white text-black"
                style="border-bottom: 3px solid #f5f5f5"
              >
                <div
                  class="text-h6"
                  style="line-height: 1.3;"
                >
                  {{ post.title }}
                </div>
              </q-card-section>
              <img :src="post.featured_image">
              <!-- eslint-disable vue/no-v-html -->
              <q-card-section
                id="native-ad"
                class="content q-pt-none"
              />
              <!-- <q-card-section
                class="content q-pt-none"
                v-html="post.content"
              /> -->
              <q-card-section
                class="content q-pt-none"
              >
                <div v-html="post.content" />
              </q-card-section>
            </q-card>

          </div>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, inject, computed, reactive, watch, onMounted, onUpdated, onBeforeMount } from 'vue' // eslint-disable-line
import { useRoute, useRouter } from 'vue-router' // eslint-disable-line
import { Platform } from 'quasar'

const Share = inject('Share')
const store = inject('store')
const route = useRoute() // eslint-disable-line
const router = useRouter() // eslint-disable-line

const filter = store.global.state.niSettings.filter
const host = store.global.state.niSettings.host
const post = reactive(
  {
    title: '',
    content: '',
    featured_image: ''
  }
)
console.log('evo me na Postu: route', route)
const allPosts = computed(() => store.global.state.posts)
const favorites = ref(store.global.state.niSettings.favorites)
const fvr = ref([])
const isFavorite = ref(false)

onMounted(async () => {
  console.log('MONTIRAN sam')
}) // end onMounted

onUpdated(() => {
  console.log('UPDATED')
})

function checkFavorite () {
  if (favorites.value != null) {
    isFavorite.value = favorites.value.includes(route.params.slug)
  } else {
    isFavorite.value = false
  }
}

console.log(route.params.slug)
console.log('favorites 0: ', favorites.value)
console.log('fvr 0: ', fvr.value)

async function addToFavorites () {
  console.log('favorites 1: ', favorites.value) // ok
  if (favorites.value != null) {
    fvr.value = favorites.value
  }
  console.log('fvr 1: ', fvr.value)
  fvr.value.push(route.params.slug)
  console.log('fvr 2: ', fvr.value)
  await store.global.methods.updateSetting('favorites', fvr.value)
  checkFavorite()
}

async function removeFromFavorites () {
  console.log('removed')
  fvr.value = favorites.value
  console.log('fvr 1: ', fvr.value)
  const index = fvr.value.indexOf(route.params.slug)
  if (index > -1) {
    fvr.value.splice(index, 1)
  }
  await store.global.methods.updateSetting('favorites', fvr.value)
  console.log('fvr 2: ', fvr.value)
  checkFavorite()
}

async function getPost () {
  console.log('--- get POST')

  const selectedPost = await allPosts.value.find(el => el.slug === route.params.slug)
  post.title = selectedPost.title
  post.content = selectedPost.content
  post.featured_image = selectedPost.featured_image.large
}
async function getPolicy () {
  post.title = store.global.state.privacy[0].title.rendered
  post.content = store.global.state.privacy[0].content.rendered
  post.featured_image = ''
}
watch(
  () => route.params.slug,
  () => {
    if (route.name === 'Post') {
      if (route.params.slug === 'privacy') {
        getPolicy()
      } else {
        getPost()
        checkFavorite()
      }
    }
  },
  { immediate: true }
)

watch(isFavorite,
  () => {
    checkFavorite()
  })

function goToHome () {
  console.log(filter)
  router.push({
    name: 'Home',
    params: {
      filter
    }
  })
}
async function shareNI () {
  console.log('SHARE THIS')
  if (Platform.is.capacitor) {
    const link = 'https://' + host + '/' + route.params.slug

    try {
      const result = await Share.share({
        title: 'Zanimljiva nagradna igra',
        text: 'Mislim da bi te mogla zanimati ova nagradna igra.',
        url: link, // + '/' + route.params.slug,
        dialogTitle: 'Nagradna igra'
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

</script>

<!--
<script>
/* eslint-disable */
import { ref, inject, computed, reactive, watch, onMounted, onUpdated, onBeforeMount } from 'vue' // eslint-disable-line
import { useRoute, useRouter } from 'vue-router' // eslint-disable-line
import { Platform } from 'quasar'

export default {
  name: 'Post',

  setup (props) {
    const Share = inject('Share')
    const store = inject('store')
    const route = useRoute() // eslint-disable-line
    const router = useRouter() // eslint-disable-line

    const filter = store.global.state.niSettings.filter
    const host = store.global.state.niSettings.host
    const post = reactive(
      {
        title: '',
        content: '',
        featured_image: ''
      }
    )
    console.log('evo me na Postu: route', route)
    const allPosts = computed(() => store.global.state.posts)
    const favorites = ref(store.global.state.niSettings.favorites)
    const fvr = ref([])
    const isFavorite = ref(false)

    onMounted(async () => {
      console.log('MONTIRAN sam')
    }) // end onMounted

    onUpdated(() => {
      console.log('UPDATED')
    })

    function checkFavorite () {
      if (favorites.value != null) {
        isFavorite.value = favorites.value.includes(route.params.slug)
      } else {
        isFavorite.value = false
      }
    }

    console.log(route.params.slug)
    console.log('favorites 0: ', favorites.value)
    console.log('fvr 0: ', fvr.value)

    async function addToFavorites () {
      console.log('favorites 1: ', favorites.value) // ok
      if (favorites.value != null) {
        fvr.value = favorites.value
      }
      console.log('fvr 1: ', fvr.value)
      fvr.value.push(route.params.slug)
      console.log('fvr 2: ', fvr.value)
      await store.global.methods.updateSetting('favorites', fvr.value)
      checkFavorite()
    }

    async function removeFromFavorites () {
      console.log('removed')
      fvr.value = favorites.value
      console.log('fvr 1: ', fvr.value)
      const index = fvr.value.indexOf(route.params.slug)
      if (index > -1) {
        fvr.value.splice(index, 1)
      }
      await store.global.methods.updateSetting('favorites', fvr.value)
      console.log('fvr 2: ', fvr.value)
      checkFavorite()
    }

    async function getPost () {
      console.log('--- get POST')

      const selectedPost = await allPosts.value.find(el => el.slug === route.params.slug)
      post.title = selectedPost.title
      post.content = selectedPost.content
      post.featured_image = selectedPost.featured_image.large

    }
    async function getPolicy () {
      post.title = store.global.state.privacy[0].title.rendered
      post.content = store.global.state.privacy[0].content.rendered
      post.featured_image = ''
    }
    watch(
      () => route.params.slug,
      () => {
        if (route.name === 'Post') {
          if (route.params.slug === 'privacy') {
            getPolicy()
          } else {
            getPost()
            checkFavorite()
          }
        }
      },
      { immediate: true }
    )

    watch(isFavorite,
      () => {
        checkFavorite()
      })

    function goToHome () {
      console.log(filter)
      router.push({
        name: 'Home',
        params: {
          filter: filter
        }
      })
    }
    async function shareNI () {
      console.log('SHARE THIS')
      if (Platform.is.capacitor) {
        const link = 'https://' + host + '/' + route.params.slug

        try {
          const result = await Share.share({
            title: 'Zanimljiva nagradna igra',
            text: 'Mislim da bi te mogla zanimati ova nagradna igra.',
            url: link, // + '/' + route.params.slug,
            dialogTitle: 'Nagradna igra'
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

    return {
      store,
      getPost,
      getPolicy,
      post,
      filter,
      fvr,
      goToHome,
      shareNI,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      checkFavorite

    }
  }
}
</script>
-->
<style lang="scss">
.content h2 {
  font-size: 1.3rem;
  line-height: 1.2;
}

.content h3 {
  font-size: 1.5rem;
  line-height: 1.2;
}

.content_title {
  font-size: 1.5rem;
  line-height: 1.2;
}
</style>
