/* eslint-disable */
// import { store } from 'quasar/wrappers'
// import { createStore } from 'vuex'
import global from './global/store-global'
import settings from './settings/store-settings'

const store = {
    global,
    settings
}

export default store

// export const store = () => {
//     return { global, settings }
// }

// export const store = () => {
// export default store(function (/* { ssrContext } */) {

    // const Store = {
    //     global,
    //     settings
    // }

    // return Store
//     return { global, settings }
// })

// export default {
//     install: (app, options) => {
//         // Plugin code goes here
//         const store = {
//             global,
//             settings
//         }

//         return store
//     }
// }