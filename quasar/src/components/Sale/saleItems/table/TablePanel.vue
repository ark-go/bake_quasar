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
    style="width: fit-contentВыкючил"
    @refTable="(val) => (refTableArticle = val)"
    v-if="tableName"
    :title="saleArticleTitle"
    :tableName="tableName"
    :rows="articleBakeryRows"
    :columns="columnsReact"
    :tableBodyMenu="tableBodyMenu"
    :tableFunc="tableFunc"
    @onInfoRow="$emit('onRowDblClick')"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onAdd="onRowClick"
    @onRowDblClick="$emit('onRowDblClick')"
    :currentRow="selectedArticleBakeryRow"
    noExpandPanel
    noEditTable
    :rowsPerPage="0"
  >
    <template #contextMenu="dd">
      <table-Body-Menu
        :menuObj="dd"
        @onHideArticle="(menuObj) => $emit('onHideArticle', menuObj)"
        @onShowArticle="(menuObj) => $emit('onShowArticle', menuObj)"
      ></table-Body-Menu>
    </template>
  </Table-Template>
  <div v-else>не указана таблица</div>
</template>
<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  reactive,
  onMounted,
  watch,
  watchEffect,
  onUnmounted,
} from "vue";
import { useTableFunc } from "./tableFunc.js";
import { columns } from "./tableColumnList.js";
import { useSaleStore, storeToRefs } from "stores/saleStore.js";
import TableBodyMenu from "./TableBodyMenu.vue";
export default defineComponent({
  name: "TablePanel",
  components: {
    TableBodyMenu,
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
      default: "tabSale", // для запроса с сервера
    },
    title: {
      type: String,
      default: "Пекарни",
    },
    checkSave: Boolean,
    panelName: String,
  },
  emits: [""],
  setup(props, { emit }) {
    const tableFunc = useTableFunc(props.tableName);
    const columnsReact = ref([]);
    const tableBodyMenu = defineAsyncComponent(() => {
      return import("./TableBodyMenu.vue");
    });
    onMounted(() => {
      columnsReact.value = columns;
    });
    const {
      selectedArticleBakeryRow,
      articleBakeryRows,
      showHiddenArticle,
      showDoobleArticle,
      saleArticleTitle,
      refTableArticle,
      checkDateSale,
    } = storeToRefs(useSaleStore());
    const pagination = ref({
      rowsPerPage: 10,
    });

    function onRowClick(row) {
      console.log("Нажали по строке", row);
      selectedArticleBakeryRow.value = row;
    }
    watch(
      () => showHiddenArticle.value,
      () => {
        let i = refTableArticle.value.visibleColumns.findIndex((val) => {
          return val == "hidden";
        });
        if (showHiddenArticle.value) {
          if (i == -1) refTableArticle.value.visibleColumns.push("hidden");
        } else {
          if (i != -1) refTableArticle.value.visibleColumns.splice(i, 1);
        }
      }
    );
    watch(
      () => checkDateSale.value,
      () => {
        let i = refTableArticle.value.visibleColumns.findIndex((val) => {
          return val == "count_sale";
        });
        if (checkDateSale.value) {
          if (i == -1) refTableArticle.value.visibleColumns.push("count_sale");
        } else {
          if (i != -1) refTableArticle.value.visibleColumns.splice(i, 1);
        }
      }
    );
    watch(
      () => showDoobleArticle.value,
      () => {
        let i = refTableArticle.value.visibleColumns.findIndex((val) => {
          return val == "date_start";
        });
        if (showDoobleArticle.value) {
          if (i == -1) refTableArticle.value.visibleColumns.push("date_start");
        } else {
          if (i != -1) refTableArticle.value.visibleColumns.splice(i, 1);
        }
      }
    );
    onUnmounted(() => {
      console.log("unmount табле Продажи");
    });
    return {
      articleBakeryRows,
      selectedArticleBakeryRow,
      pagination,
      columnsReact,
      tableBodyMenu,
      tableFunc,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick,
      saleArticleTitle,
      refTableArticle,
    };
  },
});
</script>
