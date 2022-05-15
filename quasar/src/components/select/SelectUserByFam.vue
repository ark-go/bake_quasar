<template>
  <div class="">
    <div class="row">
      <q-select
        :ref="(el) => (selectRef = el)"
        dense
        v-model="computedModelValue"
        use-input
        input-debounce="0"
        label="Управляющий"
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
  name: "SelectUserByFam",
  props: ["name", "modelValue"],
  setup(props, { attrs, slots, emit, expose }) {
    // const options = ref(stringOptions);
    const options = ref([]);
    const selectRef = ref("");
    const stringOptions = ref([]);
    const model = ref(null);
    const optLabel = ref("");
    //const dataSelect = ref([]);
    // - - - - -- - - - - - - - - - - - - -- - -
    const computedModelValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit("update:modelValue", val);
      },
    });
    // - -- - - - - - -- - - -
    const load = async () => {
      let res = await loadData();
      if (!res?.error) {
        stringOptions.value = res.data;

        // model.value = { value: "3", label: " moderator@moderator.tsg" };
        //  options.value = res.data;
      } else {
        console.log(res.error);
      }
    };
    onMounted(load);
    const getUserProps = async () => {
      model.value = props.name;
      //model.value = { value: "30" };
      console.log("update props getUserProps:", props.name);
      if (selectRef.value) {
        // selectRef.value.showPopup();
        // selectRef.value.filter("eee");
        // selectRef.value.setOptionIndex(1);
      }
    };
    watch(props, getUserProps);
    onMounted(getUserProps);
    //------------- -------
    // function filterFnAutoselect(val, update, abort) {
    //   // call abort() at any time if you can't retrieve data somehow

    //   setTimeout(() => {
    //     update(
    //       () => {
    //         if (val === "") {
    //           options.value = stringOptions;
    //         } else {
    //           const needle = val.toLowerCase();
    //           options.value = stringOptions.value.filter(
    //             (v) => v.toLowerCase().indexOf(needle) > -1
    //           );
    //         }
    //       },

    //       // "ref" is the Vue reference to the QSelect
    //       (ref) => {
    //         if (
    //           val !== "" &&
    //           ref.options.length > 0 &&
    //           ref.optionIndex === -1
    //         ) {
    //           ref.moveOptionSelection(1, true); // сфокусируйте первый выбираемый параметр и не обновляйте входное значение
    //           ref.toggleOption(ref.options[ref.optionIndex], true); // переключить сфокусированный вариант
    //         }
    //       }
    //     );
    //   }, 3000);
    // }
    // ----------- --------
    return {
      // filterFnAutoselect,
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
          //   let origin = toRaw(stringOptions.value);
          //   options.value = origin.filter((val) => {
          //     return val.label.toLowerCase().indexOf(needle) > -1;
          //   });

          //   let resFilter = Object.fromEntries(
          //     Object.entries(mm).filter(([key, value]) => {
          //       return value.label.toLowerCase().indexOf(needle) > -1;
          //     })
          //   );
          //   resFilter = Object.entries(resFilter).map(([k, v]) => v);
        });
      },
    };
  },
};
async function loadData() {
  try {
    let resp = await axios.post("/api/groupUserForSelect", {});
    let data = resp.data;
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "groupUserForSelect: Ошибка чтения данных (groupUserForSelect)",
    };
  }
}
</script>
