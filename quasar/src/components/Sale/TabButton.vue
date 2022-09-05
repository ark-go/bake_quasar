<template>
  <q-tabs
    v-model="tabModel"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="left"
    narrow-indicator
    mobile-arrows
    inline-label
  >
    <q-tab name="main" label="Выбор" />
    <q-tab name="bakeryItem" label="Продажи" v-show="bakerySelectedRow?.id" />
    <q-tab
      name="bufferItem"
      label="Загрузка"
      v-show="bakerySelectedRow?.id"
      :eeev-if="userStore.userInfo.email == 'Arkadii@yandex.ru'"
    />
  </q-tabs>
  <q-separator />
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useSaleStore, storeToRefs } from "stores/saleStore.js";
import { useUserStore } from "src/stores/userStore.js";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabButton",
  components: {},
  props: {},
  emits: ["update:tabModel"],
  setup(props) {
    const { bakerySelectedRow, tabModel } = storeToRefs(useSaleStore());
    const userStore = useUserStore();
    watch(
      () => bakerySelectedRow.value.id,
      () => {
        if (!bakerySelectedRow.value.id) {
          // сняли выбор документа
          tabModel.value = "main";
        }
      }
    );

    return { tabModel, userStore, bakerySelectedRow };
  },
});
</script>
