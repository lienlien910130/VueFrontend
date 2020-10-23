import { Message } from 'element-ui'
import router from './router'

export const tip = msg => {
    Message.error(msg)
}

export const toLogin = () =>{
    router.replace({
        name:'Login',
        query:{
            redirect: router.currentRoute.fullPath
        }
    })
}