import { defineStore } from "pinia";

export const useTest = defineStore("test", {
  state: () => {
    return {
      // все эти свойства будут иметь свой тип автоматически
      counter: 0,
      testName: "Привет",
      isAdmin: true,
    };
  },
});
