<template>
  <div class="column no-wrap" style="display: grid">
    <div class="row" style="justify-content: space-between">
      <q-input ref="filterRef" dense v-model="filter" label="Поиск">
        <template v-slot:append>
          <q-icon
            v-if="filter !== ''"
            name="clear"
            class="cursor-pointer"
            @click.stop="filter = ''"
          />
          <q-icon v-else name="search" />
        </template>
      </q-input>
      <q-btn
        v-if="tableInfo.tableName"
        dense
        flat
        color="primary"
        :disable="addNewEnabled"
        @click="addNew"
        >ДОБАВИТЬ</q-btn
      >
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
      :title="tableInfo.tableName ? tableInfo.label : 'Выберите справочник'"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      @row-dblclick="dblClickRow"
    >
      <template v-slot:body="props">
        <ark-table-body
          :propsV="props"
          :rowEdit="onEditData"
          :rowDelete="onDeleteData"
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
  <trademark-dialog
    v-model:showDialog="showDialog"
    :sprav="sprav"
    :row-data="rowToDialog"
    @onSave="onSaveData"
  ></trademark-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  isRef,
  onMounted,
  computed,
  watch,
  watchEffect,
  unref,
} from "vue";
import { dataLoad } from "src/utils/ark.js";
import { getSprav } from "./getSprav";
import { useQuasar } from "quasar";
import NoDataFooter from "components/NoDataFooter.vue";
//import ArkTableCell from "components/Sprav/ArkTableCell.vue";
import ArkTableBody from "components/Trademark/ArkTableBody.vue";
import TrademarkDialog from "components/Trademark/TrademarkDialog.vue";
export default defineComponent({
  name: "TrademarkTable",
  components: {
    NoDataFooter,
    // ArkTableCell,
    ArkTableBody,
    TrademarkDialog,
  },
  props: {
    //tableName: String,
    tableInfo: Object, // информация о таблице БД
    //..
    subTitle: String,
    buttonArr: Object,
    menuObj: Object,
    maxWidth: String,
  },
  setup(props) {
    const $q = useQuasar();
    const tableNameSting = ref("");
    const rows = ref([]);
    const columnsVisible = ref([]);
    const visibleColumns = ref([]);
    const filter = ref("");
    const addNewEnabled = ref(false); //включаем кнопку
    const showDialog = ref(false);
    const confirmDelete = ref({});
    const nameElement = ref("");
    const tableName = ref("");
    const url = ref("/api/");
    const sprav = ref({}); // Справочники сюда
    const rowToDialog = ref({});

    // const columns = ref([]);
    const paginationСatalog = ref({
      rowsPerPage: 10,
    });
    // function prepareDate(val) {
    //   return {
    //     id: val.value.id,
    //     name: val.value.name,
    //   };
    // }

    async function restartComponent() {
      // необходимо при создании, или вставке :is компонета срабатывает
      sprav.value.brand = await getSprav("brand", "Бренды"); // если нужны справочники
      console.log("brand", sprav.value.brand);
      tableName.value = props.tableInfo.tableName; // подали название таблицы которая в базе данных
      url.value = url.value + tableName.value;
      columnFilter();
      if (tableName.value) {
        await loadTable(); // читаем, и там заполняем rows
      }
    }
    onMounted(async () => {
      // срабатывает при назначении таблицы  :is=
      await restartComponent(); // подготовка переменных, загрузка
    });
    watch(
      //! может лишнее
      () => props.tableInfo.tableName, // ловим изменение входящей таблицы из tree?
      async () => {
        await restartComponent();
      }
    );
    // ------------- //!не применяем  -------------------------------
    function dblClickRow(val) {
      console.log("sprav dblClick", val);
    }
    // ------------- закрываем/сворачиваем лишние колонки  -------------------------------
    function columnFilter() {
      visibleColumns.value = [];
      columns.value.forEach((item, index, array) => {
        if (item.name == "user_email" || item.name == "user_date") return;
        visibleColumns.value.push(item.name);
      });
      console.log("Колонки показать", visibleColumns.value);
    }

    // -------------  Запись строки Update-------------------------------
    async function onSaveData(val) {
      let valUn = isRef(val) ? val.value : val;
      let cmd = "add";
      if (valUn.id) {
        cmd = "update";
      }
      console.log("Пришло и готово на запись ", cmd, valUn);
      let mess = "Обновление " + props.tableInfo.label; // сообщение в загрузчик для
      let res = await dataLoad(
        url.value,
        { ...valUn, cmd: cmd }, // если нет cmd то update
        mess
      );
      if (res.error) {
        return console.log("Ошибка записи:");
      }
      await loadTable(); // перечитывам таблицу
    }
    //------------ Добавление новой строки
    // async function onAddData(val) {
    //   console.log("Данные для новой записи", val);
    //   await onSaveData(val, "add");
    // }
    // ------------ Удаление ----------------
    async function deleteData(val) {
      // приходит строка таблицы в row
      console.log("Пришло и готово на удаление ", val.id);
      let mess = "Удаление " + tableNameSting.value + " / " + val.name;
      let res = await dataLoad(url.value, { ...val, cmd: "delete" }, mess);
      if (res.error) {
        return console.log("Ошибка удаления:", dataToBase);
      }
      await loadTable();
    }
    // ------------ Запрос подтверждения удаления
    async function onDeleteData(val) {
      console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFF", val);
      $q.dialog({
        title: "Удалить запись?",
        message: val.name,
        cancel: true,
        persistent: true,
        //! цвета вынести
        ok: { label: "Удалить", color: "red-3" }, // q-btn
        cancel: { label: "Отменить", color: "blue-5" },
        focus: "cancel",
      }).onOk(() => {
        deleteData(val);
      });
    }

    // ------------- открываем диалог
    function addNew() {
      rowToDialog.value = {};
      showDialog.value = true;
    }
    function onEditData(val) {
      console.log("ЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖ", val);
      rowToDialog.value = { ...val };
      showDialog.value = true;
    }
    // ------------------- читаем все данные
    async function loadTable() {
      tableNameSting.value = props.tableInfo.tableName;
      let dat = {
        cmd: "load",
      };
      let mess = "Загрузка " + props.tableInfo.label;
      let res = await dataLoad(url.value, dat, mess);
      if (res.result) {
        rows.value = res.result;
      } else {
        tableNameSting.value = "Выберите справочник";
        rows.value = [];
      }
    }
    // ----------- поля в таблице
    const columns = ref([
      {
        name: "name",
        label: "Наименование",
        align: "left",
        field: "name",
        required: true,
      },
      {
        name: "brand_name",
        label: "Бренд",
        align: "left",
        field: "brand_name",
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
      sprav,
      tableName,
      url,
      tableNameSting,
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
      showDialog,
      onDeleteData,
      confirmDelete,
      nameElement,
      rowToDialog,
      onEditData,
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
