<template>
  <q-menu auto-close touch-position context-menu>
    <q-list>
      <q-item clickable @click="onDeleteFromGroup">
        <q-item-section>Удалить из группы</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Не работает</q-item-section>
      </q-item>
      <q-item clickable @click="onNiht">
        <q-item-section>Нихт кликен</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
import { defineComponent, ref } from "vue";
import { dataLoad } from "src/utils/ark.js";
// для  свойства componentBodyMenu у Table
export default defineComponent({
  name: "TableBodyMenu",
  components: {},
  props: {
    row: {
      type: Object,
      default: () => {},
    },
    funcTable: {
      type: Function,
      default: () => null,
    },
    tableName: {
      type: String,
      default: "",
    },
  },
  emits: ["update:dva"],
  setup(props) {
    console.log("menu props:", props);
    const rows = ref([]);
    async function onDeleteFromGroup() {
      //! лишнее заглущка ?
      await commandTable();
    }
    async function commandTable() {
      console.log("хотим удалить", props.row?.id);
      // let res = await dataLoad(
      //   "/api/bakery",
      //   { cmd: "deleteFromGroup", id: props.row?.id },
      //   "Удаляем из группы пекарен"
      // );
      console.log("refTable", props.funcTable);
      if (props.funcTable) {
        let r = await props.funcTable();
      }
      // if (res.result) {
      //   rows.value = res.result;
      // } else {
      //   rows.value = [];
      // }
    }
    return {
      onDeleteFromGroup,
      onNiht() {
        console.log("menu nixt", props.row, props.tableName);
      },
    };
  },
});
</script>
