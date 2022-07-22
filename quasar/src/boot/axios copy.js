import { boot } from "quasar/wrappers";
import axios from "axios";
import mitt from "mitt";
import { Cookies } from "quasar";
import { useUserStore } from "stores/userStore.js";
import { useMainStore } from "stores/mainStore.js";
import { Notify } from "quasar";
const emitter = mitt();
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: "http://172.16.172.10:8878" });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  app.config.globalProperties.$emitter = emitter;
  //------XXXXXXXXXXX
  // const defaultOptions = {
  //   baseURL: "",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // };

  // Create instance
  //axiosArk = axios.create(defaultOptions);

  // Set the AUTH token for any request
  // linux///

  axios.interceptors.response.use((response) => {
    const user = useUserStore();
    // входящий сюда
    console.log("axios вход ", response.headers?.["x-info-site"]);
    // console.log("Response:",response);
    if (response.headers?.["x-info-site"] == "NoLogin") {
      user.userInfo = {};
      //! TODO: Проверить и восстановить
      let mainStore = useMainStore();
      mainStore.modalLoginOpen = true;
      // было выключено emitter.emit("on-login", "NoLogin");
    }
    if (response.status == 429) {
      Notify.create({
        classes: "notify-error-top",
        color: "red",
        position: "top",
        message: "Слишком много запросов",
        icon: "report_problem",
      });
    }
    return response;
  });

  axios.interceptors.request.use(function (config) {
    const user = useUserStore();
    user.isAdmin = true;
    // исходящий  туда
    //const value = Cookies.getAll(); //
    //console.log("axios xxx:" + JSON.stringify(value));
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("TimeZone", tz);
    // const token = localStorage.getItem('token');
    config.headers.timezone = tz;
    config.headers.Authorization = "xxArkxx1"; //token ? `Bearer ${token}` : '';
    return config;
  });
  // -----XXXXXXXXXXX
});

export { axios, api, emitter };

/*

// Добавляем перехватчик запросов
axios.interceptors.request.use(function (config) {
         // Что делать перед отправкой запроса
    return config;
  }, function (error) {
         // Что делать с ошибками запроса
    return Promise.reject(error);
  });
 
 // Добавляем перехватчик ответа
axios.interceptors.response.use(function (response) {
         // что-то делаем с данными ответа
    return response;
  }, function (error) {
         // делаем что-нибудь с ошибкой ответа
    return Promise.reject(error);
  });
*/
