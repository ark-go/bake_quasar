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
    @onInfoRow="onInfoRow"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onAdd="onRowClick"
    :currentRow="currentRow"
    noExpandPanel
    noEditTable
    :store="store"
  >
    <template #contextMenu="dd">
      <table-Body-Menu
        :dataSlot="dd"
        :currentGroupName="territoryRow.name"
        @menuMoveToGroup="menuMoveToGroup"
      ></table-Body-Menu>
    </template>
  </Table-Template>
  <div v-else>не указана таблица</div>
  <Form-Move-To-Group
    v-model:show="showDialog"
    :bakeryRow="bakeryRow"
    @beforeShow="beforeShowDialog"
    :territoryRow="territoryRow"
    @formOnClick="formOnClick"
    :infoBakery="infoBakery"
    :minDate="minDate"
    :maxDate="maxDate"
    :currentDate="currentDate"
  ></Form-Move-To-Group>
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
import { useBakeryStore } from "stores/bakeryStore.js";
export default defineComponent({
  name: "TablePanel",
  components: {
    TableTemplate: defineAsyncComponent(() => {
      return import("src/components/template/table/TableTemplate.vue");
    }),
    FormMoveToGroup: defineAsyncComponent(() => {
      return import("./FormMoveToGroup.vue");
    }),
    tableBodyMenu: defineAsyncComponent(() => {
      return import("./TableBodyMenu.vue");
    }),
  },
  props: {
    modeBody: {
      type: String,
      default: "view",
    },
    territoryRow: {
      // это строка из сравочника
      type: Object,
      default: () => {},
    },

    tableName: String,
    commandLoad: Object,
    objectRow: Object,
    title: String,
  },
  emits: [""],
  setup(props) {
    const rows = ref([]);
    const infoBakery = ref({});
    const minDate = ref("");
    const maxDate = ref("");
    const currentDate = ref("");
    const tableFunc = useTableFunc(props.tableName, rows, props.territoryRow);
    const store = useBakeryStore();
    const currentRow = ref({});
    const showDialog = ref(false);
    const bakeryRow = ref({});
    const pagination = ref({
      rowsPerPage: 10,
    });

    onMounted(async () => {
      return await tableFunc.loadTable();
    });
    async function menuMoveToGroup(val) {
      console.log("menuMoveToGroup", val);
      bakeryRow.value = val;
      currentDate.value = tableFunc.dateFormatDate(new Date());
      let info = await tableFunc.info({ bakeryRow: val.id });
      if (info) {
        minDate.value = tableFunc.dateFormatDate(info?.history?.date_start);
        maxDate.value = tableFunc.dateFormatDate(new Date());
        console.log("info", minDate.value, info);
        showDialog.value = true;
      }
    }
    async function formOnClick(val) {
      console.log("remove form", val);
      await tableFunc.removeFromGroup(val);
    }
    function beforeShowDialog() {}

    return {
      minDate,
      maxDate,
      currentDate,
      infoBakery,
      beforeShowDialog,
      formOnClick,
      menuMoveToGroup,
      showDialog,
      bakeryRow,
      currentRow,
      store,
      pagination,
      rows,
      columns,
      tableFunc,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick(row) {
        console.log("Нажали по строке");
        currentRow.value = row;
        store.selectedRow = row;
      },
    };
  },
});
</script>
