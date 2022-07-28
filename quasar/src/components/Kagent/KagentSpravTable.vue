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
      :rows="rowsSprav"
      :columns="columns"
    >
      <template v-slot:body="props">
        <kagent-table-body
          :propsV="props"
          :buttons="['blue']"
          blue-icon="arrow_back"
          blue-tooltip-mess="Выбрать"
          is-left
          @on-btn-edit="onBtnEdit"
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
        <span class="q-ml-sm" style="text-align: center">{{ tableName }}</span
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
          @click="onDeleteConfirm(confirmDelete)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, onMounted } from "vue";
import KagentTableBody from "components/Kagent/KagentTableBody.vue";
export default {
  name: "KagentListTable",
  components: {
    KagentTableBody,
  },
  props: {
    tableName: String,
    rowsSprav: Array,
    rowsSpravClick: Function,
  },
  setup(props) {
    const showDialogDelete = ref(false);
    const nameElement = ref({});
    const confirmDelete = ref({});
    const rows = ref([]);
    onMounted(async () => {
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
      confirmDelete() {},
      onBtnEdit(val) {
        console.log("справочник кнопка", val.row.id);
        props.rowsSpravClick(val.row.id);
      },
      onBtnDelete(val) {
        // nameElement.value = val.row.name;
        // confirmDelete.value._dataFromConfirm = val;
        // showDialogDelete.value = true;
      },
      onDeleteConfirm(val) {
        // console.log(val);
        //props.rowsSpravClick();
      },
    };
  },
};
let columns = [
  {
    name: "name",
    label: "Справочник",
    align: "left",
    field: "name",
    required: true,
  },
];
</script>
