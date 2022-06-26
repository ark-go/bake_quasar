<template>
  <q-page class="flex flex-center">
    <table-panel tableName="bakery"></table-panel>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import TablePanel from "src/components/Sprav/DinamicComponents/TabTerritory/TablePanel.vue";

export default defineComponent({
  name: "PageIndex",
  components: { TablePanel },
  setup() {
    return {};
  },
});
</script>
