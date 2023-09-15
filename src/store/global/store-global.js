/* eslint-disable */
import { reactive, readonly } from "vue";
import { useI18n } from 'vue-i18n'
import { date, LocalStorage, Dialog } from "quasar";
// const { subtractFromDate } = date
// let { t } = useI18n({ useScope: 'global' })
// { label: 'Hrvatska', name: 'hr', host: 'nagradnaigra.com.hr', icon: 'img:https://hatscripts.github.io/circle-flags/flags/hr.svg' },
// { label: 'Srbija', name: 'rs', host: 'nagradneigrers.com', icon: 'img:https://hatscripts.github.io/circle-flags/flags/rs.svg' },
// { label: 'Slovenija', name: 'si', host: 'nagradneigresi.com', icon: 'img:https://hatscripts.github.io/circle-flags/flags/si.svg' }

// TODO dodati verziju aplikacije u store
const state = reactive({
  versionCode: '26',
  versionName: '0.1.4',
  posts: LocalStorage.getItem('nagradneIgre') || [],
  onlineSettings: LocalStorage.getItem('onllineSettings') || [],
  niSettings: LocalStorage.getItem('niSettings'),
  countries: [
    { label: 'Hrvatska', name: 'hr', locale: 'hr', host: 'nagradnaigra.com.hr', icon: 'img:flags/hr.svg' },
    { label: 'Srbija', name: 'rs', locale: 'sr', host: 'nagradneigrers.com', icon: 'img:flags/rs.svg' },
    { label: 'Slovenija', name: 'si', locale: 'sl', host: 'nagradneigresi.com', icon: 'img:flags/si.svg' }
  ],

  filters: [
    {
      name: 'active',
      label: 'Aktivne',
      getFiltered (posts) {
        const filteredPosts = posts.filter((el) => {
          const krajDate = el.kraj.year + "-" + el.kraj.month + "-" + el.kraj.day
          const dateKraj = new Date(krajDate)
          const today = new Date()
          return dateKraj >= today
        })
        return filteredPosts

      }
    },
    {
      name: 'favorites',
      label: 'Pratim',
      getFiltered (posts) {
        const filteredPosts = posts.filter((el) => {

          if (!state.niSettings.favorites) {
            state.niSettings.favorites = []
          }
          const fav = state.niSettings.favorites
          const slug = el.slug
          const fvr = fav.includes(slug)

          return fav.includes(slug)
        })
        return filteredPosts
      }
    },
    {
      name: 'ending',
      label: 'Završavaju',
      getFiltered (posts) {
        const filteredPosts = posts.filter(function (el) {
          const krajDate = el.kraj.year + "-" + el.kraj.month + "-" + el.kraj.day
          const dateKraj = new Date(krajDate)
          const today = new Date()
          return (
            dateKraj >= today &&
            today >= date.subtractFromDate(dateKraj, { days: 7 })
          )
        })
        return filteredPosts
      }
    },
    {
      name: 'winners',
      label: 'Objava dobitnika',
      getFiltered (posts) {
        const filteredPosts = posts.filter(function (el) {
          const objavaDate = el.objava.year + "-" + el.objava.month + "-" + el.objava.day
          const today = new Date()
          const dateObjava = new Date(objavaDate).getTime()// / 1000
          // // const objavaNum = el.objava.year + "" + el.objava.month + "" + el.objava.day
          return (
            // dateObjava <= date.addToDate(today, { days: 10 })
            dateObjava >= today &&
            dateObjava <= date.addToDate(today, { days: 31 })
          )
        })
        // return filteredPosts.sort((a, b) => (a.dateObjava > b.dateObjava) ? 1 : -1)
        // return filteredPosts.sort((a, b) => (a.objava.year < b.objava.year) ? 1 : (a.objava.year === b.objava.year) ? ((a.objava.month < b.objava.month) ? 1 : -1) : -1)
        return filteredPosts.sort((a, b) =>
          (a.objava.year > b.objava.year) ? 1 :
            (a.objava.year === b.objava.year) ?
              ((a.objava.month > b.objava.month) ? 1 :
                (a.objava.month === b.objava.month) ?
                  ((a.objava.day > b.objava.day) ? 1 : -1) : -1)
              : -1)
      }
    },
    {
      name: 'polling',
      label: 'Izvlačenje',
      getFiltered (posts) {
        const filteredPosts = posts.filter(function (el) {
          const izvlacenjeDate = el.izvlacenje.year + "-" + el.izvlacenje.month + "-" + el.izvlacenje.day
          const today = new Date()
          const dateIzvlacenje = new Date(izvlacenjeDate).getTime()// / 1000
          return (
            dateIzvlacenje >= today &&
            dateIzvlacenje <= date.addToDate(today, { days: 31 })
          )
        })
        // return filteredPosts.sort((a, b) => (a.dateIzvlacenje < b.dateIzvlacenje) ? 1 : -1)
        return filteredPosts.sort((a, b) =>
          (a.izvlacenje.year > b.izvlacenje.year) ? 1 :
            (a.izvlacenje.year === b.izvlacenje.year) ?
              ((a.izvlacenje.month > b.izvlacenje.month) ? 1 :
                (a.izvlacenje.month === b.izvlacenje.month) ?
                  ((a.izvlacenje.day > b.izvlacenje.day) ? 1 : -1) : -1)
              : -1)
      }
    },
    {
      name: 'all',
      label: 'Sve',
      getFiltered (posts) {
        return posts
      }
    },

  ],
  privacy: LocalStorage.getItem('policy') || [],
  selectedPost: {
    id: "",
    title: "",
    slug: "",
    content: "",
    image: "",
  }
})

