<template>
  <div class="column no-wrap">
    <!-- <div class="row" style="justify-content: space-between">
      <q-input ref="filterRef" dense v-model="filter" label="Поиск">
        <template v-slot:append>
          <q-icon
            v-if="filter !== ''"
            name="clear"
            class="cursor-pointer"
            @click.stop="filter = ''"
          />
          <q-icon v-else name="search" />
        </template>
      </q-input>
      <q-btn dense flat color="primary" @click="addNew()">ДОБАВИТЬ</q-btn>
    </div> -->
    <Table-Template
      title="Контрагенты"
      :tableName="tableName"
      :rows="rows"
      :columns="columns"
      yesBtnEdit
      yesBtnDelete
      @onInfoRow="onInfoRow"
      @onBtnDelete="onBtnDelete"
      @onBtnEdit="addNew"
      @onRowClick="onRowClick"
      @onAdd="addNew"
      :currentRow="currentRow"
      noExpandPanel
      :noEditTable="false"
      :store="store"
      :rowsPerPage="0"
    >
    </Table-Template>
    <!-- <q-table
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
      :title="tableName"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      @row-dblclick="dblClickRow"
    >
      <template v-slot:body="props">
        <kagent-table-body
          :propsV="props"
          @on-btn-edit="addNew"
          @on-btn-delete="onBtnDelete"
        ></kagent-table-body>
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
    </q-table> -->
  </div>
  <kagent-dialog
    v-model:allData="allDataDialog"
    v-model:showDialog="showDialog"
    :forSave="forSave"
    v-model:edit-mode="editMode"
    :kagentDel="kagentDel"
  ></kagent-dialog>
  <q-dialog v-model="showDialogDelete">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="red" text-color="white" />
        <span class="q-ml-sm">Удалить запись?</span><br />
        <span class="q-ml-sm" style="text-align: center">{{ tableName }}</span
        ><br />
      </q-card-section>
      <q-card-section>
        <span class="q-ml-sm">{{ nameElement }}</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup />
        <q-btn
          flat
          label="Удалить"
          color="primary"
          v-close-popup
          @click="onDeleteConfirm(confirmDelete)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  defineComponent,
  defineAsyncComponent,
  ref,
  onMounted,
  computed,
  watch,
  watchEffect,
  unref,
} from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
//import NoDataFooter from "components/NoDataFooter.vue";
import KagentDialog from "components/Kagent/KagentDialog.vue";
//import KagentTableBody from "components/Kagent/KagentTableBody.vue";
import { Meta } from "quasar";

