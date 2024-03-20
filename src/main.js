import './assets/main.scss'
import  ElementPlus from 'element-plus'
import  'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import {createPinia} from 'pinia'
import {createPersistedState} from 'pinia-persistedstate-plugin'
const app= createApp(App);
const pinia =createPinia();
const persist =createPersistedState();
app.use(pinia);
pinia.use(persist);//在pinia中使用
app.use(ElementPlus);
app.use(router);

app.mount('#app')
