<template>
  <q-page class="flex flex-center" style="background-color: lightgray">
    <!-- <q-file
      v-model="model"
      clearable
      counter
      :max-file-size="1024 * 1024 * 1"
      @rejected="onRejected"
      label="Файл xls"
    /> -->
    <div class="column flex flex-center">
      <div class="row" style="align-items: start">
        <div class="column">
          <q-input
            v-model="setRange"
            bottom-slots
            clearable
            label="Область (A1:D20)"
            style="padding-right: 10px"
          >
            <template v-slot:hint> Или очиститите поле. </template>
          </q-input>
          <q-input
            v-model.number="setSheet"
            type="number"
            label="номер листа c 1"
            style="padding-right: 10px"
          >
          </q-input>
        </div>
        <q-uploader
          :url="getUrl"
          :auto-upload="true"
          @uploaded="uploaded"
          label="Отправить файл"
          color="purple"
          field-name="filexls"
          :form-fields="
            () => [
              { name: 'range', value: setRange },
              { name: 'setSheet', value: setSheet - 1 },
            ]
          "
          square
          flat
          bordered
          style="max-width: 300px"
        />
      </div>
      <br />
      <q-table
        style="min-width: 600px; max-width: 1024px"
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
    </div>
  </q-page>
</template>

<script>
// application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageTabUsers",
  components: {},
  setup() {
    const $q = useQuasar();
    const msg = ref("я");
    const model = ref(null);
    let rows = ref([]);
    return {
      msg,
      model,
      filter: ref(""),
      setRange: ref("A1:B5"),
      setSheet: ref(1),
      pagination: ref({
        rowsPerPage: 10,
      }),
      rows,
      getUrl(files) {
        return "/api/xlsupload"; //`http://localhost:4444/upload?count=${files.length}`;
      },
      onRejected(rejectedEntries) {
        // Notify plugin needs to be installed
        // https://quasar.dev/quasar-plugins/notify#Installation
        $q.notify({
          type: "negative",
          message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
        });
      },
      checkFileType(files) {
        // :filter="checkFileType"
        return true; //files.filter((file) => file.type === "application/vnd.ms-excel");
      },
      uploaded(info) {
        let datacsv = JSON.parse(info.xhr.response);
        //  console.log("upload file", datacsv?.dataCsv);
        // if (info?.files?.length > 0) {
        // let datacsv = info.xhr.response;
        //    console.log("end upload files", datacsv?.dataCsv);

        if (datacsv?.error) {
          console.log("error xls", datacsv.error);
          $q.notify({
            type: "negative",
            message: datacsv.error,
          });
        }

        rows.value = datacsv?.dataCsv;
        //} else {
        //  console.log("end upload files", "НЕ было файла ,,??");
        // }
      },
    };
  },
});
</script>
