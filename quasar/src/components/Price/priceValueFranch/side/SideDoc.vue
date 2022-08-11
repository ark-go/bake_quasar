<template>
  <Table-Panel></Table-Panel>
</template>
<script>
import { defineComponent, ref } from "vue";
import { usePriceStore, storeToRefs } from "stores/priceStore";
import TablePanel from "./table/TablePanel.vue";
//import TabsTables from "./TabsTables.vue";
export default defineComponent({
  name: "SideDoc",
  components: { TablePanel },
  props: ["refTable", "activeTab"],
  emits: ["update:filter"],
  setup(props, { emit }) {
    //  const priceStore = useSpravStore();
    const { selectedRowPrice } = storeToRefs(usePriceStore());
    console.log("Выбрана строка", selectedRowPrice.value);

    return {
      selectedRowPrice,
      sideExpand: ref(false),
    };
  },
});
</script>
