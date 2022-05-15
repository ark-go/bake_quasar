<template>
  <div class="q-pa-md column">
    <select-catalog v-model="selectCatalog"></select-catalog>
    <div class="row">
      <div class="column">
        <q-table
          style="min-width: 250px"
          dense
          no-data-label="Нет данных."
          class="my-sticky-virtscroll-table"
          virtual-scroll
          v-model:pagination="paginationСatalog"
          :rows-per-page-options="[0]"
          :virtual-scroll-sticky-size-start="48"
          row-key="email"
          :title="CatalogName"
          :rows="rowsCatalog"
          :columns="columnsCatalog"
          @row-dblclick="dblClickRow"
        />
        <br />
        <q-btn
          outline
          rounded
          color="indigo"
          label="Новый элемент"
          @click="newRecord"
        />
      </div>
      <br />
      <q-table
        style="min-width: 500px"
        dense
        no-data-label="Нет данных."
        class="my-sticky-virtscroll-table"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="48"
        row-key="email"
        title="Справочники"
        :rows="rows"
        :columns="columns"
        @row-dblclick="null"
      />
    </div>
    <br />
  </div>
  <teleport to="body">
    <div v-if="modalOpen" class="modal1 popupbackground">
      <div class="modal2">
        <PopupWindow
          @close="modalOpen = false"
          @save="save"
          @remove="remove"
          :edit-value="editValue"
          :edit-label="editLabel"
          :is-add-value="isAddValue"
          :is-vid-nomencl="isVidNomencl"
        ></PopupWindow>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref, onMounted, reactive, computed, toRefs, watch } from "vue";
import { axios } from "boot/axios";
//import PartnersForm from "components/PartnersForm.vue";
import SelectCatalog from "components/select/SelectCatalog.vue";
import PopupWindow from "components/PopupWindow.vue";
import { useQuasar } from "quasar";
import { Notify } from "quasar";
export default {
  name: "f-catalogs",
  components: {
    //  PartnersForm,
    SelectCatalog,
    PopupWindow,
  },
  setup() {
    const { notify } = useQuasar();
    let rows = ref([]);
    const rowsCatalog = ref([]);
    const CatalogName = ref("");
    const editData = reactive({ email: "fff" });
    const selectCatalog = ref({ value: null, label: "" });
    const modalOpen = ref(false);
    const isAddValue = ref(false);
    const editValue = ref("");
    const editLabel = ref("");
    const isVidNomencl = ref(false);
    async function selectedCatalog() {
      // поучаем данные из popup формы выбора
      console.log("Выбрано селектором ", selectCatalog.value);
      CatalogName.value = selectCatalog.value.label;
      isVidNomencl.value = selectCatalog.value.value == "vidnomencl";
      console.log("тип каталога", isVidNomencl, selectCatalog.value.value);
      const mdata = await catalogLoad(selectCatalog.value.value, true);
      if (mdata?.resultHistory?.error) {
        console.log(
          "Ошибка загрузки resultHistory",
          mdata?.resultHistory?.error
        );
      } else {
        if (mdata.resultHistory?.result) {
          rows.value = mdata.resultHistory?.result;
        } else {
          rows.value = {};
        }
      }
      if (mdata?.result?.error) {
        console.log("Ошибка загрузки result каталога", mdata?.result?.error);
      } else {
        if (mdata.result?.result) {
          rowsCatalog.value = mdata.result?.result;
        } else {
          rowsCatalog.value = {};
        }
      }
    }
    watch(selectCatalog, selectedCatalog);
    // const computedModelValue = computed({
    //   get: () => props.modelValue,
    //   set: (val) => {
    //     emit("update:modelValue", val);
    //     //  getCatalog(val);
    //   },
    // });
    const mount = async () => {
      const m = await dataLoad(); // грузим список таблиц

      rows.value = m.result;
      if (rows.value?.length > 0) {
        console.log("загрузили список", rows.value[0]);
        selectCatalog.value = rows.value[0];
      } else {
        selectCatalog.value = {};
      }
    };
    onMounted(mount);
    function dblClickRow(evt, row, idx) {
      editData.value = { ...row }; //  = reactive(row); //toRefs(row);
      editValue.value = editData.value;
      editLabel.value = editData.value.label;
      isAddValue.value = false;
      modalOpen.value = true;
    }
    // async function updateTable() {
    //   const m = await dataLoad();
    //   rows.value = m.result;
    // }
    function newRecord() {
      console.log("newRecord");
      isAddValue.value = true;
      modalOpen.value = true;
    }
    async function save(newData, newValue) {
      console.log("+++++", newData, newValue);
      //let newLabel = newData.name;
      modalOpen.value = false;
      if (isAddValue.value) {
        if (selectCatalog.value) {
          if (await addTable(selectCatalog.value, newData)) {
            selectedCatalog();
          }
        }
        isAddValue.value = false;
      } else {
        if (await updateTable(selectCatalog.value, newValue.value, newData)) {
          selectedCatalog();
        }
      }
    }
    async function remove(newValue) {
      modalOpen.value = false;
      console.log("GGG", newValue, selectCatalog.value, isAddValue.value);
      if (!newValue) return;
      if (selectCatalog.value) {
        // существует имя таблицы
        if (!isAddValue.value) {
          // было редактирование элемента
          if (await deleteTable(selectCatalog.value, newValue)) {
            selectedCatalog();
          }
        }
      }
    }
    return {
      save,
      remove,
      isAddValue,
      modalOpen,
      editValue,
      editLabel,
      newRecord,
      CatalogName,
      selectCatalog,
      editData,
      columns,
      columnsCatalog,
      rows,
      rowsCatalog,
      pagination: ref({
        rowsPerPage: 10,
      }),
      paginationСatalog: ref({
        rowsPerPage: 10,
      }),
      dblClickRow,
      isVidNomencl,
    };
  },
};
async function dataLoad() {
  try {
    let resp = await axios.post("/api/catalogsLoad", {});
    let data = resp.data;
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "partnersLoad: Ошибка чтения данных (catalogsLoad)",
    };
  }
}
async function catalogLoad(name, isHistory) {
  try {
    let resp = await axios.post("/api/catalogLoad", {
      name: name,
      isHistory: isHistory,
    });
    let data = resp.data;
    console.log("catalogLoad-0", data);
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "SelectCatalog: Ошибка чтения данных (catalogLoad)",
    };
  }
}
const columnsCatalog = [
  {
    name: "label",
    label: "Название",
    field: "label",
    sortable: true,
    align: "left",
  },
];

