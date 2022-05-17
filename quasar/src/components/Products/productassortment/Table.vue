<template>
  <div class="column no-wrap">
    <q-table
      style="min-width: 100px; display: grid"
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
        ></table-body>
      </template>
      <template v-slot:top-left>
        <div class="row">
          <q-btn flat round color="green" icon="add" @click="onAdd()" />
          <div style="min-width: 25px"></div>
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
  <form-dialog
    :rowData="rowCurrent"
    :allSprav="allSprav"
    v-model:showDialog="showDialog"
    @onSave="onSave"
    :title="tablabel"
  ></form-dialog>
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
import FormDialog from "./FormDialog.vue";
import TableBody from "./TableBody.vue";
import FindTable from "./FindTable.vue";
import { useQuasar } from "quasar";
//import { Meta } from "quasar";

//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "SpravTable",
  components: {
    NoDataFooter,
    TableBody,
    FormDialog,
    FindTable,
  },
  props: {
    tabname: String,
    tablabel: String,
  },
  setup(props) {
    const $q = useQuasar();
    const rows = ref([]);
    const visibleColumns = ref([]);
    const showDialog = ref(false);
    const rowCurrent = ref({});
    const allSprav = ref({});
    //const visibleOffDefault = ref([]);
    //const columns = ref([]);
    onMounted(async () => {
      await loadTable();
      columnFilter();
    });
    async function onSave(row) {
      if (row?.id) console.log("Готов записывать Обновления", row);
      else console.log("Готов записывать Новый объект", row);
      console.log("SAVE1: ", row);
      await addTable(row);
    }
    function columnFilter() {
      visibleColumns.value = [];
      columns.forEach((item, index, array) => {
        if (visibleOffDefault.includes(item.name)) return;
        visibleColumns.value.push(item.name);
      });
    }

    async function loadTable() {
      let mess = "Загрузка типов продукции";
      let res = await dataLoad(
        "/api/products",
        { cmd: "load", tabname: props.tabname },
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
        "/api/products",
        { id: row.id, cmd: "delete", tabname: props.tabname },
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
      let mess = "Добавление вида сырья";
      console.log("SAVE-0: ", row);
      let res = await dataLoad(
        "/api/products",
        { ...row, ...{ cmd: "add", tabname: props.tabname } },
        mess
      );
      if (res.result) {
        // получим строку в []
        console.log("Записали", res.result);
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
        showDialog.value = false;
      } else {
        //! не обнуляем таблицу, у нас открыто окно ввода данных
        // rows.value = [];
      }
    }
    async function onDelete(val) {
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
    async function loadAllSprav() {
      let res = await dataLoad(
        "/api/products",
        { cmd: "allSprav", tabname: props.tabname },
        "Чтение справочников для ассортимента"
      );
      return res?.result || [];
    }
    async function showDialogStart(row) {
      allSprav.value = await loadAllSprav();
      rowCurrent.value = row;
      showDialog.value = true;
    }
    return {
      allSprav,
      showDialog,
      onDelete,
      onSave,
      rowCurrent,
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
        await showDialogStart(row);
      },
    };
  },
});
let visibleOffDefault = [
  "user_email",
  "user_date",
  "territory_name",
  "branch_name",
  "address",
  "dateopen",
  "dateclose",
  "area",
  "kolbakers",
  "description",
];
let columns = [
  {
    name: "name",
    label: "Наименование",
    align: "left",
    field: "name",
    required: true,
  },
  {
    name: "prefix",
    label: "Префикс",
    align: "left",
    field: "prefix",
    required: true,
  },
];
</script>
