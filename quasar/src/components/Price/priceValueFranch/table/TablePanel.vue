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
    :rows="RowsPriceValueFranch"
    :columns="columns"
    :tableBodyMenu="tableBodyMenu"
    :tableFunc="tableFunc"
    @onInfoRow="onInfoRow"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onRowDblClick="onInfoRow"
    @onAdd="onRowClick"
    :currentRow="selectedPriceValueFranch"
    noExpandPanel
    noEditTable
    :rowsPerPage="0"
  >
  </Table-Template>
  <div v-else>не указана таблица</div>
  <Form-Cena v-model:showDialog="showDialog"></Form-Cena>
</template>
<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  onMounted,
  watch,
  computed,
  onActivated,
  onDeactivated,
} from "vue";
import { useTableFunc } from "./tableFunc.js";
import { useLoadPriceValueFranch } from "../../loadPriceValueFranch.js";
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
    const loadPriceValueFranch = useLoadPriceValueFranch();
    const {
      selectedRowDoc,
      selectedRowPrice,
      selectedPriceValueFranch,
      RowsPriceValueFranch,
      RowsBakeryPriceFranch,
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
    // async function onSave() {
    //   console.log("onSave");
    //   await loadPriceValueFranch.loadTable();
    // }
    // async function onReset() {
    //   console.log("onReset");
    //   await loadPriceValueFranch.loadTable();
    // }
    let watchCancel = null;
    let watchCancel2 = null;
    onMounted(() => {
      console.log("mounted franch panel");
      selectedFranchPrice.value = [];
    });
    onActivated(async () => {
      console.log("acivate franch panel");
      selectedFranchPrice.value = [];
      watchCancel = watch(
        [() => RowsBakeryPriceFranch.value.length], // изменения в сайдбар слева выбора пекарни
        () => {
          selectedFranchPrice.value = [];
        }
      );
      watchCancel2 = watch(
        [() => selectedFranchPrice.value.length], // изменения в сайдбар слева выбора пекарни
        async () => {
          console.log("Читаем Прайс франчайзи check SideBar");
          await loadPriceValueFranch.loadTable();
        }
      );
      await loadPriceValueFranch.loadTable();
    });
    onDeactivated(() => {
      if (watchCancel) {
        console.log("стоп ватчер франч");
        watchCancel();
      }
      if (watchCancel2) watchCancel2();
    });
    //  function reLoadComponent() {}
    // priceStore.watchStore(() => {
    //   return watch(
    //     [
    //       // () => selectedFranchPrice.value, /// изменения в сайдк слева выбора пекарни
    //       //  () => selectedRowPrice.value.id,
    //       () => props.checkSave,
    //     ],
    //     async () => {
    //       console.log("Читаем Прайс франчайзи");
    //       await loadPriceValueFranch.loadTable();
    //     }
    //   );
    // });
    // async function loadTable() {
    //   // при обновлениитаблицы будем пеерчитывать выбранную чтроку
    //   let aId = selectedPriceValueFranch.value?.id;
    //   RowsPriceValueFranch.value = await tableFunc.loadTable(
    //     selectedRowDoc.value.id
    //   );
    //   if (aId) {
    //     // если пропало то ставим пустой объект
    //     selectedPriceValueFranch.value =
    //       RowsPriceValueFranch.value.find((val) => val.id == aId) || {};
    //   }
    // }

    function onRowClick(row) {
      console.log("Нажали по строке");
      selectedPriceValueFranch.value = row;
      // selectedRowPrice.value = row;
      //    priceStore.selectedRowPrice = row;
      //  emit("selectedRow", row); //! необходимо отдать для Sprav ? да и ваще полезно
    }
    return {
      title,
      showDialog,
      selectedRowPrice,
      selectedPriceValueFranch,
      priceStore,
      pagination,
      RowsPriceValueFranch,
      columns,
      tableBodyMenu,
      tableFunc,
      onInfoRow(row) {
        showDialog.value = true;
        console.log("info butt", row);
      },
      onRowClick,
    };
  },
});
</script>
