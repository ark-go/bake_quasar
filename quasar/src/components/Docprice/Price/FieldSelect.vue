<style lang="scss" scoped>
.ark-select {
  color: red;
}
</style>
<template>
  <q-select
    :ref="(el) => (selectRef = el)"
    v-show="isShow"
    dense
    v-model="computedModel"
    input-debounce="0"
    :label="label"
    option-label="name"
    :options="spravFilter"
    @filter="filterFn"
    options-dense
    hide-dropdown-icon
    @new-value="newValue"
    @blur="checkNew"
    transition-show="slide-up"
    transition-hide="slide-down"
    :clearable="clearable"
    :use-input="false"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> Не найдено </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script>
import { ref, computed, onMounted, watch, watchEffect } from "vue";
export default {
  name: "SelectIdName",
  props: {
    hiddenDropdown: Boolean,
    sprav: Object,
    selectId: [Number, String],
    clearable: Boolean,
    label: String,
    filter: Object, // фильтруем список по boolean полю
    showClear: {
      default: undefined, // зависимость от.. undefined необходим определить задавалось вообще или нет
    }, // ЗАвисимотсть от этого, true/false
  },
  emits: ["update:selectId"],
  setup(props, { attrs, slots, emit, expose }) {
    const selectRef = ref({});
    const options = ref(null);
    const optLabel = ref(null);
    const nameLabel = ref("");
    const spravFilter = ref({});
    const isShow = ref(true);
    // Проверим зависимость если существует параметр, то в зависимости от true/false
    // будем показывать наше поле или скрывать, и обнулять его, т.е. selectId
    if (typeof props.showClear !== "undefined") {
      // указан был пропс т.е. он был какой-то пока непроверяем
      watchEffect(() => {
        // необходимо, чтоб сразу определить, значение, и отлавливать его
        // при внешнем изменении зависимости.
        // показываем или не показываем поле
        isShow.value = props.showClear;
        if (props.showClear === false) {
          // если не показываем поле, то и стираем его не null
          emit("update:selectId", null);
        }
      });
    }
    //const allArray = ref({});
    const computedModel = computed({
      get: () => {
        return props.sprav?.find((x) => x.id == props.selectId);
      },
      set: (val) => {
        emit("update:selectId", val?.id);
      },
    });
    /**  проверим есть ли фильтр  и отфильтруем справочник по нему */
    function setfilter() {
      if (props.filter?.key && props.filter?.val) {
        spravFilter.value = props.sprav.filter(
          (v) => v[props.filter.key] == props.filter.val
        );
      } else {
        spravFilter.value = props.sprav;
      }
    }
    watch(
      () => props.sprav,
      () => {
        setfilter();
      }
    );
    onMounted(() => {
      setfilter();
    });
    // watch(props, getProps);

    // ------------------------  автоподстановка  оно переоткрывает список----------------------------------
    function filterFn(val, update, abort) {
      abort(); // не используется в это элементе
      // call abort() at any time if you can't retrieve data somehow
      //  setTimeout(() => {
      update(
        () => {},
        //"ref" is the Vue reference to the QSelect
        (ref) => {
          const needle = val.toLowerCase();
          let i = props.sprav.some((v, i, x) => {
            if (v["name"].toLowerCase().indexOf(needle) > -1) {
              ref.setOptionIndex(i);
              // ref.moveOptionSelection(i, true);
              return i;
            }
          });
        }
      );
      //  }, 200);
    }
    // --------------------------    ^^^^^^  ---------------------------------
    return {
      isShow,
      selectRef,
      spravFilter,
      options,
      optLabel,
      filterFn,
      nameLabel,
      computedModel,
      newValue(val, done) {
        console.log("new:", val);
        done();
      },
      checkNew() {
        console.log("это checkNew", computedModel.value);
      },
    };
  },
};
</script>
