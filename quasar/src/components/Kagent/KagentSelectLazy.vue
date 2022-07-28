<template>
  <div class="">
    <div class="row">
      <q-select
        :ref="(el) => (selectRef = el)"
        dense
        v-model="computedModel"
        use-input
        input-debounce="0"
        :label="title"
        :option-label="optionsLabel"
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
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
export default {
  name: "KagentSelectLazy",
  props: {
    hiddenDropdown: Boolean,
    // название таблицы
    spravName: String,
    // текущий id справочника
    currentId: [String, Number],
    // Название поля
    title: String,

    // что считать нужной строкой в объекте
    optionsLabel: {
      type: String,
      default: "name",
    },
  },
  emits: ["update:currentId"],
  setup(props, { attrs, slots, emit, expose }) {
    const arkUtils = useArkUtils();
    const selectRef = ref({});
    const options = ref(null);
    const optionsBuff = ref(null);
    const nameLabel = ref("");
    const allArray = ref({});
    const hideDrop = ref(false);
    const computedModel = computed({
      get: () => optionsBuff.value?.find((x) => x.id == props.currentId), // отдаем объкект
      set: (val) => {
        emit("update:currentId", val?.id); // отдаем ID  или  undefined??,
      },
    });
    const getProps = async () => {
      hideDrop.value = props.hiddenDropdown;
      nameLabel.value = allArray.value?.nameLabel;
      options.value = optionsBuff.value;
      console.log("current id", props.currentId);
    };
    onMounted(async () => {
      optionsBuff.value = await spravLoad();

      getProps();
    });
    watch(props, getProps);

    async function spravLoad() {
      let dat = { tableNameLoad: props.spravName };
      let res = await arkUtils.dataLoad(
        "/api/spravLoad",
        dat,
        `список ${props.spravName}`
      );
      console.log("++++++++++++++++Ю+", res.result);
      if (res.result) {
        return res.result;
      } else {
        return null;
      }
    }
    // ------------------------  автоподстановка  оно переоткрывает список----------------------------------
    function filterFn(val, update, abort) {
      if (options.value == null) return;
      // call abort() at any time if you can't retrieve data somehow
      if (hideDrop.value) {
        abort();
        return;
      }
      //  setTimeout(() => {
      update(
        () => {
          if (val === "") {
            options.value = optionsBuff.value;
          } else {
            const needle = val.toLowerCase();
            options.value = options.value.filter(
              (v) => v[props.optionsLabel].toLowerCase().indexOf(needle) > -1
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
      spravLoad,
      hideDrop,
      selectRef,
      options,
      optionsBuff,
      filterFn,
      nameLabel,
      computedModel,
      newValue(val, done) {
        console.log("new:", val);
        if (hideDrop.value) {
          done({ value: null, name: val });
        } else {
          // можем здесь создать новый элемент
          //done({ value: 0, label: val }, "add-unique");
          done();
          // computedModel.value = { value: 0, label: "" };
          // computedModel.value = null;
        }
      },
      checkNew() {
        //.. console.log("это пришло", computedModel.value);
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
