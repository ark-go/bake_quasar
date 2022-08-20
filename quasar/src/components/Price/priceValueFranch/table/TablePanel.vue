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
    :rows="RowsPriceValue"
    :columns="columns"
    :tableBodyMenu="tableBodyMenu"
    :tableFunc="tableFunc"
    @onInfoRow="onInfoRow"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onRowDblClick="onInfoRow"
    @onAdd="onRowClick"
    :currentRow="selectedRowPrice"
    noExpandPanel
    noEditTable
    :rowsPerPage="0"
  >
  </Table-Template>
  <div v-else>не указана таблица</div>
  <Form-Cena
    v-model:showDialog="showDialog"
    @onSave="onSave"
    @onReset="onReset"
  ></Form-Cena>
</template>
<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  onMounted,
  watch,
  computed,
} from "vue";
import { useTableFunc } from "./tableFunc.js";
import { columns } from "./tableColumnList.js";
import { usePriceStore, storeToRefs } from "stores/priceStore.js";
import FormCena from "./FormCena.vue";
export default defineComponent({
  name: "tabFranch",
  components: {
    TableTemplate: defineAsyncComponent(() => {
      return import("src/components/template/table/TableTemplate.vue");
    }),
    FormCena,
  },
  props: {
    modeBody: {
      type: String,
      default: "view",
    },
    tableName: {
      type: String,
      default: "tabPrice", // для запроса с сервера
    },
    // title: {
    //   type: String,
    //   default: "Документы",
    // },
    checkSave: Boolean,
    panelName: String,
  },
  emits: [""],
  setup(props, { emit }) {
    const showDialog = ref(false);
    const tableFunc = useTableFunc(props.tableName);
    const tableBodyMenu = defineAsyncComponent(() => {
      return import("./TableBodyMenu.vue");
    });
    const priceStore = usePriceStore();
    const {
      selectedRowDoc,
      selectedRowPrice,
      RowsPriceValue,
      selectedFranchPrice,
    } = storeToRefs(usePriceStore());
    //const rows = ref([]);
    // const currentRow = ref({});
    const pagination = ref({
      rowsPerPage: 10,
    });
    const title = computed(() => {
      if (selectedFranchPrice.value.length == 1) {
        return "Прайс пекарни: " + selectedFranchPrice.value[0].bakery_name;
      } else {
        return selectedFranchPrice.value.length == 0
          ? "Общий прайс"
          : `Общий прайс для ${selectedFranchPrice.value.length} пек.`;
      }
    });
    async function onSave() {
      await loadTable();
    }
    async function onReset() {
      await loadTable();
    }
    //  function reLoadComponent() {}
    watch(
      [
        () => selectedFranchPrice.value,
        () => selectedRowPrice.value.id,
        () => props.checkSave,
      ],
      async () => {
        console.log("Читаем Прайс франчайзи");
        await loadTable();
      }
    );
    async function loadTable() {
      // при обновлениитаблицы будем пеерчитывать выбранную чтроку
      let aId = selectedRowPrice.value?.id;
      RowsPriceValue.value = await tableFunc.loadTable(selectedRowDoc.value.id);
      if (aId) {
        // если пропало то ставим пустой объект
        selectedRowPrice.value =
          RowsPriceValue.value.find((val) => val.id == aId) || {};
      }
    }
    onMounted(async () => {
      await loadTable();
    });
    function onRowClick(row) {
      console.log("Нажали по строке");
      selectedRowPrice.value = row;
      //    priceStore.selectedRowPrice = row;
      //  emit("selectedRow", row); //! необходимо отдать для Sprav ? да и ваще полезно
    }
    return {
      title,
      showDialog,
      selectedRowPrice,
      priceStore,
      pagination,
      RowsPriceValue,
      columns,
      tableBodyMenu,
      tableFunc,
      onSave,
      onReset,
      onInfoRow(row) {
        showDialog.value = true;
        console.log("info butt", row);
      },
      onRowClick,
    };
  },
});
</script>
