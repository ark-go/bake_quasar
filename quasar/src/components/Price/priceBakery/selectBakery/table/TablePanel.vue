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
    :rows="rows"
    :columns="columns"
    :tableFunc="tableFunc"
    @onInfoRow="onInfoRow"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onAdd="onRowClick"
    noExpandPanel
    noTitlePanel
    noEditTable
    :rowsPerPage="0"
    row-key="id"
    selection="multiple"
    :selected="selected"
    @update:selected="$emit('update:selected', $event)"
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
  watchEffect,
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
      default: "Пекарни в документе",
    },
    checkReload: Boolean,
    panelName: String,
    selected: Array,
  },
  emits: [""],
  setup(props, { emit }) {
    const tableFunc = useTableFunc(props.tableName);
    // const tableBodyMenu = defineAsyncComponent(() => {
    //   return import("./TableBodyMenu.vue");
    // });
    const { selectedBakeryModal } = storeToRefs(usePriceStore());
    const rows = ref([]);

    // const currentRow = ref({});
    const pagination = ref({
      rowsPerPage: 10,
    });
    // function reLoadComponent() {}
    // watchEffect(() => {
    //   reLoadComponent(props.panelName);
    // });
    watch(
      // сигнал на перезагрузку таблицы
      () => props.checkReload,
      async () => {
        rows.value = await tableFunc.loadTable();
      }
    );
    onMounted(async () => {
      rows.value = await tableFunc.loadTable();
    });
    return {
      pagination,
      rows,
      columns,
      tableFunc,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick(row) {
        console.log("Нажали по строке");
        let i = selectedBakeryModal.value.findIndex((val) => {
          if (val.id == row.id) return true;
        });
        if (i != -1) {
          selectedBakeryModal.value.splice(i, 1);
        } else {
          selectedBakeryModal.value.push(row);
        }
        console.log("Выбрано чтото", selectedBakeryModal.value);
      },
    };
  },
});
</script>
