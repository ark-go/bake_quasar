<template>
  <q-tabs
    v-model="tabModelBottom"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    switch-indicator
  >
    <q-tab name="sideTab" label="Выбор" />
    <q-tab name="dataTab" label="Список" />
  </q-tabs>
  <q-separator />
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { usePriceStore, storeToRefs } from "stores/priceStore.js";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabButton",
  components: {},
  props: {},
  emits: ["update:tabModel"],
  setup(props) {
    const priceStore = usePriceStore();
    const {
      selectedRowDoc,
      tabModel,
      selectBakeryShow,
      selectedRowBakery,
      selectedBakeryModal,
      selectedBakeryPrice,
      bakeryCount,
      priceValueCount,
    } = storeToRefs(usePriceStore());
    priceStore.watchStore(() => {
      return watch(
        () => selectedRowDoc.value.id,
        () => {
          if (!selectedRowDoc.value.id) {
            // сняли выбор документа
            tabModel.value = "main";
          }
        }
      );
    });
    priceStore.watchStore(() => {
      return watch(
        () => tabModel.value,
        () => {
          selectedBakeryModal.value = [];
          selectedBakeryPrice.value = [];
          selectedRowBakery.value = {};
          if (tabModel.value != "bakery") selectBakeryShow.value = false;
        }
      );
    });
    return {
      selectedRowDoc,
      tabModel,
      bakeryCount,
      priceValueCount,
    };
  },
});
</script>
