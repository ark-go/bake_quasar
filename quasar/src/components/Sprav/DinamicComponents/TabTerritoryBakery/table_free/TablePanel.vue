<!--
    :tableName="tableName" - имя таблицы для обслуживания
    :rows="rows" - [] строки таблицы
    :columns="columns" [] - колонки 
    :columnsVisibleTemplate="columnsVisibleTemplate" [] - какие показываь колонки, а какие в выбор оставить
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
    :columnsVisibleTemplate="columnsVisibleTemplate"
    :tableFunc="tableFunc"
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
        @menuAddToGroup="menuAddToGroup"
      ></table-Body-Menu>
    </template>
  </Table-Template>
  <div v-else>не указана таблица</div>
  <Form-Add-To-Group
    v-model:show="showDialog"
    :bakeryRow="bakeryRow"
    @beforeShow="beforeShowDialog"
    :territoryRow="territoryRow"
    @formOnAddToGroup="formOnAddToGroup"
    :infoBakery="infoBakery"
    :minDate="minDate"
    :maxDate="maxDate"
    :currentDate="currentDate"
  ></Form-Add-To-Group>
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
import { columns, columnsVisibleTemplate } from "./tableColumnList.js";
import { useBakeryStore } from "stores/bakeryStore.js";
export default defineComponent({
  name: "TablePanel",
  components: {
    TableTemplate: defineAsyncComponent(() => {
      return import("src/components/template/table/TableTemplate.vue");
    }),
    FormAddToGroup: defineAsyncComponent(() => {
      return import("./FormAddToGroup.vue");
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
    title: String,
  },
  emits: [""],
  setup(props) {
    const rows = ref([]);
    const infoBakery = ref({});
    const minDate = ref("");
    const maxDate = ref("");
    const currentDate = ref("");
    const tableFunc = useTableFunc(props.tableName, rows);
    // const tableBodyMenu = defineAsyncComponent(() => {
    //   return import("./TableBodyMenu.vue");
    // });
    const store = useBakeryStore();

    const currentRow = ref({});
    async function menuAddToGroup(val) {
      console.log("menuAddToGroup", val);
      bakeryRow.value = val;
      currentDate.value = tableFunc.dateFormatDate(new Date());
      let info = await tableFunc.info({ bakeryRow: val.id });
      if (info) {
        minDate.value = tableFunc.dateFormatDate(info?.history?.date_end);
        maxDate.value = tableFunc.dateFormatDate(new Date());
        console.log("info", minDate.value, maxDate.value, info);
        showDialog.value = true;
      }
    }
    async function formOnAddToGroup(val) {
      await tableFunc.addToGroup(val);
    }
    const pagination = ref({
      rowsPerPage: 10,
    });
    const showDialog = ref(false);
    const bakeryRow = ref({});
    function beforeShowDialog() {}
    onMounted(async () => {
      await tableFunc.loadTable(props.commandLoad);
    });
    return {
      minDate,
      maxDate,
      currentDate,
      infoBakery,
      formOnAddToGroup,
      menuAddToGroup,
      currentRow,
      showDialog,
      bakeryRow,
      beforeShowDialog,
      store,
      pagination,
      rows,
      columns,
      columnsVisibleTemplate,
      // tableBodyMenu,
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
