<template>
  <div class="column no-wrap" style="max-height: inherit">
    <q-table
      ref="refTable"
      style="min-width: 100px; display: grid; overflow: auto"
      table-header-class="bg-grey-2"
      dense
      :filter="filter"
      no-data-label="Нет данных?"
      no-results-label="Ничего не найдено."
      class="my-sticky-virtscroll-table table-kagent-column-table"
      virtual-scroll
      v-model:pagination="paginationСatalog"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      title="Тип продукции"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      @row-dblclick="dblClickRow"
    >
      <!-- <template v-slot:body="props">
        <table-body :propsV="props" @onRowClick="onRowClick"></table-body>
      </template> -->
      <template v-slot:header="props">
        <Doc-Price-Table-Header :props="props"></Doc-Price-Table-Header>
      </template>
      <template v-slot:body="props">
        <Doc-Price-Table-Body
          :propsV="props"
          btn-type="Delete"
          @on-Row-Button="(val) => $emit('onDelete', val)"
          @on-Row-Button-Edit="(val) => $emit('onEdit', val)"
        ></Doc-Price-Table-Body>
      </template>
      <template v-slot:top-left>
        <div class="row">
          <!-- <q-btn flat round color="green" icon="add" @click="onAdd()" /> -->
          <!-- <div style="min-width: 25px"></div> -->
          <find-table v-model:filter="filter"></find-table>
        </div>
      </template>
      <template v-slot:top-right>
        <q-space />

        <q-select
          v-model="visibleColumns"
          multiple
          dense
          options-dense
          display-value="Вид"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          options-cover
          style="min-width: 30px"
        />
      </template>
      <template v-slot:no-data="dataslot">
        <no-data-footer :dataslot="dataslot"></no-data-footer>
      </template>
    </q-table>
  </div>
</template>

<script>
//import TableBody from "./TableBody.vue";
import { dataLoad } from "src/utils/ark.js";
import DocPriceTableBody from "./DocPriceTableBody.vue";
import DocPriceTableHeader from "./DocPriceTableHeader.vue";
import NoDataFooter from "components/NoDataFooter.vue";
import FindTable from "./FindTable.vue";
import { useDocPrice } from "stores/storeDocPrice.js";
import { ref, onMounted } from "vue";
export default {
  name: "DocPriceListTable",
  props: {
    rows: Array,
  },
  components: {
    NoDataFooter,
    FindTable,
    DocPriceTableBody,
    DocPriceTableHeader,
  },
  setup(props, { emit }) {
    const docPrice = useDocPrice();
    const visibleColumns = ref([]);
    //const rows = ref([]);
    const refTable = ref(null);
    onMounted(() => {
      // loadTable();
    });

    return {
      //  rows,
      visibleColumns,
      filter: ref(""),
      columns,
      docPrice,
      refTable,
      paginationСatalog: ref({
        rowsPerPage: 10,
      }),
    };
  },
};
let columns = [
  {
    name: "article",
    label: "Артикул",
    align: "left",
    field: "article",
    required: true,
  },
  {
    name: "price_name",
    label: "Название из документа",
    align: "left",
    field: "price_name",
    required: true,
  },
  {
    name: "cena",
    label: "Цена",
    align: "right",
    field: (row) => row.cena,
    format: (val) => `${val}`,
    required: true,
  },
  {
    name: "own_name",
    label: "Название в базе",
    align: "left",
    field: "own_name",
    required: true,
  },
  {
    name: "description",
    label: "Примечание",
    align: "left",
    field: "description",
  },
];
</script>
