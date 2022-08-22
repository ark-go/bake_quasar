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
    :clearable="clearable"
    :use-input="true"
    :loading="loading"
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
import { usePriceStore } from "src/stores/priceStore";
export default {
  name: "SelectIdName",
  props: {
    hiddenDropdown: Boolean,
    sprav: Object,
    selectId: [Number, String],
    clearable: Boolean,
    label: String,
    filter: Object, // фильтруем список по boolean полю
    loading: Boolean,
    showClear: {
      default: undefined, // зависимость от.. undefined необходим определить задавалось вообще или нет
    }, // ЗАвисимотсть от этого, true/false
  },
  emits: ["update:selectId"],
  setup(props, { attrs, slots, emit, expose }) {
    const priceStore = usePriceStore();
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
      priceStore.watchStore(() => {
        return watchEffect(() => {
          // необходимо, чтоб сразу определить, значение, и отлавливать его
          // при внешнем изменении зависимости.
          // показываем или не показываем поле
          isShow.value = props.showClear;
          if (props.showClear === false) {
            // если не показываем поле, то и стираем его не null
            emit("update:selectId", null);
          }
        });
      });
    }

    //?const allArray = ref({});
    const computedModel = computed({
      get: () => {
        if (Array.isArray(props.sprav)) {
          let resfind = props.sprav.find((x) => x.id == props.selectId);
          // если не нашли то сбросим id если он когдато был установлен
          if (!resfind && props.selectId) emit("update:selectId", null);
          return resfind;
        } else {
          // пришел не массив, сбросим id если он был выбран
          emit("update:selectId", null);
          return [];
        }
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
    priceStore.watchStore(() => {
      return watch(
        () => props.sprav,
        () => {
          setfilter();
        }
      );
    });
    onMounted(() => {
      setfilter();
    });

    // ------------------------  автоподстановка  оно переоткрывает список----------------------------------
    function filterFn(val, update, abort) {
      abort(); // не используется в это элементе
      // call abort() at any time if you can't retrieve data somehow
      //  setTimeout(() => {
      update(
        () => {
          console.log("test test test ", val);
          const needle = val.toLowerCase();
          spravFilter.value = props.sprav.filter(
            (v) => v.name.toLowerCase().indexOf(needle) > -1
          );
        },
        // "ref" is the Vue reference to the QSelect
        (ref) => {
          if (val !== "" && ref.options.length > 0) {
            ref.setOptionIndex(-1); // сбросить optionIndex, если что-то выбрано
            ref.moveOptionSelection(1, true); // сфокусируйте первый выбираемый параметр и не обновляйте входное значение
          }
        }

        //"ref" is the Vue reference to the QSelect// устанавливаем курсор не фильтруя
        // (ref) => {
        //   const needle = val.toLowerCase();
        //   let i = props.sprav.some((v, i, x) => {
        //     if (v["name"].toLowerCase().indexOf(needle) > -1) {
        //       ref.setOptionIndex(i);
        //       // ref.moveOptionSelection(i, true);
        //       return i;
        //     }
        //   });
        // }
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
