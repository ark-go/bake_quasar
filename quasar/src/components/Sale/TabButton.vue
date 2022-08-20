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
    <q-tab name="main" label="Сеть" />
    <q-tab name="bakeryItems" label="Пекарня" />
  </q-tabs>
  <q-separator />
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useSaleStore, storeToRefs } from "stores/saleStore.js";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabButton",
  components: {},
  props: {},
  emits: ["update:tabModel"],
  setup(props) {
    const { bakerySelectedRow, tabModel } = storeToRefs(useSaleStore());
    watch(
      () => bakerySelectedRow.value.id,
      () => {
        if (!bakerySelectedRow.value.id) {
          // сняли выбор документа
          tabModel.value = "main";
        }
      }
    );
    // watch(
    //   () => tabModel.value,
    //   () => {
    //     if (tabModel.value != "bakery") selectBakeryShow.value = false;
    //   }
    // );
    return { tabModel };
  },
});
</script>
