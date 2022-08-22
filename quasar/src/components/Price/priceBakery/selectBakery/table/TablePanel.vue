<template>
  <Table-Template
    v-if="tableName"
    :title="title"
    :rows="RowsModalBakery"
    :columns="columns"
    :tableFunc="tableFunc"
    @onInfoRow="onInfoRow"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onAdd="onRowClick"
    noExpandPanel
    noTitlePanel
    noEditTable
    :rowsPerPage="0"
    row-key="id"
    selection="multiple"
    :selected="selected"
    @update:selected="$emit('update:selected', $event)"
  >
  </Table-Template>
  <div v-else>не указана таблица</div>
</template>
<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  onMounted,
  watch,
} from "vue";
import { useTableFunc } from "./tableFunc.js";
import { columns } from "./tableColumnList.js";
import { usePriceStore, storeToRefs } from "stores/priceStore.js";
export default defineComponent({
  name: "TablePanel",
  components: {
    TableTemplate: defineAsyncComponent(() => {
      return import("src/components/template/table/TableTemplate.vue");
    }),
  },
  props: {
    modeBody: {
      type: String,
      default: "view",
    },
    tableName: {
      type: String,
      default: "tabPrice", // для запроса с сервера
    },
    title: {
      type: String,
      default: "Пекарни в документе",
    },
    checkReload: Boolean,
    panelName: String,
    selected: Array,
  },
  emits: [""],
  setup(props, { emit }) {
    const tableFunc = useTableFunc(props.tableName);
    const priceStore = usePriceStore();
    const { selectedBakeryModal, RowsModalBakery } = storeToRefs(
      usePriceStore()
    );

    // const currentRow = ref({});
    const pagination = ref({
      rowsPerPage: 10,
    });
    onMounted(async () => {
      await tableFunc.loadTable();
    });
    return {
      pagination,
      RowsModalBakery,
      columns,
      tableFunc,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick(row) {
        console.log("Нажали по строке");
        let i = selectedBakeryModal.value.findIndex((val) => {
          if (val.id == row.id) return true;
        });
        if (i != -1) {
          selectedBakeryModal.value.splice(i, 1);
        } else {
          selectedBakeryModal.value.push(row);
        }
        console.log("Выбрано чтото", selectedBakeryModal.value);
      },
    };
  },
});
</script>
