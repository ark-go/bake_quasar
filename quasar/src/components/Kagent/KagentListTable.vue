<template>
  <div class="column no-wrap" style="width: 100%; min-width: 200px">
    <div class="row" style="justify-content: space-between">
      <q-input ref="filterRef" dense v-model="filter" label="Поиск">
        <template v-slot:append>
          <q-icon
            v-if="filter !== ''"
            size="10px"
            name="clear"
            class="cursor-pointer"
            @click.stop="filter = ''"
          />
          <q-icon v-else name="search" />
        </template>
      </q-input>
    </div>
    <q-table
      style="min-width: 100px"
      dense
      :filter="filter"
      no-data-label="Нет данных."
      no-results-label="Ничего не найдено."
      class="my-sticky-virtscroll-table table-sprav-column-table"
      virtual-scroll
      v-model:pagination="paginationСatalog"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      :rows="rowsList"
      :columns="columns"
    >
      <template v-slot:body="props">
        <kagent-table-body
          :buttons="['red']"
          :propsV="props"
          red-tooltip-mess="Удалить из списка"
          @on-btn-edit="null"
          @on-btn-delete="onBtnDelete"
        ></kagent-table-body>
      </template>
      <template v-slot:no-data="dataslot">
        <no-data-footer :dataslot="dataslot"></no-data-footer>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="showDialogDelete">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="red" text-color="white" />
        <span class="q-ml-sm">Удалить запись?</span><br />
        <span class="q-ml-sm" style="text-align: center">{{ listName }}</span
        ><br />
      </q-card-section>
      <q-card-section>
        <span class="q-ml-sm">{{ nameElement }}</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup />
        <q-btn
          flat
          label="Удалить"
          color="primary"
          v-close-popup
          @click="onDeleteConfirm(confirmDeleteBuff)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, onMounted } from "vue";
import { dataLoad } from "src/utils/ark.js";
import KagentTableBody from "components/Kagent/KagentTableBody.vue";
export default {
  name: "KagentListTable",
  components: {
    KagentTableBody,
  },
  props: {
    listName: String,
    kagentId: [String, Number],
    rowsList: Array,
    rowsListLoad: Function,
    rowsListClick: Function,
  },
  setup(props) {
    const showDialogDelete = ref(false);
    const nameElement = ref({});
    const confirmDeleteBuff = ref({});
    const rows = ref([]);
    onMounted(async () => {
      console.log("onMounted  KagentListTable");
      props.rowsListLoad();
    });
    return {
      rows,
      columns,
      filter: ref(""),
      showDialogDelete,
      nameElement,
      paginationСatalog: ref({
        rowsPerPage: 10,
      }),
      confirmDeleteBuff,
      onBtnDelete(val) {
        nameElement.value = val.row.name;
        confirmDeleteBuff.value = val;
        showDialogDelete.value = true;
      },
      async onDeleteConfirm(val) {
        console.log("на удаление", val);
        await props.rowsListClick(val.row.id);
        val.row.id;
      },
    };
  },
};
let columns = [
  {
    name: "name",
    label: "У контрагента",
    align: "left",
    field: "name",
    required: true,
  },
];
</script>
