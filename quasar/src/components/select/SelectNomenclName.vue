<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        v-model="model"
        use-input
        input-debounce="0"
        label="Тестируем фильтр"
        :options="options"
        @filter="filterFn"
        style="width: 200px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Не найдено </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { axios } from "boot/axios";
// const stringOptions = [
//   "Google",
//   "Facebook",
//   "Twitter",
//   "Facebook",
//   "Twitter",
//   "Apple",
//   "Oracle",
// ];

export default {
  props: ["name"],
  setup(props) {
    // const options = ref(stringOptions);
    const options = ref([]);
    const stringOptions = ref([]);
    const model = ref(null);
    //const dataSelect = ref([]);
    const load = async () => {
      let res = await loadData();
      if (!res?.error) {
        stringOptions.value = res.data;
        //  options.value = res.data;
      } else {
        console.log(res.error);
      }
    };
    onMounted(load);
    const getUserProps = async () => {
      model.value = props.name;
      console.log("update props getUserProps:", props.name);
    };
    watch(props, getUserProps);
    onMounted(getUserProps);
    return {
      model,
      options,

      filterFn(val, update) {
        if (val === "") {
          update(() => {
            options.value = stringOptions.value;

            // here you have access to "ref" which
            // is the Vue reference of the QSelect
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          options.value = stringOptions.value.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      },
    };
  },
};
async function loadData() {
  try {
    let resp = await axios.post("/api/groupNomenclName", {});
    let data = resp.data;
    // ! убрать !!
    let resp1 = await axios.post("/api/selectPartners", {});
    console.log(resp1);
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "groupNomenclName: Ошибка чтения данных (groupNomenclName)",
    };
  }
}
</script>
