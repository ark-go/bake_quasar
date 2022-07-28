<template>
  <div class="column no-wrap" style="max-height: inherit">
    <q-table
      style="min-width: 100px; display: grid; overflow: auto"
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
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-if="isLeft" />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-italic text-purple"
          >
            {{ col.label }}
          </q-th>
          <q-th v-if="!isLeft" />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <table-body
          :propsV="props"
          @on-btn-edit="onEdit"
          :isLeft="isLeft"
          :buttons="['blue']"
        ></table-body>
      </template>
      <template v-slot:top-left>
        <div class="row">
          <!-- <q-btn flat round color="green" icon="add" @click="onAdd()" />
          <div style="min-width: 25px"></div> -->
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
    :currentTab="currentTab"
    :rowData="rowCurrent"
    v-model:showDialog="showDialog"
    @onSave="onSave"
    :title="tablabel"
  ></form-dialog>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watchEffect } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import NoDataFooter from "components/NoDataFooter.vue";
import FormDialog from "./FormDialog.vue";
import TableBody from "./TableBody.vue";
import FindTable from "./FindTable.vue";
import { arkVuex } from "src/utils/arkVuex.js";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "TableRaw",
  components: {
    NoDataFooter,
    TableBody,
    FormDialog,
    FindTable,
  },
  props: {
    tabname: String,
    tablabel: String,
    isLeft: Boolean,
  },
  emits: ["addIngredient"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const arkUtils = useArkUtils();
    const { selectedRowsVuex } = arkVuex();
    const rows = ref([]);
    const visibleColumns = ref([]);
    const showDialog = ref(false);
    const rowCurrent = ref({});
    const currentTab = ref("");
    const allSprav = ref();
    //const visibleOffDefault = ref([]);
    //const columns = ref([]);
    onMounted(async () => {
      await loadTable();
      columnFilter();
    });

    // watchEffect(
    //   () => props.tabname,
    //   async () => {
    //     await loadTable();
    //   }
    // );
    function columnFilter() {
      visibleColumns.value = [];
      // columns.forEach((item, index, array) => {
      //   if (visibleOffDefault.includes(item.name)) return;
      //   visibleColumns.value.push(item.name);
      // });
    }
    //"loadRaw", "recept"

    async function loadTable(cmd = "loadRaw", tabname = "recept") {
      //! вызывается снаружи из родительского компонента напрямую
      currentTab.value = cmd;
      let mess = "Загрузка продукции";
      let res = await arkUtils.dataLoad(
        "/api/products",
        { cmd: cmd, tabname: tabname },
        // { cmd: cmd, tabname: "recept" },
        mess
      );
      if (res.result) {
        rows.value = res.result;
      } else {
        rows.value = [];
      }
    }
    // Добавлять будем в рецепт
    async function addTable(row) {
      let mess = "Добавление вида сырья";
      console.log("SAVE-0: ", row);
      // в row - строка из таблицы, нам необходимо переложить ее в
      // в другую таблицу
      let dat = {
        products_id: selectedRowsVuex.products[0].id,
        is_raw: row.is_raw,
        massbrutto: row.massbrutto,
        massnetto: row.massnetto,
        massfinish: row.massfinish,
        description: row.description,
      };
      // если это не сырье
      if (row.is_raw) {
        dat.productraw_id = row.id;
      } else {
        dat.products_id_child = row.id;
      }

      let res = await arkUtils.dataLoad(
        "/api/products",
        { ...dat, ...{ cmd: "add", tabname: "productingred" } },
        mess
      );
      if (res.result) {
        // получим строку в []
        console.log("Записали", res.result);
        //  console.log("return one row", res.result[0]);
        //! await loadTable();
        emit("addIngredient");
        showDialog.value = false;
      } else {
        console.log("Ошибка? нет возврата при добавлении productingred");
        //! не обнуляем таблицу, у нас открыто окно ввода данных
        // rows.value = [];
      }
    }
    async function onSave(row) {
      if (row?.id) console.log("Готов записывать Обновления", row);
      else console.log("Готов записывать Новый объект", row);
      console.log("SAVE1: ", row);
      await addTable(row);
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
          // await deleteTable(val);
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
    async function showDialogStart(row) {
      console.log("Dialog new show", row);

      rowCurrent.value = row;
      showDialog.value = true;
    }
    return {
      currentTab,
      loadTable,
      onSave,
      showDialog,
      showDialogStart,
      allSprav,
      onDelete,
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
let visibleOffDefault = ["user_email", "user_date"];
let columns = [
  {
    name: "name",
    label: "Наименование",
    align: "left",
    field: "name",
    required: true,
  },
];
</script>
