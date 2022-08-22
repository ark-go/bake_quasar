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
    :rows="RowsBakeryPriceFranch"
    :columns="columns"
    :tableBodyMenu="tableBodyMenu"
    :tableFunc="tableFunc"
    @onInfoRow="onInfoRow"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onAdd="onRowClick"
    noExpandPanel
    noEditTable
    :rowsPerPage="0"
    selection="multiple"
    v-model:selected="selectedFranchPrice"
  >
  </Table-Template>
  <div v-else>не указана таблица</div>
</template>
<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  watch,
  watchEffect,
  computed,
  onActivated,
} from "vue";
import { useTableFunc } from "./tableFunc.js";
import { columns } from "./tableColumnList.js";
import { usePriceStore, storeToRefs } from "stores/priceStore.js";
export default defineComponent({
  name: "TablePanel",

  components: {
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
      default: "tabPrice", // для запроса с сервера
    },
    checkSave: Boolean,
    panelName: String,
  },
  emits: [""],
  setup(props, { emit }) {
    const tableFunc = useTableFunc(props.tableName);
    const tableBodyMenu = defineAsyncComponent(() => {
      return import("./TableBodyMenu.vue");
    });
    const priceStore = usePriceStore();

    const {
      selectedRowDoc,
      selectedFranchPrice,
      selectedBakeryPrice,
      RowsBakeryPriceFranch,
    } = storeToRefs(usePriceStore());
    // onActivated(() => {
    //   console.log("onactivate       d++++++++++++++++++");
    //   selectedFranchPrice.value = [];
    // });
    //TODO:  ,,,????
    priceStore.watchStore(() => {
      return watch(
        () => RowsBakeryPriceFranch.value.length,
        () => {
          selectedFranchPrice.value = [];
        }
      );
      //  return watchEffect(() => {
      //     let count = RowsBakeryPriceFranch.value.length;
      //     selectedFranchPrice.value = [];
      //   });
    });
    const title = computed(() => {
      if (selectedFranchPrice.value.length)
        return `Пекарни франчайзи - ${selectedFranchPrice.value.length} / ${RowsBakeryPriceFranch.value.length}.`;
      else return "Пекарни франчайзи:";
    });
    // const currentRow = ref({});
    const pagination = ref({
      rowsPerPage: 10,
    });
    function onRowClick(row) {
      console.log("Нажали по строке 1");
      let i = selectedFranchPrice.value.findIndex((val) => {
        if (val.id == row.id) return true;
      });
      if (i != -1) {
        selectedFranchPrice.value.splice(i, 1);
      } else {
        selectedFranchPrice.value.push(row);
      }

      //console.log("Выбрано чтото", selectedFranchPrice.value);
    }
    return {
      RowsBakeryPriceFranch,
      selectedRowDoc,
      selectedBakeryPrice,
      selectedFranchPrice,
      priceStore,
      pagination,
      columns,
      tableBodyMenu,
      tableFunc,
      title,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick,
    };
  },
});
</script>