const columns = [
  {
    name: "label",
    label: "Название",
    field: "label",
    sortable: true,
  },
  {
    name: "value",
    label: "Справочник",
    field: "value",
    sortable: true,
  },
  {
    name: "date",
    required: true,
    label: "История",
    align: "left",
    field: "date",
    // field: (row) => row.name,
    // format: (val) => `${val}`,
    sortable: true,
  },
];
async function popupErr(message) {
  Notify.create({
    color: "red",
    position: "top",
    message: message,
    icon: "report_problem",
  });
}
async function popupMess(message) {
  Notify.create({
    color: "green",
    position: "top",
    message: message,
    icon: "",
  });
}
async function addTable(tableName, newData) {
  //newLabel = newLabel.trim();
  if (!newData.name.trim()) {
    popupErr("Пустая строка!");
    return;
  }
  console.log("новый на запись: ", tableName.value, newData);
  try {
    let resp = await axios.post("/api/catalogAdd", {
      tableName: tableName.value,
      newData: newData,
    });

    let result = resp.data;
    if (result?.message) {
      popupMess(result.message);
      return true;
    } else if (result?.error) {
      popupErr(result.error);
      return false;
    } else {
      popupErr(
        result?.error ? result.error : "Ошибка 2: нет данных об ошибке ?"
      );
    }
    return false;
  } catch (err) {
    popupErr(err.toString());
    console.log("Ошибка catalogAdd", err);
    return false;
  }
}
async function updateTable(tableName, newValue, newData) {
  //newValue = newValue.trim();
  if (!newData?.name.trim()) {
    popupErr("Пустая строка!");
    return;
  }
  console.log("новый на обновление: ", tableName.value, newData, newValue);
  try {
    let resp = await axios.post("/api/catalogUpdate", {
      tableName: tableName.value,
      newData: newData,
      newValue: newValue,
    });

    let result = resp.data;
    // console.log("add el:", result, result.message);
    if (result?.message) {
      popupMess(result.message);
      return true;
    } else if (result?.error) {
      popupErr(result.error);
      return false;
    } else {
      popupErr("Ошибка 2: нет данных об ошибке ?");
    }
    return false;
  } catch (err) {
    popupErr(err.toString());
    console.log("Ошибка catalogUpdate", err);
    return false;
  }
}
async function deleteTable(tableName, newValue) {
  if (!newValue) {
    popupErr("Не выбран элемент!");
    return;
  }
  console.log("удаление: ", tableName.value, newValue);
  try {
    let resp = await axios.post("/api/catalogDelete", {
      tableName: tableName.value, // там объект
      newValue: newValue,
    });

    let result = resp.data;
    // console.log("add el:", result, result.message);
    if (result?.message) {
      popupMess(result.message);
      return true;
    } else if (result?.error) {
      popupErr(result.error);
      return false;
    } else {
      popupErr("Ошибка 2: нет данных об ошибке ?");
    }
    return false;
  } catch (err) {
    popupErr(err.toString());
    console.log("Ошибка deleteTable", err);
    return false;
  }
}
</script>

<style lang="scss">
.modal1 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
}

.modal2 {
  width: 300px;
  // height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -125px 0 0 -125px;
  background-color: white;
}
.popupbackground {
  background-color: rgba(123, 123, 124, 0.5);
}
</style>
>
