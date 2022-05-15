<template>
  <div class="">
    <div class="row">
      <q-select
        :ref="(el) => (selectRef = el)"
        dense
        v-model="computedModelValue"
        use-input
        input-debounce="0"
        label="Выберите справочник"
        :options="options"
        @filter="filterFn"
        style="width: 250px"
        :hint="JSON.stringify(model)"
        options-dense
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
import { ref, unref, toRaw, reactive, computed, onMounted, watch } from "vue";
import { axios } from "boot/axios";

export default {
  name: "SelectCatalog",
  props: ["name", "modelValue"],
  setup(props, { attrs, slots, emit, expose }) {
    // const options = ref(stringOptions);
    const options = ref([]);
    const selectRef = ref("");
    const stringOptions = ref([]);
    const model = ref(null);
    const optLabel = ref("");
    const isRaw = ref(false);
    const isRecept = ref(false);

    //const dataSelect = ref([]);
    // - - - - -- - - - - - - - - - - - - -- - -
    const ModelValue = ref();
    // function computedModelValue(val) {
    //   console.log("Выбрал ", val);
    //   // getCatalog(val);
    // }
    watch(isRaw, () => {
      computedModelValue.value.isRaw = isRaw.value;
    });
    watch(isRecept, () => {
      computedModelValue.value.isRecept = isRecept.value;
    });
    const computedModelValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit("update:modelValue", val);
        //  getCatalog(val);
      },
    });
    // - -- - - - - - -- - - -
    const load = async () => {
      let res = await loadData();
      if (!res?.error) {
        stringOptions.value = res.result;
        // model.value = { value: "3", label: " moderator@moderator.tsg" };
      } else {
        console.log(res.error);
      }
    };
    onMounted(load);
    const getUserProps = async () => {
      model.value = props.name;
      if (selectRef.value) {
      }
    };
    watch(props, getUserProps);

    onMounted(getUserProps);
    // function getCatalog(val) {
    //   catalogLoad(val.value, true);
    //   console.log("Выбор:", val, val.value);
    // }
    //------------- -------
    return {
      isRaw,
      isRecept,
      ModelValue,
      computedModelValue,
      selectRef,
      model,
      options,
      optLabel,
      filterFn(val, update) {
        console.log("filters-1", val, stringOptions.value);
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
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        });
      },
    };
  },
};
async function loadData() {
  try {
    let resp = await axios.post("/api/catalogsLoad", {});
    console.log("Catalogs Select4", resp.data);
    let data = resp.data;
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "SelectCatalog: Ошибка чтения данных (catalogsLoad)",
    };
  }
}
// async function catalogLoad(name, isHistory) {
//   try {
//     let resp = await axios.post("/api/catalogLoad", {
//       name: name,
//       isHistory: isHistory,
//     });
//     let data = resp.data;
//     console.log("catalogLoad-0", data);
//     return data;
//   } catch (err) {
//     console.log(err);
//     return {
//       error: "SelectCatalog: Ошибка чтения данных (catalogLoad)",
//     };
//   }
// }
</script>
