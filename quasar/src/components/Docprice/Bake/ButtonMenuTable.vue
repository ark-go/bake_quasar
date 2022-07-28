<template>
  <div class="column no-wrap" style="max-height: inherit">
    <q-table
      ref="refTable"
      style="min-width: 100px; display: grid; overflow: auto"
      table-header-class="bg-grey-2"
      dense
      :filter="filter"
      :no-data-label="
        'У контрагента ' +
        docPrice.currRowDoc.kagent_name +
        ' нет пекарен для этого документа.'
      "
      no-results-label="Ничего не найдено."
      class="my-sticky-virtscroll-table table-kagent-column-table"
      virtual-scroll
      v-model:pagination="paginationСatalog"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      title="Пекарни контрагента"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      @row-dblclick="dblClickRow"
    >
      <template v-slot:header="props">
        <Button-Menu-Table-Header :props="props"></Button-Menu-Table-Header>
      </template>
      <template v-slot:body="props">
        <Button-Menu-Table-Body
          :propsV="props"
          btn-type="Add"
          @on-Row-Button="(val) => $emit('onAddBake', val)"
        ></Button-Menu-Table-Body>
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
import ButtonMenuTableBody from "./ButtonMenuTableBody.vue";
import ButtonMenuTableHeader from "./ButtonMenuTableHeader.vue";
import NoDataFooter from "components/NoDataFooter.vue";
import FindTable from "./FindTable.vue";
import { useDocPrice } from "stores/storeDocPrice.js";
import { ref, onMounted } from "vue";
export default {
  name: "DocBakeTable",
  props: {
    rows: Array,
  },
  components: {
    ButtonMenuTableBody,
    NoDataFooter,
    FindTable,
    ButtonMenuTableHeader,
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
    name: "bakery_name",
    label: "Наименование",
    align: "left",
    field: "bakery_name",
    required: true,
  },
  {
    name: "trademark_name",
    label: "Торг.марка",
    align: "center",
    field: "trademark_name",
    required: true,
  },
  {
    name: "city_name",
    label: "Город",
    align: "center",
    field: "city_name",
    required: true,
  },
  {
    name: "territory_name",
    label: "Территория",
    align: "center",
    field: "territory_name",
    required: true,
  },
  {
    name: "region_name",
    label: "Регион",
    align: "center",
    field: "region_name",
    required: true,
  },
];
</script>
