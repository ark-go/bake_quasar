<template>
  <div class="column no-wrap">
    <q-table
      style="min-width: 100px"
      dense
      :filter="filter"
      no-data-label="Нет данных."
      no-results-label="Ничего не найдено."
      class="my-sticky-virtscroll-table arkadii-sticky-header-table table-kagent-column-table maxBodyHeight"
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
            <table-top-btn
              v-if="!noTopBtn && !noEditTable"
              @onAdd="$emit('onAdd')"
            ></table-top-btn>
            <table-top-find
              v-if="!noTopFind"
              v-model:filter="filter"
            ></table-top-find>
            <q-space />
            <table-top-visible
              v-if="!noTopColumnSelect"
              v-model:visible-columns="visibleColumns"
              :columns="columns"
            ></table-top-visible>
          </div>
        </table-top>
      </template>
      <template v-slot:header="props">
        <table-header
          :props="props"
          :yesBtnEdit="yesBtnEdit"
          :yesBtnDelete="yesBtnDelete"
          :noEditTable="noEditTable"
        >
        </table-header>
      </template>
      <template v-slot:body="props">
        <table-body
          :propsV="props"
          :noInfoBtn="noInfoBtn"
          :modeBody="modeBody"
          @onInfoRow="$emit('onInfoRow', $event)"
          @onBtnDelete="$emit('onBtnDelete', $event)"
          @onBtnEdit="$emit('onBtnEdit', $event)"
          @onRowClick="$emit('onRowClick', $event)"
          :yesBtnEdit="yesBtnEdit"
          :yesBtnDelete="yesBtnDelete"
          :iconBtnEdit="iconBtnEdit"
          :iconBtnDelete="iconBtnEdit"
          :noEditTable="noEditTable"
          :currentRow="currentRow"
        >
          <template #contextMenu="dataSlot">
            <slot name="contextMenu" v-bind="dataSlot"></slot>
          </template>
        </table-body>
      </template>
      <template v-slot:no-data="dataslot">
        <Table-No-Data-Footer :dataslot="dataslot"></Table-No-Data-Footer>
      </template>
    </q-table>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  watch,
  onMounted,
} from "vue";
export default defineComponent({
  name: "TableTemplate",
  components: {
    TableNoDataFooter: defineAsyncComponent(() => {
      return import("./TableNoDataFooter.vue");
    }),
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
    TableHeader: defineAsyncComponent(() => {
      return import("./TableHeader.vue");
    }),
  },
  props: {
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
    rows: {
      type: Array,
      default: () => [],
    },
    columns: {
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
    function reVisibleColumn() {
      props.columns.forEach((item, index, array) => {
        if (item.hidden == true) return;
        visibleColumns.value.push(item.name);
      });
    }
    onMounted(() => {
      reVisibleColumn();
    });
    watch(
      () => props.columns,
      () => {
        reVisibleColumn();
      }
    );

    return {
      pagination,
      visibleColumns,
      filter,
      extendPanel,
      titlePanel,
    };
  },
});
</script>
