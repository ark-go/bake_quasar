<template>
  <partners-form :data="editData" @update-table="updateTable"></partners-form>
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
      title="Контрагенты (партнеры)"
      :rows="rows"
      :columns="columns"
      @row-dblclick="dblClickRow"
    />
  </div>
</template>

<script>
import { ref, onMounted, reactive, toRefs } from "vue";
import { axios } from "boot/axios";
import PartnersForm from "components/PartnersForm.vue";
import { useQuasar } from "quasar";

export default {
  name: "f-partners",
  components: {
    PartnersForm,
  },
  setup() {
    const test = ref("");
    let rows = ref([]);
    const editData = reactive({ email: "fff" });
    const mount = async () => {
      test.value = "Mounted";
      const m = await dataLoad();
      rows.value = m.result;
    };
    onMounted(mount);
    function dblClickRow(evt, row, idx) {
      //editData.value = { email: "98888777" };
      editData.value = { ...row }; //  = reactive(row); //toRefs(row);
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
    let resp = await axios.post("/api/partnersLoad", {});
    let data = resp.data;
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "partnersLoad: Ошибка чтения данных (partnersLoad)",
    };
  }
}
const columns = [
  //   {
  //     name: "index",
  //     label: "#",
  //     field: "index",
  //   },
  {
    name: "partner",
    label: "Контрагент",
    field: "partner",
    sortable: true,
  },
  {
    name: "typepartner",
    label: "Тип контрагента",
    field: "typepartner",
    sortable: true,
  },
  {
    name: "typeregistracion",
    required: true,
    label: "Тип регистрации",
    align: "left",
    field: "typeregistracion",
    // field: (row) => row.name,
    // format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "grouppartner",
    align: "center",
    label: "Группа контрагента",
    field: "grouppartner",
    sortable: true,
  },
];
</script>

<style></style>
