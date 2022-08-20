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
    :rows="RowsBakeryPrice"
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
    :currentRow="selectedRowBakery"
    :rowsPerPage="0"
    selection="multiple"
    v-model:selected="selectedBakeryPrice"
  >
  </Table-Template>
  <div v-else>не указана таблица</div>
</template>
<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  onMounted,
  watch,
  onUnmounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
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
    title: {
      type: String,
      default: "Пекарни в прайсе",
    },
    checkSave: Boolean,
    panelName: String,
  },
  emits: [""],
  setup(props, { emit }) {
    const tableFunc = useTableFunc();
    // onUnmounted(() => {
    //   tableFunc = null;
    // });
    const tableBodyMenu = defineAsyncComponent(() => {
      return import("./TableBodyMenu.vue");
    });
    const priceStore = usePriceStore();
    const {
      RowsBakeryPrice,
      selectedRowDoc,
      selectedRowBakery,
      selectedBakeryPrice,
    } = storeToRefs(usePriceStore());
    // const currentRow = ref({});
    const pagination = ref({
      rowsPerPage: 10,
    });
    onUnmounted(() => {
      console.log("UN-MOUNT  Пекарни включенные в прайс");
    });
    onMounted(async () => {
      console.log("ON MOUNT  Пекарни включенные в прайс");
      await tableFunc.loadTable();
    });
    onActivated(() => {
      console.log("ON-onActivated  Пекарни включенные в прайс");
    });
    onDeactivated(() => {
      console.log("UN-onDeactivated  Пекарни включенные в прайс");
    });
    console.log("SETUP Пекарни включенные в прайс");
    priceStore.watchStore(() => {
      return watch(
        // сигнал на перезагрузку таблицы //() => props.checkSave,
        [() => selectedRowDoc.value], // () => selectedRowDoc.value.id], это следим в priceDoc
        async () => {
          console.log("WATCH Пекарни включенные в прайс");
          await tableFunc.loadTable();
        }
      );
    });

    return {
      //    currentRow,
      selectedRowDoc,
      selectedBakeryPrice,
      selectedRowBakery,
      priceStore,
      pagination,
      RowsBakeryPrice,
      columns,
      tableBodyMenu,
      tableFunc,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick(row) {
        console.log("Нажали по строке");
        selectedRowBakery.value = row;
      },
    };
  },
});
</script>