export default defineComponent({
  name: "SpravTable",
  components: {
    // NoDataFooter,
    //  KagentTableBody,
    KagentDialog,
    TableTemplate: defineAsyncComponent(() => {
      return import("src/components/template/table/TableTemplate.vue");
    }),
  },
  setup(props) {
    const arkUtils = useArkUtils();
    const allDataDialog = ref({
      userId: -1,
      userName: "Петров",
    });
    // watch(allDataDialog, () => {
    //   // тест для проверки не импользуется в работе
    //   console.log("Возврат 1", allDataDialog);
    // });
    const currentRow = ref({});
    const showDialog = ref(false);
    const showDialogDelete = ref(false);
    const confirmDelete = ref({});
    const nameElement = ref("");
    const visibleColumns = ref([]);
    const columns = ref(columnsA);
    const rows = ref([]);
    const tableName = ref("");
    const editMode = ref("");
    function columnFilter() {
      visibleColumns.value = [];
      //   console.log("Колонки", columns);
      columns.value.forEach((item, index, array) => {
        if (["user_email", "user_date", "inn"].includes(item.name)) return;

        visibleColumns.value.push(item.name);
      });
      console.log("Колонки показать", visibleColumns.value);
    }
    async function onBtnDelete(val) {
      nameElement.value = val.name;
      confirmDelete.value._dataFromConfirm = val;
      showDialogDelete.value = true;
    }
    async function loadTable() {
      let mess = "Загрузка контрагентов";
      let res = await arkUtils.dataLoad("/api/kagentLoad", {}, mess);
      if (res.result) {
        onRowClick;
        rows.value = res.result;
      } else {
        tableName.value = res?.error;
        rows.value = [];
      }
    }
    onMounted(() => {
      loadTable();
      columnFilter();
    });
    async function onBtnEdit(val) {}

    async function addNew(rowForEdit) {
      allDataDialog.value = {};
      allDataDialog.value.franchising = false;
      allDataDialog.value.owncompany = false;
      allDataDialog.value.meta = {};

      if (rowForEdit) {
        // 13-09-22 убираем row  rowForEdit.row.id
        console.log("addNew-Edit", rowForEdit);
        allDataDialog.value.id = rowForEdit.id;
        allDataDialog.value.name = rowForEdit.name;
        allDataDialog.value.inn = rowForEdit.inn;
        allDataDialog.value.franchising = rowForEdit.franchising;
        allDataDialog.value.owncompany = rowForEdit.owncompany;
        allDataDialog.value.meta = rowForEdit.meta;
        allDataDialog.value.vidreg_id = rowForEdit.vidreg_id;
        console.log("edit row", allDataDialog.value);
      }

      // ----------------------------------
      let vidreg = {
        allData: {
          modelValue: [], //res.result.find(
          //   (x) => x.id === rowForEdit?.row?.vidreg
          // ),
        },
      };
      allDataDialog.value.vidreg = vidreg;
      showDialog.value = true;
    }
    /**
     * если allDataDialog без ID то вернет новую записанную строку
     */
    async function forSave() {
      console.log("на запись", allDataDialog.value);
      let dat = {
        id: allDataDialog.value?.id, // user
        name: allDataDialog.value.name,
        franchising: allDataDialog.value.franchising,
        owncompany: allDataDialog.value.owncompany,
        inn: allDataDialog.value.inn,
        vidreg_id: allDataDialog.value.vidreg_id,
        //        trademark_id: allDataDialog.value.trademark_id,
        meta: allDataDialog.value?.meta,
      };

      if (dat.id) {
        let res = await arkUtils.dataLoad(
          "/api/kagentUpdate",
          dat,
          "Обновление контрагента"
        );
        if (res.error) {
          return res;
        } else {
          await loadTable();
        }
        return res;
      } else {
        // вернет записанную строку целиком в result
        let res = await arkUtils.dataLoad(
          "/api/kagentAdd",
          dat,
          "Добавление контрагента"
        );
        if (res.result) {
          await loadTable();
          // обновим запись по всей странице
          // Это нужно потому что у нас открыто окно без ID
          // здесь мы зададим все поля прочитанные по новому, только созданному элементу
          allDataDialog.value.id = res.result.id; // user
          allDataDialog.value.name = res.result.name;
          allDataDialog.value.franchising = res.result.franchising;
          allDataDialog.value.owncompany = res.result.owncompany;
          allDataDialog.value.inn = res.result.inn;
          allDataDialog.value.vidreg_id = res.result.vidreg_id;
          //  allDataDialog.value.trademark_id = res.result.trademark_id;
          allDataDialog.value.meta = res.result.meta;
          return res;
        }
        return res;
      }
    }
    async function kagentDel(id) {
      let mess = "Удаление контрагента";
      let dat = { id: id };
      let res = await arkUtils.dataLoad("/api/kagentDelete", dat, mess);
      if (res.result) {
        allDataDialog.value.id = res.result.id; // удалить у нас оно еще в окне нвисит
        await loadTable();
        return true;
      } else {
        return false;
      }
    }
    function onRowClick(val) {
      console.log("onRowClick", val);
    }
    return {
      editMode,
      onRowClick,
      currentRow,
      allDataDialog,
      showDialog,
      nameElement,
      confirmDelete,
      showDialogDelete,
      forSave,
      kagentDel,
      async onDeleteConfirm(val) {
        console.log("delete", val._dataFromConfirm.id);
        await kagentDel(val._dataFromConfirm.id);
      },

      dblClickRow() {},
      onBtnDelete,
      visibleColumns,
      columns,
      tableName,
      rows,
      addNew,
      onBtnEdit,
      paginationСatalog: ref({
        rowsPerPage: 50,
      }),
      filter: ref(""),
    };
  },
});
const columnsA = ref([
  {
    name: "name",
    label: "Наименование",
    align: "left",
    field: "name",
    required: true,
    sortable: true,
  },
  {
    name: "vidreg_name",
    label: "Вид рег.",
    align: "left",
    field: "vidreg_name",
    sortable: true,
    required: true,
  },
  {
    name: "trademark_name",
    label: "Торг.сеть",
    align: "left",
    field: "trademark_name",
    sortable: true,
    required: true,
  },
  {
    name: "inn",
    label: "ИНН",
    align: "left",
    field: "inn",
  },
  {
    name: "franchising",
    label: "Фрч",
    align: "center",
    field: "franchising",
    required: true,
    sortable: true,
  },
  {
    name: "owncompany",
    label: "Свои",
    align: "center",
    field: "owncompany",
    sortable: true,
  },
  {
    name: "user_email",
    label: "Е-Mail",
    align: "left",
    field: "user_email",
    hidden: true,
  },
  {
    name: "user_date",
    label: "Дата",
    align: "left",
    field: "user_date",
    hidden: true,
  },
]);
</script>

<style lang="scss">
.table-kagent-column-table {
  /* указав максимальную ширину, чтобы пример мог
выделить липкий столбец в любом окне браузера */
  //max-width: 40%;

  // thead tr:first-child th:first-child {
  //   /* bg цвет важен для th; просто укажите один */
  //   background-color: #fff;
  // }
  // td:first-child {
  //   background-color: #fdfdfc;
  // }
  // th:first-child,
  // td:first-child {
  //   position: sticky;
  //   left: 0;
  //   z-index: 1;
  // }
}
</style>
