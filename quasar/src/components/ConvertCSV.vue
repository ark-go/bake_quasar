<template>
  <div class="column" style="width: 250px">
    <div class="q-pa-md" style="max-width: 350px">
      Вставьте сюда текст CSV файла
      <q-input v-model="data.csv" filled type="textarea" />
      <br />
      <q-btn outline rounded color="indigo" label="Готово" @click="onClick" />
    </div>
  </div>
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
    title="ТЕСТ"
    :rows="rows"
  />
</template>

<script>
import { ref, reactive } from "vue";
import { axios } from "boot/axios";
export default {
  name: "ConvertCSV",
  setup() {
    const data = reactive({
      csv: "",
      action: "тест акция",
    });
    let rows = ref([]);
    async function onClick() {
      let csvres = await addData(data);
      if (csvres?.error) {
        console.log("Ошибка CSV", csvres.error);
      } else {
        rows.value = csvres.dataCsv;
        console.log("CSV:", csvres.dataCsv);
      }
    }
    return {
      data,
      rows,
      onClick,
      filter: ref(""),
      pagination: ref({
        rowsPerPage: 15,
      }),
    };
  },
};
async function addData(data) {
  try {
    let resp = await axios.post("/api/convertCSV", data);
    let result = resp.data;
    console.log("convertCSV", result);
    return result;
  } catch (err) {
    console.log(err);
    return {
      error: "convertCSV: Ошибка convertCSV ",
    };
  }
}
</script>
