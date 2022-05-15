<template>
  <users-form :data="editData" @update-table="updateTable"></users-form>
  <div class="q-pa-md">
    <q-table
      style="min-width: 600px"
      dense
      no-data-label="Нет данных."
      no-results-label="Ничего не найдено."
      :filter="filter"
      class="my-sticky-virtscroll-table"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="email"
      title="Пользователи"
      :rows="rows"
      :columns="columns"
      @row-dblclick="dblClickRow"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Поиск"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, onMounted, reactive, toRefs } from "vue";
import { axios } from "boot/axios";
import UsersForm from "components/UsersForm.vue";
import { useQuasar } from "quasar";

export default {
  name: "AllUsers",
  components: {
    UsersForm,
  },
  setup() {
    const test = ref("");
    let rows = ref([]);
    const editData = reactive({ email: "fff" });
    const mount = async () => {
      test.value = "Mounted";
      const m = await dataLoad();
      rows.value = m.result;
      console.log("users table: ", rows);
    };
    onMounted(mount);
    function dblClickRow(evt, row, idx) {
      //editData.value = { email: "98888777" };
      editData.value = { ...row }; //  = reactive(row); //toRefs(row);
    }
    async function updateTable() {
      // const m = await dataLoad();
      // rows.value = m.result;
    }
    return {
      filter: ref(""),
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
    let resp = await axios.post("/api/usersLoad", {});
    let data = resp.data;
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "Login: Ошибка чтения данных (usersLoad)",
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
    name: "email",
    required: true,
    label: "E-mail",
    align: "left",
    field: "email",
    // field: (row) => row.name,
    // format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "username",
    align: "center",
    label: "Username",
    field: "username",
    sortable: true,
  },
  { name: "u_fam", label: "Фамилия", field: "u_fam", sortable: true },
  { name: "u_name", label: "Имя", field: "u_name" },

  {
    name: "u_otch",
    label: "Отчество",
    field: "u_otch",
    sortable: true,
    //  sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];
</script>

<style></style>
