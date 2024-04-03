import { defineStore } from "pinia"
import {ref} from 'vue'

export const useUserInfoStore = defineStore('userInfo',()=>{
    //1.定义用户信息
    const info = ref({})
    //2.定义修改用户信息的方法
    const setInfo = (newInfo)=>{
        info.value = newInfo
    }
    //3.定义清空用户信息的方法
    const removeInfo = ()=>{
        info.value={}
    }

    return{info,setInfo,removeInfo}
},{
    persist:true
})

export const UsernameStore = defineStore('userUsername',()=>{
    //1.定义用户信息
    const username = ref({})
    //2.定义修改用户信息的方法
    const setUsername = (newUsername)=>{
        username.value = newUsername
    }
    //3.定义清空用户信息的方法
    const removeUsername = ()=>{
        username.value={}
    }
    return{username,setUsername,removeUsername}
},{
    persist:true
})