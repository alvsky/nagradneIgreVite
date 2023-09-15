import { reactive, readonly } from 'vue'
// import { i18n } from 'boot/i18n'
// let { t } = i18n.global

const state = reactive({
  sections: {
    settings: {
      label: 'Postavke',
      link: 'settings',
      icon: 'mdi-cog-outline'
    }
    // help: {
    //     label: 'Pomoć',
    //     // label: t('drawerHelp'),
    //     link: 'settings',
    //     icon: 'mdi-help'
    // },
    // privacy: {
    //     label: 'Politika privatnosti',
    //     link: 'settings',
    //     icon: ''
    // }$t('drawerComment')
  }
})

export default {
  state: readonly(state)
  // actions,
  // methods,
  // getters
}
