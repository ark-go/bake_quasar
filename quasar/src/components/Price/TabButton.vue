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
    <q-tab name="main" label="Документы" />
    <q-tab
      name="bakery"
      v-if="selectedRowDoc.datestart"
      :label="`Пекарни (${bakeryCount})`"
    />
    <!-- <q-tab name="docPrice" v-if="selectedRowDoc.name" label="Прайс" /> -->
    <q-tab
      name="priceValue"
      v-if="selectedRowDoc.datestart"
      :label="`Прайс (${priceValueCount})`"
    />
    <q-tab
      name="priceValueFranch"
      v-if="bakeryFranchPrice.length > 0"
      :label="`франчайзи (${bakeryFranchPrice.length})`"
    />
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
    const {
      selectedRowDoc,
      tabModel,
      selectBakeryShow,
      selectedRowBakery,
      selectedBakeryModal,
      selectedBakeryPrice,
      bakeryFranchPrice,
      bakeryCount,
      priceValueCount,
    } = storeToRefs(usePriceStore());
    watch(
      () => selectedRowDoc.value.id,
      () => {
        if (!selectedRowDoc.value.id) {
          // сняли выбор документа
          tabModel.value = "main";
        }
      }
    );
    watch(
      () => tabModel.value,
      () => {
        selectedBakeryModal.value = [];
        selectedBakeryPrice.value = [];
        selectedRowBakery.value = {};
        if (tabModel.value != "bakery") selectBakeryShow.value = false;
      }
    );
    return {
      selectedRowDoc,
      tabModel,
      bakeryFranchPrice,
      bakeryCount,
      priceValueCount,
    };
  },
});
</script>
