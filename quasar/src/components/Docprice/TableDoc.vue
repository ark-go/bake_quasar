<template>
  <div class="column no-wrap" style="max-height: inherit">
    <q-table
      :ref="(el) => (refTable = el)"
      style="min-width: 100px; display: grid; overflow: auto"
      table-header-class="bg-grey-2"
      dense
      :filter="filter"
      no-data-label="Нет данных."
      no-results-label="Ничего не найдено."
      class="my-sticky-virtscroll-table table-kagent-column-table"
      virtual-scroll
      v-model:pagination="paginationСatalog"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      title="Тип продукции"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      @row-dblclick="dblClickRow"
    >
      <template v-slot:body="props">
        <table-body
          :propsV="props"
          @on-btn-edit="onEdit"
          @on-btn-delete="onDelete"
          @onRowClick="onRowClick"
          :selected-Row-Id="docPrice.currRowDoc.id"
        ></table-body>
      </template>
      <template v-slot:top-left>
        <div class="row">
          <!-- <q-btn flat round color="green" icon="add" @click="onAdd()" /> -->
          <!-- <div style="min-width: 25px"></div> -->
          <find-table v-model:filter="filter"></find-table>
        </div>
      </template>
      <template v-slot:top-right>
        <q-space />

        <q-select
          v-model="visibleColumns"
          multiple
          dense
          options-dense
          display-value="Вид"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          options-cover
          style="min-width: 30px"
        />
      </template>
      <template v-slot:no-data="dataslot">
        <no-data-footer :dataslot="dataslot"></no-data-footer>
      </template>
    </q-table>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watch,
  watchEffect,
  unref,
} from "vue";
import { dataLoad } from "src/utils/ark.js";
import NoDataFooter from "components/NoDataFooter.vue";
//import FormDialog from "./FormDialog.vue";
import TableBody from "./TableBody.vue";
import FindTable from "./FindTable.vue";
import { useQuasar } from "quasar";
import { useDocPrice } from "stores/storeDocPrice.js";
//import { emitter } from "src/boot/axios";
//import { Meta } from "quasar";

