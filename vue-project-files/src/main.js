/* eslint-disable */
import { createApp } from 'vue';
import App from './App.vue';
import AlertFunc from './second';
import Messages from './first';
import router from './router';
import store from './store';

const app = createApp(App);
app.use(router)
app.use(store)
app.mount("#app");


console.log(Messages.messageOne);
// AlertFunc(Messages.messageOne);
// AlertFunc(Messages.messageTwo);
