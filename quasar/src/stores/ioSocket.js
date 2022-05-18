import { defineStore } from "pinia";
import { io } from "socket.io-client";

export const useIoSocket = defineStore("IoSocket", {
  state: () => {
    return {
      //все эти свойства будут иметь свой тип автоматически

      timeServer: "",
      onLine: false,
      versionSite: "",
      socket: null,
      socketMain: io(),
    };
  },
});
