import {createStore} from 'vuex'
import {ElMessage} from 'element-plus'
import {invoke} from '@tauri-apps/api'

const store = createStore({
    state() {
        return {
            connectionList: [],
            menuShow: true,
            clientInfo: {},
            pubsub: []
        }
    },
    getters: {
        clientInfo: state => state.clientInfo,
        menuShow: state => state.menuShow,
        connectionList: state => state.connectionList,
        pubsub: state => state.pubsub
    },
    mutations: {
        updatePubSub(state, payload) {
            const {channel, data} = payload
            let len = 0;
            let start = -1
            for (let index in state.pubsub) {
                if (state.pubsub[index].key === channel) {
                    if (start == -1) {
                        start = index
                    }
                    len += 1
                }
            }
            if (len >= 10) {
                state.pubsub.push({
                    key:channel,
                    ...data
                })
                state.pubsub.splice(start,1)
            } else {
                state.pubsub.push({
                    key:channel,
                    ...data
                })
            }
        },
        updateConnectionList(state, list) {
            state.connectionList = list
        },
        updateMenuShow(state) {
            state.menuShow = !state.menuShow
        },
        updateClientInfo(state, data) {
            state.clientInfo = data
        }
    },
    actions: {
        async getConnectionList({commit}) {
            let res = await invoke('connection_list')
                .catch(e => {
                    ElMessage.error(e.toString())
                    return Promise.reject(e.toString())
                })
            if (res && res.code === 200) {
                commit('updateConnectionList', res.data)
            } else {
                ElMessage.error(res.msg)
                return Promise.reject(res.msg)
            }
            return Promise.resolve()
        },
        async getConnectionInfo({commit}) {
        },
        insertPubSubData({commit}, payload) {
            commit('updatePubSub', payload)
        },
        toggleMenuShow({commit}) {
            commit('updateMenuShow')
        },
        setClientInfo({commit}, data) {
            commit('updateClientInfo', data)
        }
    }
})
export default store
