<template>
  <Splitter-Body>
    <template v-slot:before>
      <Buttons-Panel
        :refTable="refTable"
        v-model:activeTab="activeTab"
      ></Buttons-Panel>
    </template>
    <template v-slot:after>
      <Bakery-Table
        :ref="(val) => (refTable = val)"
        :noEditTable="true"
        :commandLoad="commandLoad"
        :componentBodyMenu="componentBodyMenu"
      ></Bakery-Table>
    </template>
  </Splitter-Body>
  <!-- <div class="grid-main maxBodyHeight">
    <div class="item-1"><Buttons-Panel></Buttons-Panel></div>
    <div class="item-2">
      <Bakery-Table :noEditTable="true"></Bakery-Table>
    </div>
  </div> -->
</template>

<script>
import { defineComponent, ref, defineAsyncComponent, onMounted } from "vue";
import BakeryTable from "components/Bakery/BakeryTable.vue";
import SplitterBody from "./SplitterBody.vue";
import { useSpravStore } from "stores/spravStore";

//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "FindTable",
  components: {
    BakeryTable,
    SplitterBody,
    ButtonsPanel: defineAsyncComponent(() => import("./ButtonsPanel.vue")),
  },
  props: {
    maxBodyHeight: String,
  },
  emits: ["update:filter"],
  setup(props) {
    const spravStore = useSpravStore();
    const refTable = ref();
    const activeTab = ref();
    const componentBodyMenu = defineAsyncComponent(() =>
      import("./TableBodyMenu.vue")
    );
    const commandLoad = ref({
      cmd: "load",
      // -100 нужно чтоб понять что мы передали чтото , если id нет например
      territory_id: spravStore.selectedRow.id || "-100",
    });
    onMounted(() => {
      commandLoad.value = {
        cmd: "load",
        terrytory: "yes", // нужно чтоб понять что мы передали чтото , если id нет напрмер
        territory_id: spravStore.selectedRow.id,
      };
    });
    return { commandLoad, spravStore, componentBodyMenu, refTable, activeTab };
  },
});
</script>
<style lang="scss" scoped>
.grid-main {
  display: grid;
  gap: 5px;
  grid-template-columns: 29% 70%;
  @media (max-width: 600px) {
    grid-template-columns: 100%;
  }
  background-color: transparent;
  .item-1,
  .item-2 {
    border-color: blue;
  }
}
</style>
