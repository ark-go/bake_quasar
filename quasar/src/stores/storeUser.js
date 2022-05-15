import { defineStore } from "pinia";

export const useUser = defineStore("user", {
  state: () => {
    return {
      // все эти свойства будут иметь свой тип автоматически
      role: [],
      name: "Без авторизации",
      isAdmin: true,
      info: {},
    };
  },
});
