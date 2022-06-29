<template>
  <div class="column no-wrap" style="display: grid; max-height: inherit">
    <q-table
      style="min-width: 100px; max-height: inherit; overflow: auto"
      :card-container-style="{ fontSize: 'inherit' }"
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
      :title="tableInfo.tableName ? tableInfo.label : 'Выберите справочник'"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      @row-dblclick="dblClickRow"
    >
      <template v-slot:top-left>
        <div class="row">
          <q-btn flat round color="green" icon="add" @click="addNew" />
          <div style="min-width: 25px"></div>
          <find-table v-model:filter="filter"></find-table>
        </div>
      </template>
      <template v-slot:body="props">
        <ark-table-body
          :propsV="props"
          @on-save-data="onSaveData"
          @on-delete-data="onDeleteData"
          @on-row-click="onRowClick"
          :selectedRow="spravStore.selectedRow"
        ></ark-table-body>
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
  <sprav-dialog
    :inputArr="inputArr"
    v-model:showDialog="showDialog"
    @inputForSave="inputForSave"
  ></sprav-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watch,
  watchEffect,
  unref,
} from "vue";
import { dataLoad } from "src/utils/ark.js";
import { useQuasar } from "quasar";
import NoDataFooter from "components/NoDataFooter.vue";
import ArkTableBody from "components/Sprav/ArkTableBody.vue";
import SpravDialog from "components/Sprav/SpravDialog.vue";
import { useSpravStore } from "stores/spravStore";
import FindTable from "./FindTable.vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "SpravTable",
  components: {
    NoDataFooter,
    ArkTableBody,
    SpravDialog,
    FindTable,
  },
  props: {
    //tableName: String,
    tableInfo: Object,
    subTitle: String,
    buttonArr: Object,
    menuObj: Object,
    maxWidth: String,
  },
  setup(props) {
    const $q = useQuasar();
    const spravStore = useSpravStore();
    const tableNameSting = ref("");
    const rows = ref([]);
    const columnsVisible = ref([]);
    const visibleColumns = ref([]);
    const filter = ref("");
    const addNewEnabled = ref(false); //включаем кнопку
    const inputArr = ref({});
    const showDialog = ref(false);
    const confirmDelete = ref({});
    const nameElement = ref("");
    // const columns = ref([]);
    const paginationСatalog = ref({
      rowsPerPage: 10,
    });
    async function restartComponent() {
      // необходимо при создании, или вставке :is компонета срабатывает
      if (props.tableInfo.tableName) {
        await loadTable();
      } else {
        rows.value = [];
      }
    }
    function onRowClick(row) {
      spravStore.selectedRow = row;
    }
    onMounted(async () => {
      columnFilter();
      createAddDialog();
      await restartComponent();
    });
    watch(
      () => props.tableInfo.tableName,
      async () => {
        await restartComponent();
      }
    );
    function createAddDialog() {
      //inputArr.value = [];
      inputArr.value = {
        colTitle: "Наименование", // значение колонки
        colBase: "name", // название поля в базе
        colValue: "",
      };
    }
    async function loadTable() {
      tableNameSting.value = props.tableInfo.tableName;
      if (!props.tableInfo.tableName) {
        tableNameSting.value = "Выберите справочник";

        rows.value = [];
        return;
      }
      let dat = {
        tableNameLoad: props.tableInfo.tableName,
      };
      let mess = "Загрузка " + props.tableInfo.label;
      let res = await dataLoad("/api/spravLoad", dat, mess);
      if (res.result) {
        rows.value = res.result;
      } else {
        tableNameSting.value = "Выберите справочник";
        rows.value = [];
      }
    }

    function dblClickRow(val) {
      console.log("sprav dblClick", val);
    }
    function columnFilter() {
      visibleColumns.value = [];
      //   console.log("Колонки", columns);
      columns.value.forEach((item, index, array) => {
        //  if (!extendedTable.value) {
        if (item.name == "user_email" || item.name == "user_date") return;
        //  }
        visibleColumns.value.push(item.name);
      });
      console.log("Колонки показать", visibleColumns.value);
    }
    async function onSaveData(val) {
      console.log("Пришло и готово на запись ", val.value);
      let dataToBase = {};
      dataToBase[val.value.colBase] = val.value.colValue;
      dataToBase["id"] = val.value.id;
      // val.value.forEach((item) => {
      //   dataToBase[item.colBase] = item.colValue;
      //   dataToBase["id"] = item.id;
      // });
      dataToBase["tableName"] = props.tableInfo.tableName;
      console.log("состав:", dataToBase);
      let mess = "Обновление " + tableNameSting.value;
      let res = await dataLoad("/api/spravUpdate", dataToBase, mess);
      if (res.error) {
        return;
      }
      await loadTable();
    }
    // ----------------------------
    async function onDeleteConfirm(val) {
      console.log("Пришло и готово на удаление ", val.row.id);
      let dataToBase = {
        id: val.row.id,
        tableName: props.tableInfo.tableName,
      };
      let mess = "Удаление " + tableNameSting.value + " / " + val.row.name;
      let res = await dataLoad("/api/spravDelete", dataToBase, mess);
      if (res.error) {
        return;
      }
      await loadTable();
    }
    async function onDeleteData(val) {
      // nameElement.value = val.row.name;
      // confirmDelete.value._dataFromConfirm = val;
      // confirmDelete.value.showConfirm = true;
      //------------- Dialog
      $q.dialog({
        title: "Удалить запись?",
        message: val.row.name,
        cancel: true,
        persistent: true,
        ok: { label: "Удалить", color: "red-3" }, // q-btn
        cancel: { label: "Отменить", color: "blue-5" },
        focus: "cancel",
      })
        .onOk(() => {
          // console.log('>>>> OK')
          onDeleteConfirm(val);
        })
        .onOk(() => {
          console.log(">>>> second OK catcher");
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });

      //--------------------
    }

    //--------------------
    async function inputForSave(val) {
      console.log("Данные для новой записи", val.value);
      let dataToBase = {};
      dataToBase[val.value.colBase] = val.value.colValue;
      dataToBase["id"] = val.value.id;
      dataToBase["tableName"] = props.tableInfo.tableName;
      console.log("состав:", dataToBase);
      let mess = "Обновление " + tableNameSting.value;
      let res = await dataLoad("/api/spravAdd", dataToBase, mess);
      if (res.error) {
        return;
      }
      await loadTable();
    }

    function addNew() {
      console.log("addNew");
      inputArr.value.colValue = "";
      showDialog.value = true;
    }
    const columns = ref([
      {
        name: "name",
        label: "Наименование",
        align: "left",
        field: "name",
        required: true,
      },
      {
        name: "user_email",
        label: "Е-Mail",
        align: "left",
        field: "user_email",
      },
      {
        name: "user_date",
        label: "Дата",
        align: "left",
        field: "user_date",
      },
    ]);
    return {
      tableNameSting,
      spravStore,
      onRowClick,
      rows,
      filter,
      columnsVisible,
      paginationСatalog,
      visibleColumns,
      columns,
      dblClickRow,
      test(val) {
        console.log(val);
      },
      onSaveData,
      addNewEnabled,
      addNew,
      inputArr,
      showDialog,
      inputForSave,
      onDeleteData,
      confirmDelete,
      nameElement,
    };
  },
});
</script>
<style lang="scss">
.table-sprav-column-table {
  /* указав максимальную ширину, чтобы пример мог
выделить липкий столбец в любом окне браузера */
  //max-width: 40%;

  thead tr:first-child th:first-child {
    /* bg цвет важен для th; просто укажите один */
    background-color: #fff;
  }
  td:first-child {
    background-color: #fdfdfc;
  }
  th:first-child,
  td:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
    max-width: 30%;
  }
}
</style>
