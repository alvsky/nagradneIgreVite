import { reactive, readonly } from 'vue'
import { i18n } from 'boot/i18n'

const state = reactive({
    sections: {
        settings: {
            label: 'Postavke',
            link: 'settings',
            icon: 'mdi-cog-outline'
        },
        // appearance: {
        //     label: 'Izgled',
        //     link: 'settings',
        //     icon: ''
        // },
        help: {
            label: 'Pomoć',
            link: 'settings',
            icon: 'mdi-help'
        },
        // privacy: {
        //     label: 'Politika privatnosti',
        //     link: 'settings',
        //     icon: ''
        // }
    }
})

export default {
    state: readonly(state),
    // actions,
    // methods,
    // getters
};