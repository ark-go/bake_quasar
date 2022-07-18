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
    :tableBodyMenu="tableBodyMenu"
    :tableFunc="tableFunc"
    @onInfoRow="onInfoRow"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onAdd="onAddClick"
    :currentRow="currentRow"
    noExpandPanel
    yesBtnEdit
  >
    <!-- <template #contextMenu="dataSlot">
    </template> -->
  </Table-Template>
  <div v-else>не указана таблица</div>
  <Dialog-User
    v-model:showDialog="showDialogUser"
    :inputRow="currentEditRow"
  ></Dialog-User>
</template>
<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  onMounted,
  watch,
  nextTick,
} from "vue";
import { useTableFunc } from "./tableFunc.js";
import { columns } from "./tableColumnList.js";
import { useUsersPanelStore, storeToRefs } from "stores/usersPanelStore.js";
import DialogUser from "./DialogUser.vue";
//import { useBakeryStore } from "stores/bakeryStore.js";
export default defineComponent({
  name: "TablePanel",
  components: {
    DialogUser,
    TableTemplate: defineAsyncComponent(() => {
      return import("components/template/table/TableTemplate.vue");
    }),
  },
  props: {
    modeBody: {
      type: String,
      default: "view",
    },
    tableName: String,
    title: {
      type: String,
      default: "tabUsers",
    },
  },
  emits: [""],
  setup(props) {
    const tableFunc = useTableFunc(props.tableName);
    // const usersPanelStore = useUsersPanelStore();
    const showDialogUser = ref(false);
    const currentEditRow = ref({});
    const tableBodyMenu = defineAsyncComponent(() => {
      return import("./TableBodyMenu.vue");
    });
    //const store = useBakeryStore();
    const rows = ref([]);
    // const currentRow = ref({});
    const { userRow: currentRow } = storeToRefs(useUsersPanelStore());
    // const currentRow = ref(usersPanelStore.userRow); // = currentRow.value;
    const pagination = ref({
      rowsPerPage: 10,
    });
    //let a = currentRow.value;
    onMounted(async () => {
      rows.value = await tableFunc.loadTable();
    });
    function onInfoRow(row) {
      // берем инфу из Ctore а можно из строки row таблицы
      currentEditRow.value = { ...currentRow.value };
      nextTick(() => {
        showDialogUser.value = true;
      });
      console.log("info butt", row);
    }
    function onAddClick() {
      currentEditRow.value = {};
      nextTick(() => {
        showDialogUser.value = true;
      });
      console.log("info butt");
    }
    return {
      currentRow,
      showDialogUser,
      currentEditRow,
      onInfoRow,
      onAddClick,
      // store,
      pagination,
      rows,
      columns,
      tableBodyMenu,
      tableFunc,

      onRowClick(row) {
        console.log("Нажали по строке");
        currentRow.value = row;
        // usersPanelStore.userRow = row;
        //store.selectedRow = row;
      },
    };
  },
});
</script>
