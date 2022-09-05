<template>
  <q-select
    :ref="(el) => (selectRef = el)"
    dense
    v-model="computedModel"
    use-input
    input-debounce="0"
    label="Регион"
    option-label="name"
    :options="options"
    @filter="filterFn"
    options-dense
    :hide-dropdown-icon="hideDrop"
    @new-value="newValue"
    @blur="checkNew"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> Не найдено </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script>
import {
  ref,
  unref,
  toRaw,
  reactive,
  computed,
  onMounted,
  watch,
  watchEffect,
} from "vue";
import { axios } from "boot/axios";
export default {
  name: "CitySelect",
  props: {
    allData: {
      type: Array,
      default() {
        return null;
      },
    },
    modelValue: Object,
    hiddenDropdown: Boolean,
    sprav: Object,
    selectId: [Number, String],
  },
  emits: ["update:selectId"],
  setup(props, { attrs, slots, emit, expose }) {
    const selectRef = ref({});
    const options = ref(null);
    const optLabel = ref(null);
    const nameLabel = ref("");
    //const allArray = ref({});
    const hideDrop = ref(false);
    const computedModel = computed({
      get: () => {
        return props.sprav.find((x) => x.id == props.selectId);
      },
      set: (val) => {
        emit("update:selectId", val?.id);
      },
    });
    const getProps = async () => {
      hideDrop.value = props.hiddenDropdown;
      if (selectRef.value) {
        // selectRef.value.focus();  //rab
      }
    };
    onMounted(getProps);
    watch(props, getProps);

    // ------------------------  автоподстановка  оно переоткрывает список----------------------------------
    // function filterFn(val, update, abort) {
    //   // call abort() at any time if you can't retrieve data somehow
    //   if (hideDrop.value) {
    //     abort();
    //     return;
    //   }
    //   //  setTimeout(() => {
    //   update(
    //     () => {
    //       if (val === "") {
    //         options.value = props.sprav;
    //       } else {
    //         const needle = val.toLowerCase();
    //         options.value = props.sprav.filter(
    //           (v) => v["name"].toLowerCase().indexOf(needle) > -1
    //         );
    //       }
    //     },

    //     //"ref" is the Vue reference to the QSelect
    //     (ref) => {
    //       if (val !== "" && ref.options.length > 0) {
    //         ref.setOptionIndex(-1); // Сбросить optionIndex, если что-то выбрано
    //         ref.moveOptionSelection(1, true); // Сфокусируйте первый выбираемый параметр и не обновляйте входное значение
    //       }
    //     }
    //   );
    //   //  }, 200);
    // }
    function filterFn(val, update, abort) {
      if (val === "") {
        update(() => {
          options.value = props.sprav;
        });
        return;
      }
      update(
        () => {
          const needle = val.toLowerCase();
          // console.log(">>>>", needle, props.sprav);
          options.value = props.sprav.filter(
            (v) => v["name"].toLowerCase().indexOf(needle) > -1
          );
          console.log(">>>>", needle, options.value);
        },
        (ref) => {
          if (val !== "" && ref.options.length > 0) {
            ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
            ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
          }
        }
      );
    }
    // --------------------------    ^^^^^^  ---------------------------------
    return {
      hideDrop,
      selectRef,
      options,
      optLabel,
      filterFn,
      nameLabel,
      computedModel,
      newValue(val, done) {
        console.log("new:", val);
        if (hideDrop.value) {
          done({ value: null, name: val });
        } else {
          done();
        }
      },
      checkNew() {
        console.log("это пришло", computedModel.value);
      },
    };
  },
};
/*
//! автоматичеси подставит то что выбралось фильтром
filterFn (val, update, abort) {
        // call abort() at any time if you can't retrieve data somehow

        setTimeout(() => {
          update(
            () => {
              if (val === '') {
                options.value = stringOptions
              }
              else {
                const needle = val.toLowerCase()
                options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
              }
            },

            // "ref" is the Vue reference to the QSelect
            ref => {
              if (val !== '' && ref.options.length > 0) {
                ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
                ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
              }
            }
          )
        }, 300)
*/
</script>