//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TableDoc",
  components: {
    NoDataFooter,
    TableBody,
    // FormDialog,
    FindTable,
  },
  props: {
    tabname: String,
    tablabel: String,
    dateRange: Object,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const docPrice = useDocPrice();
    const rows = ref([]);
    const visibleColumns = ref([]);
    const refTable = ref(null);
    const allSprav = ref();
    //const visibleOffDefault = ref([]);
    //const columns = ref([]);
    onMounted(async () => {
      // await loadTable();
      columnFilter();
    });
    function onRowClick(row, isTableButton) {
      if (isTableButton) {
        docPrice.currRowDoc = row;
        return;
      }

      if (docPrice.currRowDoc?.id && docPrice.currRowDoc.id == row.id)
        docPrice.currRowDoc = {};
      else docPrice.currRowDoc = row;
    }
    // async function onSave(row) {
    //   if (row?.id) console.log("Готов записывать Обновления", row);
    //   else console.log("Готов записывать Новый объект", row);
    //   console.log("SAVE1: ", row);
    //   await addTable(row);
    // }
    function columnFilter() {
      visibleColumns.value = [];
      // columns.forEach((item, index, array) => {
      //   if (visibleOffDefault.includes(item.name)) return;
      //   visibleColumns.value.push(item.name);
      // });
    }

    async function loadTable(datRange = props.dateRange) {
      let mess = "Загрузка документов";
      let res = await dataLoad(
        "/api/docprice",
        { cmd: "load", tabname: "docprice", dateRange: datRange },
        mess
      );
      if (res.result) {
        rows.value = res.result;
      } else {
        rows.value = [];
      }
    }
    async function deleteTable(row) {
      let mess = "Удаление";
      let res = await dataLoad(
        "/api/docprice",
        { id: row.id, cmd: "delete", tabname: "docprice" },
        mess
      );
      if (res.result) {
        rows.value = res.result;
        try {
          let idx = rows.value.findIndex((val) => {
            return val.id == row.id;
          });
          if (idx != -1) {
            // если нашли то что удаляли, то удалим из нашего Array таблицы
            //  rows.value.splice(idx, 1);
            await loadTable();
            //console.log("посде удал", rows.value);
          }
        } catch {
          console.log("тут ошибка № 2410");
        }
      } else {
        // Мы не удалили ничего
        //await loadTable();
      }
    }
    async function addTable(row) {
      let mess = "Добавить документ";
      console.log("SAVE-0: ", row);
      let res = await dataLoad(
        "/api/docprice",
        { ...row, ...{ cmd: "add", tabname: "docprice" } },
        mess
      );
      if (res.result) {
        // получим строку в []
        console.log("Записали", res.result, row);
        emit("onCloseDialog");
        //  console.log("return one row", res.result[0]);
        if (row.id) {
          // если передавали id значит был Update
          // найдем в нашем Array таблице id обновляемой строки
          let idx = rows.value.findIndex((val) => {
            return val.id == row.id;
          });
          if (idx != -1) {
            // если нашли то что обновляли, то заменим новой строкой
            rows.value[idx] = res.result[0];
          } else {
            //! Запустить полное перечитывание
            // не может произойти
            console.log("Аварийное перечитывание");
            await loadTable();
          }
        } else {
          // передавали без Id значит была новая строка
          // вставим полученную новую строку в наш Array таблицы, вперед
          rows.value.unshift(res.result[0]);
        }
        // showDialog.value = false;
      } else {
        //! не обнуляем таблицу, у нас открыто окно ввода данных
        // rows.value = [];
      }
    }
    async function onDelete(val) {
      onRowClick(val, true);
      //------------- Dialog
      $q.dialog({
        title: "Удалить запись?",
        message: val.name,
        cancel: true,
        persistent: true,
        ok: { label: "Удалить", color: "red-3" }, // q-btn
        cancel: { label: "Отменить", color: "blue-5" },
        focus: "cancel",
      })
        .onOk(async () => {
          // console.log('>>>> OK')
          await deleteTable(val);
        })
        .onOk(() => {
          console.log(">>>> second OK catcher");
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });

      //--------------------
    }
    // async function loadAllSprav() {
    //   let res = await dataLoad(
    //     "/api/docprice",
    //     { cmd: "allSprav", tabname: props.tabname },
    //     "Чтение справочников для вида продукции"
    //   );
    //   return res?.result || [];
    // }
    async function showDialogStart(row) {
      emit("onShowDialog", row);
    }
    return {
      docPrice,
      loadTable,
      addTable,
      refTable,
      onRowClick,
      showDialogStart,
      allSprav,
      onDelete,
      rows,
      filter: ref(""),
      paginationСatalog: ref({
        rowsPerPage: 10,
      }),
      columns,
      visibleColumns,
      visibleOffDefault,
      async onAdd(row) {
        await showDialogStart(row);
      },
      async onEdit(row) {
        onRowClick(row, true);
        await showDialogStart(row);
      },
    };
  },
});
let visibleOffDefault = ["user_email", "user_date"];
let columns = [
  {
    name: "datestart",
    label: "Дата",
    align: "center",
    field: "datestart",
    required: true,
  },
  {
    name: "docnum",
    label: "№ Док-та",
    align: "left",
    field: "docnum",
    required: true,
  },
  {
    name: "docpricevid_name",
    label: "Вид док.",
    align: "left",
    field: "docpricevid_name",
  },

  {
    name: "name",
    label: "Наименование",
    align: "left",
    field: "name",
    style: "width: 50px",
    required: true,
  },

  {
    name: "kagent_name",
    label: "Контр.агент",
    align: "left",
    field: "kagent_name",
    required: true,
  },
  {
    name: "description",
    label: "Примечание",
    align: "left",
    field: "description",
  },
];
</script>
<style lang="scss" scoped>
.select-row {
  color: red;
}
</style>
