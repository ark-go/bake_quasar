<!--
    :tableName="tableName" - имя таблицы для обслуживания
    :rows="rows" - [] строки таблицы
    :columns="columns" [] - колонки 
     :tableBodyMenu="tableBodyMenu" - null - компонент, обработки меню правой мыши
    :tableFunc - Function  функция, ее подключаем по месту
    noExpandPanel  - скрыть расширение заголовка для управления
    noTitlePanel  -  скрыть заголовок таблицы
    noTopBtn  - не показывать кнопку с плюсом
    noTopFind - не показывать поле поиска
    noTopColumnSelect - не показывать выбор колонок
    noInfoBtn - убрать кнопку Info из строки
    yesBtnEdit - показывать кнопку редактирования
    yesBtnDelete - показывать кнопку удаления
    noEditTable - удаляет кнопки Edit и Delete и кнопку плюс в Top
    @onInfoRow - по кнопке Инфо
    @onBtnDelete - кнопка удалить в строке
    @onBtnEdit - кнопка едит в строке
    @onRowClick - по строке
    @onAdd - кнопка плюс в заголовке
    :iconBtnEdit="" - иконка для редактирования
    :iconBtnDelete="" - иконка для удаления
    :rowsPerPage  - кол-во строк таблице - странице
-->
<template>
  <Table-Template
    v-if="tableName"
    :title="title"
    :tableName="tableName"
    :rows="rows"
    :columns="columns"
    :tableFunc="tableFunc"
    yesBtnEdit
    yesBtnDelete
    @onInfoRow="onInfoRow"
    @onBtnDelete="onDeleteData"
    @onBtnEdit="rowEdit"
    @onRowClick="onRowClick"
    @onAdd="addNew"
    :currentRow="currentRow"
    noExpandPanel
    :noEditTable="true"
    :store="store"
    :rowsPerPage="0"
  >
  </Table-Template>
  <div v-else>не указана таблица</div>
  <Form-Dialog
    :currentRow="rowToDialog"
    v-model:showDialog="showDialog"
    @onSave="dialogSave"
  ></Form-Dialog>
</template>
<script>
import {
  defineComponent,
  ref,
  unref,
  defineAsyncComponent,
  onMounted,
  watch,
  watchEffect,
} from "vue";
import { useTableFunc } from "./tableFunc.js";
import { columns } from "./tableColumnList.js";
import { useBakeryStore } from "stores/bakeryStore.js";
import { useSpravStore } from "stores/spravStore";
import { useQuasar } from "quasar";
import FormDialog from "./FormDialog.vue";
//import { waitOnEventOrTimeout } from "app/public/pdfjs/web/viewer.js";
export default defineComponent({
  name: "TablePanel",
  components: {
    FormDialog,
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
      default: "tabKagent", // для запроса с сервера
    },
    tableInfo: Object,
    title: {
      type: String,
      default: "Контрагенты",
    },
    panelName: String,
  },
  emits: [""],
  setup(props, { emit }) {
    const $q = useQuasar();
    const showDialog = ref(false);
    const currentRow = ref({});
    const rows = ref([]);
    const tableFunc = useTableFunc(rows, props.tableInfo.tableName);
    const spravStore = useSpravStore();
    const store = useBakeryStore();
    const rowToDialog = ref({});

    function reLoadComponent() {}
    watchEffect(() => {
      reLoadComponent(props.panelName);
    });
    watch(
      () => spravStore.historyDate,
      async () => {
        await tableFunc.loadTable();
      }
    );
    watch(
      () => spravStore.currentTab,
      async () => {
        // Ловим переключение складки

        if (spravStore.currentTab == "main") {
          console.log("Поймал смену панели", spravStore.currentTab);
          await tableFunc.loadTable();
        }
      }
    );
    onMounted(async () => {
      await tableFunc.loadTable(
        tableFunc.dateToDateUnix(spravStore.historyDate)
      );
    });
    function rowEdit(row) {
      rowToDialog.value = { ...row };
      console.log("rowEdit", row.name, row);
      showDialog.value = true;
    }
    async function dialogSave(row) {
      console.log("Данные для новой записи", row);
      await tableFunc.saveRowTable(row);
    }
    function addNew() {
      rowToDialog.value = {};
      console.log("addNew");
      showDialog.value = true;
    }
    async function onDeleteData(row) {
      currentRow.value = row;
      $q.dialog({
        title: "Удалить запись?",
        message: row.name,
        cancel: true,
        persistent: true,
        ok: { label: "Удалить", color: "red-3" }, // q-btn
        cancel: { label: "Отменить", color: "blue-5" },
        focus: "cancel",
      }).onOk(() => {
        onDeleteConfirm(row);
      });
    }
    async function onDeleteConfirm(row) {
      console.log("Пришло и готово на удаление ", row.id);
      let mess = "Удаление " + row.name;
      await tableFunc.deleteTable(row);
    }
    return {
      rowToDialog,
      unref,
      showDialog,
      rowEdit,
      addNew,
      onDeleteData,
      dialogSave,
      currentRow,
      store,
      rows,
      columns,
      //  tableBodyMenu,
      tableFunc,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick(row) {
        console.log("Нажали по строке");
        currentRow.value = row;
        store.selectedRow = row;
        emit("selectedRow", row); //! необходимо отдать для Sprav ? да и ваще полезно
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.my-sticky-header-table {
  /* height or max-height is important */
  height: 310px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}
</style>
