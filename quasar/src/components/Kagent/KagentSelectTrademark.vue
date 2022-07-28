<template>
  <div class="">
    <div class="row">
      <q-select
        :ref="(el) => (selectRef = el)"
        dense
        v-model="multiple"
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
        multiple
        @add="addOpt"
        @remove="removeOpt"
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
  name: "KagentSelectTrademark",
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
    const multiple = ref(null);
    function addOpt(val) {
      console.log("Добавили", val.value, val.index, multiple.value);
      addOptions(val.value);
    }
    function removeOpt(val) {
      console.log("Удалили", val.value, val.index);
      removeOptions(val.value);
    }

    const hideDrop = ref(false);
    // const computedModel = computed({
    //   get: () => multiple.value, // отдаем объкект
    //   set: (val) => {
    //    // emit("update:currentId", val?.id); // отдаем ID  или  undefined??,
    //   },
    // });
    const getProps = async () => {
      hideDrop.value = props.hiddenDropdown;
      nameLabel.value = allArray.value?.nameLabel;
      options.value = optionsBuff.value;
      console.log("current id", props.currentId);
    };
    onMounted(async () => {
      optionsBuff.value = await loadOptions();
      multiple.value = [];
      let g = await loadTrademarkKagent();
      if (g)
        g.forEach((el) => {
          let s = optionsBuff.value.find((element) => element.id == el.id); // = trademark.id
          if (s) multiple.value.push(s);
        });

      getProps();
    });
    watch(props, getProps);

    async function loadTrademarkKagent() {
      let dat = { cmd: "loadTrademark", kagent_id: props.currentId };
      let res = await arkUtils.dataLoad(
        "/api/kagent_tm",
        dat,
        `список ${props.title}`
      );
      console.log("++++ loadTrademark", res.result);
      if (res.result) {
        return res.result;
      } else {
        return null;
      }
    }

    async function loadOptions() {
      let dat = { cmd: "load", tabname: "trademark" };
      let res = await arkUtils.dataLoad(
        "/api/trademark",
        dat,
        `список ${props.title}`
      );
      console.log("+++++ loadOptions ", res.result);
      if (res.result) {
        return res.result;
      } else {
        return null;
      }
    }
    async function removeOptions({ id }) {
      let dat = {
        cmd: "delTrademark",
        idKagent: props.currentId,
        idTrademark: id,
      };
      let res = await arkUtils.dataLoad(
        "/api/kagent_tm",
        dat,
        `список ${props.title}`
      );
      console.log("++++++++++++++++Ю+", res.result);

      if (res.result) {
        optionsBuff.value = await loadOptions();
        return res.result;
      } else {
        return null;
      }
    }
    async function addOptions({ id }) {
      let dat = {
        cmd: "addTrademark",
        idKagent: props.currentId,
        idTrademark: id,
      };
      let res = await arkUtils.dataLoad(
        "/api/kagent_tm",
        dat,
        `список ${props.title}`
      );
      console.log("++++++++++++++++Ю+", res.result);
      if (res.result) {
        optionsBuff.value = await loadOptions();
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
      addOpt,
      removeOpt,
      addOptions,
      removeOptions,
      multiple,
      hideDrop,
      selectRef,
      options,
      optionsBuff,
      filterFn,
      nameLabel,
      //      computedModel,
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
