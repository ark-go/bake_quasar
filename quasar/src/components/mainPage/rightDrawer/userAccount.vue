<template>
  <q-expansion-item
    expand-separator
    icon="perm_identity"
    label="Пользователь"
    :caption="userStore.userInfo.username"
  >
    <q-item v-if="userStore.userInfo.email" clickable v-ripple @click="onClose">
      <q-item-section avatar>
        <q-icon name="logout" color="red" />
      </q-item-section>
      <q-item-section>
        <q-item-label overline>Выход</q-item-label>
        <q-item-label caption>
          {{ userStore.userInfo.email }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-else clickable v-ripple @click="onLogin">
      <q-item-section>
        <q-item-label>Вход</q-item-label>
        <q-item-label caption> Вход на сайт </q-item-label>
      </q-item-section>
    </q-item>
  </q-expansion-item>
</template>

<script>
import { axios } from "boot/axios";
import { defineComponent, nextTick, ref } from "vue";
import { useUserStore } from "stores/userStore.js";
import { useMainStore } from "stores/mainStore.js";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "userAccount",
  setup() {
    const userStore = useUserStore();
    const mainStore = useMainStore();
    const router = useRouter();
    console.log("user Store", userStore);
    const title = ref("");
    const caption = ref("");
    async function dataLoad() {
      try {
        let resp = await axios.post("/api/unLogin", {});
        let data = resp.data;
        if (!data.error) {
          console.log("Выход..", data);
          userStore.userInfo = {};
        }
        nextTick(() => {
          router.go();
        });
      } catch (err) {
        console.log("Выход не удался", err);
        nextTick(() => {
          router.go();
        });
        // userStore.userInfo = {};
      }
    }
    return {
      userStore,
      title,
      caption,
      async onClose() {
        await dataLoad();
      },
      onLogin() {
        mainStore.modalLoginOpen = true;
      },
    };
  },
});
</script>
