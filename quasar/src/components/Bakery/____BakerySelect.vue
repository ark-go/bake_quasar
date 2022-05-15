<template>
  <div class="">
    <div class="row">
      <q-select
        :ref="(el) => (selectRef = el)"
        dense
        v-model="computedModel"
        use-input
        input-debounce="0"
        :label="nameLabel"
        :option-label="optLabel ? optLabel : null"
        :options="hideDrop ? null : options"
        @filter="filterFn"
        style="width: 250px"
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
    </div>
  </div>
</template>
<script>
// :hint="computedModel ? JSON.stringify(computedModel) : ''"
//fill-input
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
  name: "BakerySelect",
  props: {
    currentId: [String, Number],

    allData: {
      type: Array,
      default() {
        return null;
      },
    },
    modelValue: Object,
    hiddenDropdown: Boolean,
  },
  setup(props, { attrs, slots, emit, expose }) {
    const selectRef = ref({});
    const options = ref(null);
    const optLabel = ref(null);
    const nameLabel = ref("");
    const allArray = ref({});
    const hideDrop = ref(false);
    const computedModel = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit("update:modelValue", val);
      },
    });
    const getProps = async () => {
      hideDrop.value = props.hiddenDropdown;
      // console.log("hideDrop:", hideDrop);
      allArray.value = props.allData;
      options.value = allArray.value?.options;
      optLabel.value = allArray.value?.optLabel;
      nameLabel.value = allArray.value?.nameLabel;
      // console.log("update props getProps:", props.allData);
      if (selectRef.value) {
        // selectRef.value.focus();  //rab
      }
    };
    onMounted(getProps);
    watch(props, getProps);

    // ------------------------  автоподстановка  оно переоткрывает список----------------------------------
    function filterFn(val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      if (hideDrop.value) {
        abort();
        return;
      }
      //  setTimeout(() => {
      update(
        () => {
          if (val === "") {
            options.value = allArray.value.options;
          } else {
            const needle = val.toLowerCase();
            options.value = allArray.value.options.filter(
              (v) =>
                v[allArray.value.optLabel].toLowerCase().indexOf(needle) > -1
            );
          }
        },

        //"ref" is the Vue reference to the QSelect
        (ref) => {
          if (val !== "" && ref.options.length > 0) {
            ref.setOptionIndex(-1); // Сбросить optionIndex, если что-то выбрано
            ref.moveOptionSelection(1, true); // Сфокусируйте первый выбираемый параметр и не обновляйте входное значение
          }
        }
      );
      //  }, 200);
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
          //done({ value: 0, label: val }, "add-unique");
          done();
          // computedModel.value = { value: 0, label: "" };
          // computedModel.value = null;
        }
      },
      checkNew() {
        console.log("это пришло", computedModel.value);
        // if (!computedModel.value) {
        //   computedModel.value = { value: 0, label: "" };
        //   return;
        // }
        // const needle = computedModel.value.label.toLowerCase();
        // let resFind = allArray.value.options.filter(
        //   (v) => v.label.toLowerCase().indexOf(needle) > -1
        // );
        // if (resFind.length > 0) return;
        // else computedModel.value = null;
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
