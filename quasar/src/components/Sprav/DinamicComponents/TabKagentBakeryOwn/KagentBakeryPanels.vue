<template>
  <Splitter-Body>
    <template v-slot:before>
      <Buttons-Panel
        :refTable="refTable"
        v-model:activeTab="activeTab"
      ></Buttons-Panel>
    </template>
    <template v-slot:after>
      <q-tab-panels v-model="activeTab" animated swipeable>
        <q-tab-panel name="groupBakery"
          ><table-panel-group
            tableName="kagentBakeryOwn"
            title="Пекарни в текщей группе"
            :commandLoad="commandLoad"
            :territoryRow="spravStore.selectedRow"
          ></table-panel-group
        ></q-tab-panel>
        <q-tab-panel name="freeBakery">
          <table-panel-free
            tableName="kagentBakeryOwn"
            title="Пекарни без группы"
            :territoryRow="spravStore.selectedRow"
          ></table-panel-free
        ></q-tab-panel>
        <q-tab-panel name="busyBakery">
          <table-panel-busy
            tableName="kagentBakeryOwn"
            panelName="busyBakery"
            title="Пекарни в других группах"
            :territoryRow="spravStore.selectedRow"
          ></table-panel-busy>
        </q-tab-panel>
        <q-tab-panel name="allBakery">
          <table-panel-all
            title="Все пекарни"
            tableName="kagentBakeryOwn"
            :territoryRow="spravStore.selectedRow"
          ></table-panel-all>
        </q-tab-panel>
      </q-tab-panels>

      <!-- <Bakery-Table
        :ref="(val) => (refTable = val)"
        :noEditTable="true"
        :commandLoad="commandLoad"
        :componentBodyMenu="componentBodyMenu"
      ></Bakery-Table> -->
    </template>
  </Splitter-Body>
</template>
<style lang="scss">
.q-tab-panel {
  padding: 0;
}
</style>
<script>
import { defineComponent, ref, defineAsyncComponent, onMounted } from "vue";
//import BakeryTable from "components/Bakery/BakeryTable.vue";
import SplitterBody from "./SplitterBody.vue";
import { useSpravStore } from "stores/spravStore";

//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "FindTable",
  components: {
    TablePanelAll: defineAsyncComponent(() =>
      import("./table_all/TablePanel.vue")
    ),
    TablePanelBusy: defineAsyncComponent(() =>
      import("./table_busy/TablePanel.vue")
    ),
    TablePanelFree: defineAsyncComponent(() =>
      import("./table_free/TablePanel.vue")
    ),
    TablePanelGroup: defineAsyncComponent(() =>
      import("./table_group/TablePanel.vue")
    ),
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
    const activeTab = ref("groupBakery");
    // const componentBodyMenu = defineAsyncComponent(() =>
    //   import("./TableBodyMenu.vue")
    // );
    const commandLoad = ref({
      cmd: "load",
      // -100 нужно чтоб понять что мы передали чтото , если id нет например
      territory_id: spravStore.selectedRow.id || "-100",
    });

    onMounted(() => {
      // commandLoad.value = {
      //   cmd: "load",
      //   terrytory: "yes", // нужно чтоб понять что мы передали чтото , если id нет напрмер
      //   territory_id: spravStore.selectedRow.id,
      // };
    });
    return { commandLoad, spravStore, refTable, activeTab };
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
