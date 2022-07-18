<template>
  <Ark-Card :subTitle="usersPanelStore?.currPath?.pathNameStr">
    <template v-slot:topSection>
      <Tab-Button v-model:tabModel="tabModel"></Tab-Button>
    </template>
    <template v-slot:splitBefore>
      <Users-Tree></Users-Tree>
    </template>
    <template v-slot:splitAfter>
      <q-tab-panels
        v-model="tabModel"
        animated
        keep-alive
        class="maxBodyHeight"
      >
        <q-tab-panel name="main" style="padding: 0">
          <Table-Panel tableName="tabUsers"></Table-Panel>
        </q-tab-panel>
        <q-tab-panel name="usersFilter" style="padding: 0">
          <Table-Panel tableName="tabUsers"></Table-Panel>
        </q-tab-panel>
        <q-tab-panel name="usersAll" style="padding: 0">
          <Table-Panel tableName="tabUsers"></Table-Panel>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </Ark-Card>
</template>

<script>
import { ref, defineComponent, watch } from "vue";
import ArkCard from "components/template/ArkCard/ArkCard.vue";
//import ArkCardSplitter from "components/template/ArkCard/ArkCardSplitter.vue";
import UsersTree from "./UsersTree.vue";
import TablePanel from "./usersAll/TablePanel.vue";
import TabButton from "./TabButton.vue";
import { useUsersPanelStore } from "stores/usersPanelStore.js";
export default defineComponent({
  name: " UsersPanel",
  components: {
    ArkCard,
    //   ArkCardSplitter,
    UsersTree,
    TablePanel,
    TabButton,
  },
  setup() {
    const tabModel = ref("main");
    const usersPanelStore = useUsersPanelStore();
    watch(
      [() => usersPanelStore.treeRow?.id, () => usersPanelStore.userRow],
      () => {
        console.log("Выбор трее", usersPanelStore.treeRow);
        console.log("Выбор user", usersPanelStore.userRow);
      }
    );
    return { tabModel, usersPanelStore };
  },
});
</script>
