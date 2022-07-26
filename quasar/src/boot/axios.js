import { boot } from "quasar/wrappers";
import axios from "axios";
import mitt from "mitt";
import { Cookies } from "quasar";
import { useUserStore } from "stores/userStore.js";
import { useMainStore } from "stores/mainStore.js";
//import { useQuasar } from "quasar";
const emitter = mitt();
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
//const api = axios.create({ baseURL: "http://172.16.172.10:8878" });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  //app.config.globalProperties.$api = api;
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

  axios.interceptors.response.use(
    (response) => {
      const user = useUserStore();
      // входящий сюда
      console.log("axios вход ", response.headers?.["x-info-site"]);
      console.log("response:", response);
      if (response.headers?.["x-info-site"] == "NoLogin") {
        user.userInfo = {};
        user.isAllowPath = response.data?.isAllowPath || [];
        //! TODO: Проверить и восстановить
        // let mainStore = useMainStore();
        // mainStore.modalLoginOpen = true;
        // было отключено emitter.emit("on-login", "NoLogin");
      } else {
        user.isAllowPath = [];
      }

      return response;
    }
    // (error) => {
    //   if (error.response) {
    //     console.log("Ошипка ", error.response.status);
    //     if (error.response.status == 429) {
    //       // const $q = useQuasar();
    //       // $q.notify({
    //       //   classes: "notify-error-top",
    //       //   color: "red",
    //       //   position: "top",
    //       //   message: "Слишком много запросов",
    //       //   icon: "report_problem",
    //       // });
    //     }
    //   }
    // }
  );

  axios.interceptors.request.use(function (config) {
    // исходящий  туда
    const user = useUserStore();
    user.isAdmin = true;
    //! только чтоб не посылать, лишний раз запросы если было закрыто.
    //! т.е. если уже было запрещено, то не стоит и посылать запрос, пока не пройдет разрешение
    // вобщемэто можно отключить - пока не вижу нужности
    if (user.isAllowPath && user.isAllowPath.length > 0) {
      if (!user.isAllowPath.includes(config.url.replace(new RegExp("^/api")))) {
        return Promise.reject(new Error("Запрещено."));
      }
    }
    //! ------
    //const value = Cookies.getAll(); //
    //получим таймзону и засунем header
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("TimeZone", tz);
    // const token = localStorage.getItem('token');
    config.headers.timezone = tz;
    config.headers.Authorization = "xxArkxx1"; //token ? `Bearer ${token}` : '';
    return config;
  });
  // -----XXXXXXXXXXX
});

export { axios, emitter };

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
