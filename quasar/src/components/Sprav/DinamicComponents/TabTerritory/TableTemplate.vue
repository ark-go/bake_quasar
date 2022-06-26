<template>
  <div class="column no-wrap">
    <q-table
      style="min-width: 100px"
      dense
      :filter="filter"
      no-data-label="Нет данных."
      no-results-label="Ничего не найдено."
      class="my-sticky-virtscroll-table table-kagent-column-table maxBodyHeight"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
    >
      <template v-if="titlePanel || extendPanel" v-slot:top>
        <table-top>
          <template v-if="titlePanel" #title>
            <table-top-title :title="title" v-model:extendPanel="extendPanel">
            </table-top-title>
          </template>
          <div v-if="extendPanel" class="flex row">
            <table-top-btn v-if="!noTopBtn && !noEditTable" @onAdd="onAdd"></table-top-btn>
            <table-top-find
              v-if="!noTopFind"
              v-model:filter="filter"
            ></table-top-find>
            <q-space />
            <table-top-visible
              v-if="!noTopColumnSelect"
              v-model:visibleColumns="visibleColumns"
              :columns="columns"
            ></table-top-visible>
          </div>
        </table-top>
      </template>
      <template v-slot:body="props">
        <table-body
          :propsV="props"
          :noInfoBtn="noInfoBtn"
          :tableName="tableName"
          :modeBody="modeBody"
          @onInfoRow="$emit('onInfoRow', $event)"
          @onBtnDelete="$emit('onBtnDelete', $event)"
          @onBtnEdit="$emit('onBtnEdit', $event)"
          @onRowClick="$emit('onRowClick', $event)"
          :tableBodyMenu="tableBodyMenu"
          :yesBtnEdit="yesBtnEdit"
          :yesBtnDelete="yesBtnDelete"
          :iconBtnEdit="iconBtnEdit"
          :iconBtnDelete="iconBtnEdit"
          :noEditTable="noEditTable"
          :currentRow="currentRow"
        ></table-body>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref, defineAsyncComponent } from "vue";
export default defineComponent({
  name: "TableTemplate",
  components: {
    TableTop: defineAsyncComponent(() => {
      return import("./TableTop.vue");
    }),
    TableTopBtn: defineAsyncComponent(() => {
      return import("./TableTopBtn.vue");
    }),
    TableTopFind: defineAsyncComponent(() => {
      return import("./TableTopFind.vue");
    }),
    TableTopVisible: defineAsyncComponent(() => {
      return import("./TableTopVisible.vue");
    }),
    TableTopTitle: defineAsyncComponent(() => {
      return import("./TableTopTitle.vue");
    }),
    TableBody: defineAsyncComponent(() => {
      return import("./TableBody.vue");
    }),
  },
  props: {
    tableName: String,
    yesBtnEdit: Boolean,
    yesBtnDelete: Boolean,
    iconBtnEdit: String,
    iconBtnDelete: String,
    noEditTable: Boolean,
    currentRow: {
      type: Object,
      default: () => {},
    },
    tableFunc: {
      type: Function,
      default: () => null,
    },
    tableBodyMenu: {
      type: Object,
      default: () => null,
    },
    rows: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    columnsVisibleTemplate: {
      type: Array,
      default: () => [],
    },
    noTopBtn: {
      type: Boolean,
      default: false,
    },
    noTopFind: {
      type: Boolean,
      default: false,
    },
    noTopColumnSelect: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Таблица:",
    },
    noExpandPanel: {
      type: Boolean,
      default: false,
    },
    noTitlePanel: {
      type: Boolean,
      default: false,
    },
    rowsPerPage: {
      type: Number,
      default: 10,
    },
    noInfoBtn: {
      type: Boolean,
      default: false,
    },
  },
  emits: [""],
  setup(props) {
    const pagination = ref({
      rowsPerPage: props.rowsPerPage,
    });
    const visibleColumns = ref([]);
    const extendPanel = ref(!props.noExpandPanel);
    const titlePanel = ref(!props.noTitlePanel);
    const filter = ref("");
    props.columns.forEach((item, index, array) => {
      if (props.columnsVisibleTemplate.includes(item.name)) return;
      visibleColumns.value.push(item.name);
    });
    function onAdd() {
      console.log("кнопка адд");
    }
    console.log(
      "visible col",
      props.columns,
      props.columnsVisibleTemplate,
      visibleColumns.value
    );
    return {
      pagination,
      visibleColumns,
      onAdd,
      filter,
      extendPanel,
      titlePanel,
    };
  },
});
</script>