const actions = {

  // async fetchSettings () {
  //   console.log('§§§§§ Fetching SETTINGS')
  //   // console.log(state.onlineSettings)
  //   await fetch('https://nagradnaigra.com.hr/niapp/online_settings.json', {
  //     method: "GET",
  //     mode: "cors",
  //     headers: {
  //       "Content-Type": "application/json; charset=utf-8",
  //       "Pragma": "no-chache",
  //       "Cache-control": "no-chache"
  //     },
  //   }).then(response => response.json())
  //     // .then(text => console.log(JSON.parse(JSON.stringify(text))))
  //     // .then(text => console.log(JSON.parse(text)))
  //     .then(data => {
  //       console.log(data)
  //       state.onlineSettings = data
  //       LocalStorage.set("onlineSettings", state.onlineSettings)
  //     })
  //   console.log(state.onlineSettings[0].features)
  // },

  async fetchSettings () {
    console.log('§§§§§ Fetching SETTINGS')
    const response = await fetch('https://nagradnaigra.com.hr/niapp/online_settings.json', {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Pragma": "no-cache",
        "Cache-control": "no-cache"
      },
    })
    state.onlineSettings = await response.json()
    console.log(response)

    console.log(state.onlineSettings[0].features)
    LocalStorage.set("onlineSettings", state.onlineSettings)
  },

  async fetchPosts (host) {
    console.log('+ + + ! ! ! FETCHED NEW POSTS (' + host + ')')
    const response = await fetch(`https://${host}/wp-json/alvi/v1/posts`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Pragma": "no-cache",
          "Cache-control": "no-cache"
        },
      })
    state.posts = await response.json()
    console.log(response)
    LocalStorage.set("nagradneIgre", state.posts)
  },

  // async fetchPosts (host) {
  //   try {
  //     state.posts = await (
  //       await fetch(`https://${host}/wp-json/alvi/v1/posts`, {
  //         method: "GET",
  //         mode: "cors",
  //         headers: {
  //           "Content-Type": "application/json; charset=utf-8",
  //           "Pragma": "no-cache",
  //           "Cache-control": "no-cache"
  //         },
  //       })
  //     ).json()
  //     LocalStorage.set("nagradneIgre", state.posts)

  //     // console.log(response.json)
  //     // methods.filterActiveNI(); // pozovi filterActiveNI() metodu iz store/index.js
  //     // methods.filterEndingSoonNI(); // pozovi filterEndingSoonNI() metodu iz store/index.js
  //     // state.filteredPosts = state.posts; // ubaci sve postove u filteredPosts da ih prikažem odmah
  //   } catch (err) {
  //     console.error(err)
  //   }
  // },

  async fetchPrivPolicy (country) {
    // console.log('......fetchPrivPolicy')
    let ppLink = ""
    // console.log('ppLink1:', ppLink)

    if (country === 'hr') {
      ppLink = "https://nagradnaigra.com.hr/wp-json/wp/v2/pages?slug=pravila-privatnosti"
    } else if (country === 'rs') {
      ppLink = "https://nagradneigrers.com/wp-json/wp/v2/pages?slug=politika-privatnosti"
    } else {
      ppLink = "https://nagradneigresi.com/wp-json/wp/v2/pages?slug=politika-zasebnosti"
    }
    // console.log('ppLink2:', ppLink)

    try {
      state.privacy = await (
        await fetch(ppLink, {
          method: "GET",
          mode: "cors",
          headers: { "Content-Type": "application/json; charset=utf-8" },
        })
      ).json()
      LocalStorage.set("policy", state.privacy)
      // console.log(state.privacy[0].id, typeof (state.privacy))
      // console.log(state.privacy[id])

      // methods.filterActiveNI(); // pozovi filterActiveNI() metodu iz store/index.js
      // methods.filterEndingSoonNI(); // pozovi filterEndingSoonNI() metodu iz store/index.js
      // state.filteredPosts = state.posts; // ubaci sve postove u filteredPosts da ih prikažem odmah
    } catch (err) {
      console.error(err)
    }
  },
  async updateHost (country) {
    const host = state.countries.find(el => el.name === country).host
    methods.updateSetting('country', country)
    methods.updateSetting('host', host)
    await actions.fetchPosts(host)
    await actions.fetchPrivPolicy(country)
  },

  async updateCountry (country) {
    // const host = state.countries.find(el => el.name === country).host
    const cntry = state.countries.find(el => el.name === country)
    // console.log('xxxxx   cntry', cntry)

    methods.updateSetting('drzava', cntry)
    // methods.updateSetting('host', host)
    // await actions.fetchPosts(host)
    // await actions.fetchPrivPolicy(country)
  },
  async updateUser (firstName, lastName, gender, oib, email, phone, zemlja, city, street) {
    // console.log('xxxxx   firstName: ', firstName)
    const korisnik = {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      pid: oib,
      country: zemlja,
      city: city,
      postalCode: '',
      street: street,
      email: email,
      phone: phone,
      birthDay: '',
      birthMonth: '',
      birthYear: ''
    }
    // const host = state.countries.find(el => el.name === country).host
    // console.log('xxxxx   USER', korisnik)

    methods.updateSetting('user', korisnik)

  },
  async updateSlug (slug) {
    const host = state.countries.find(el => el.name === slug).host
    methods.updateSetting('slug', slug)
    methods.updateSetting('host', host)
    await actions.fetchPosts(host)
  },
  async setSuglasnost () {
    console.log('setting suglasnost')

    state.niSettings.suglasnost = true

  }
}

