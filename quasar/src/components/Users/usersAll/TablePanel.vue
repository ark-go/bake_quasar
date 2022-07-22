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
    rowsPerPage="500"
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
    @inputForSave="inputForSave"
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
import { useQuasar } from "quasar";
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
    const $q = useQuasar();
    const rows = ref([]);
    const tableFunc = useTableFunc(props.tableName, rows);
    // const usersPanelStore = useUsersPanelStore();
    const showDialogUser = ref(false);
    const currentEditRow = ref({});
    const tableBodyMenu = defineAsyncComponent(() => {
      return import("./TableBodyMenu.vue");
    });
    //const store = useBakeryStore();

    // const currentRow = ref({});
    const { userRow: currentRow, treeRow } = storeToRefs(useUsersPanelStore());
    // const currentRow = ref(usersPanelStore.userRow); // = currentRow.value;
    const pagination = ref({
      rowsPerPage: 10,
    });
    //let a = currentRow.value;
    onMounted(async () => {
      watch(
        () => treeRow.value,
        async () => {
          await tableFunc.loadTable();
        }
      );
      await tableFunc.loadTable();
    });
    function onInfoRow(row) {
      // берем инфу из Ctore а можно из строки row таблицы
      currentRow.value = row;
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
    async function inputForSave(row) {
      console.log("na zapis ", row.value);

      if (row.value.rereg) {
        $q.dialog({
          title: "Внимание!",
          message: `Вы установили сброс регистрации, при этом логин пользователя будет удален!
пользователю, необходимо заново регистрироваться, и регистрировать ключ на мобильном устройстве",
а также, установка этого флага разрешает саму регистрацию пользователя, если вы его завели вручную, до регистрации пользователя.`,
          cancel: true,
          //persistent: true,
          ok: {
            push: false,
            color: "negative",
          },
          cancel: {
            push: false,
            label: "Отменить",
            color: "green",
          },
        })
          .onOk(async () => {
            await tableFunc.addUpdateTable(row.value);
          })
          .onCancel(() => {
            return;
          });
      } else {
        await tableFunc.addUpdateTable(row.value);
      }
    }
    return {
      currentRow,
      showDialogUser,
      currentEditRow,
      inputForSave,
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
