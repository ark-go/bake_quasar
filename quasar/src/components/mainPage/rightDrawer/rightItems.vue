<template>
  <q-list>
    <q-item clickable v-ripple @click="onClose">
      <q-item-section>
        <q-item-label>{{ userStore.userInfo.username }}</q-item-label>
        <q-item-label caption>
          {{ userStore.userInfo.email }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { axios } from "boot/axios";
import { defineComponent, nextTick, ref } from "vue";
import { useUserStore } from "stores/userStore.js";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "RightItems",
  setup() {
    const userStore = useUserStore();
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
    };
  },
});
</script>
