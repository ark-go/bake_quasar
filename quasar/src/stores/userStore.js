import { defineStore } from "pinia";

export const useUserStore = defineStore("UserStore", {
  state: () => {
    return {
      // все эти свойства будут иметь свой тип автоматически
      role: [],
      name: "Без авторизации",
      isAdmin: true,
      userInfo: {},
    };
  },
});