const methods = {

  updateSetting (key, val) {
    state.niSettings[key] = val
    console.log('updateSetting', key, val)

    try {
      LocalStorage.set('niSettings', state.niSettings)
    } catch (err) {
      console.error(err)
    }
  },

  createOnlineSettings () {
    const settings = {

    }
    LocalStorage.set('onlineSettings', settings)
    // state.onlinSettings = settings
  },

  createSettings (key, val) {
    const settings = {
      suglasnost: false,
      npa: '0',
      showUserData: '0',
      bannerHeight: '61',
      user: {
        firstName: null,
        lastName: null,
        gender: null,
        pid: null,
        country: null,
        city: null,
        postalCode: null,
        street: null,
        email: null,
        phone: null,
        birthDay: null,
        birthMonth: null,
        birthYear: null

      },
      favorites: null,
      country: null,
      locale: 'hr',
      drzava: {
        label: null,
        name: null,
        host: null,
        icon: null
      },
      filter: 'active', // default filter
      host: null,
      slug: null,
      theme: 'default',
      'text-size': 'md'
    }
    LocalStorage.set('niSettings', settings)
    state.niSettings = settings
  },

  fillSellectedPost (id, title, slug, content, image) {
    state.selectedPost.id = id
    state.selectedPost.title = title
    state.selectedPost.slug = slug
    state.selectedPost.content = content
    state.selectedPost.image = image
  }
}

const getters = {
  getOnlineSettings () {
    return state.onlineSettings
  },

  getPost () {
    return state.posts
  },

  // dohvati sve NI
  getAllNI () {
    return state.posts
  },

  // dohvati sve aktivne NI (datum KRAJ >= DANAS)
  getActiveNI () {
    const newArray = state.posts.filter((el) => {
      const krajDate = el.kraj.year + "-" + el.kraj.month + "-" + el.kraj.day
      // console.log({ krajDate })
      // const dateKraj = new Date(krajDate)
      // const today = new Date()
      // return dateKraj >= today
    })
  },

  // dohvati sve NI koje završavaju za 7 dana
  getEndingSoonNI () {
    const newArray = state.posts.filter(function (el) {
      const krajDate = el.kraj.year + "-" + el.kraj.month + "-" + el.kraj.day;
      const dateKraj = new Date(krajDate);
      const today = new Date();
      return (
        dateKraj >= today &&
        today >= date.subtractFromDate(dateKraj, { days: 7 })
      );
    });
    state.endingSoonNI = newArray;
    state.endingSoonNICount = newArray.length;
    state.filteredPosts = newArray;

    // console.log('Uskoro završavaju NI', state.endingSoonNICount, state.endingSoonNI)
  },

  getLangCountryIcon () {
    const langCountry = state.countries.filter(el => el.locale === state.niSettings.locale)
    return langCountry[0].icon
  },

  getCountryIcon () {
    const country = state.countries.filter(el => el.name === state.niSettings.country)
    return country[0].icon
  },

  getVersionCode () {
    return state.versionCode
  },
  getVersionName () {
    return state.versionName
  },
  getSuglasnost () {
    return state.niSettings.suglasnost
  },
}

export default {
  // state: readonly(state),
  state,
  actions,
  methods,
  getters,
};
