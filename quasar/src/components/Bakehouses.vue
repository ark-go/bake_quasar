<template>
  <bakehouses-form
    :data="editData"
    @update-table="updateTable"
  ></bakehouses-form>
  <div class="q-pa-md">
    <q-table
      style="min-width: 600px"
      dense
      no-data-label="Нет данных."
      class="my-sticky-virtscroll-table"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="email"
      title="Пекарни"
      :rows="rows"
      :columns="columns"
      @row-dblclick="dblClickRow"
    />
  </div>
</template>

<script>
import { ref, onMounted, reactive, toRefs } from "vue";
import { axios } from "boot/axios";
import BakehousesForm from "components/BakehousesForm.vue";
import { useQuasar } from "quasar";

export default {
  name: "BakeHouses",
  components: {
    BakehousesForm,
  },
  setup() {
    const test = ref("");
    let rows = ref([]);
    const editData = reactive({ email: "fff" });
    const mount = async () => {
      test.value = "Mounted";
      const m = await dataLoad();
      rows.value = m.result;
      //console.log("Пекарни table: ", m.result);
    };
    onMounted(mount);
    function dblClickRow(evt, row, idx) {
      //editData.value = { email: "98888777" };
      editData.value = { ...row }; //  = reactive(row); //toRefs(row);
      console.log("row: ", row.email);
      console.log("idx: ", idx);
      console.log("evt: ", editData);
    }
    async function updateTable() {
      const m = await dataLoad();
      rows.value = m.result;
    }
    return {
      editData,
      test,
      columns,
      rows,
      pagination: ref({
        rowsPerPage: 10,
      }),
      dblClickRow,
      updateTable,
    };
  },
};
async function dataLoad() {
  try {
    let resp = await axios.post("/api/bakehousesLoad", {});
    let data = resp.data;
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "bakehousesLoad: Ошибка чтения данных (bakehousesLoad)",
    };
  }
}
const columns = [
  //   {
  //     name: "index",
  //     label: "#",
  //     field: "index",
  //   },
  { name: "bakehouse", label: "Пекарня", field: "bakehouse", sortable: true },
  {
    name: "region",
    required: true,
    label: "Регион",
    align: "left",
    field: "region",
    // field: (row) => row.name,
    // format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "territory",
    align: "center",
    label: "Территория",
    field: "territory",
    sortable: true,
  },
  { name: "own", label: "Принадлежность", field: "own", sortable: true },
  { name: "city", label: "Город", field: "city" },

  {
    name: "brandname",
    label: "Бренд",
    field: "brandname",
    sortable: true,
    //  sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  { name: "distributing", label: "Торговая сеть", field: "distributing" },
  { name: "administering", label: "Управляющий", field: "administering" },
];
</script>

<style></style>
