<template>
  <q-select
    dense
    option-label="price_name"
    option-value="productvid_id"
    new-value-mode="add"
    :options="spravFilter"
    v-model="vmodel"
    @filter="filterFn"
    options-dense
    hide-dropdown-icon
    use-chips
    clearable
    clear-icon="close"
  >
    <template v-slot:selected>
      <q-chip
        v-if="tovar_name"
        dense
        square
        color="white"
        text-color="primary"
        class="q-pl-none q-my-none q-mx-none"
      >
        <!-- <q-avatar color="primary" text-color="white" :icon="model.icon" /> -->
        {{ tovar_name }}
      </q-chip>
      <!-- <q-badge v-else color="transparent" text-color="blue">нет</q-badge> -->
    </template>
  </q-select>
</template>
<script>
import { ref, onMounted, watch } from "vue";
import { usePriceStore, storeToRefs } from "src/stores/priceStore";
export default {
  name: "SelectTovar",
  props: {
    tovar_name: {
      type: String,
    },
    sprav: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const priceStore = usePriceStore();
    const vmodel = ref(null);
    const modelStat = ref("");
    const spravFilter = ref({});
    onMounted(() => {
      vmodel.value = props.tovar_name; // при открытиии вписывем что было в таблице
      emit("onMounted");
    });
    priceStore.watchStore(() => {
      return watch(
        () => vmodel.value,
        () => {
          console.log("change str  ", vmodel.value);
          if (typeof vmodel.value === "object") {
            // если из списка
            emit("update:tovar_name", vmodel.value?.price_name || null);
            emit("productvid_id", vmodel.value?.productvid_id || 0);
          } else {
            // если вручную
            emit("update:tovar_name", vmodel.value);
          }
        }
      );
    });
    // function findValue() {
    //   return props.sprav.filter(
    //     (v) => v.price_name.toLowerCase().indexOf(needle) > -1
    //   );
    // }
    function filterFn(val, update, abort) {
      abort(); // не используется в это элементе
      // call abort() at any time if you can't retrieve data somehow
      //  setTimeout(() => {
      update(
        () => {
          console.log("test test test ", val);

          // if(typeof val === "string"){

          // }
          const needle = val.toLowerCase();
          let filt = [];
          //spravFilter.value = props.sprav.filter(
          filt = props.sprav.filter(
            (v) => v.price_name.toLowerCase().indexOf(needle) > -1 // поищем в списке
          );

          // если нет в списке, и это новый элемент
          if (filt.length == 0 && val) {
            let ar = [];
            // удалим из списка наш новый объект, если он там был
            props.sprav.forEach((el) => {
              if (el.id == -1) return;
              ar.push(el);
            });
            let newOb = { id: -1, price_name: val, productvid_id: -1 }; // новый элемент списка
            ar.push(newOb);
            emit("update:sprav", ar); // обновляем список
            filt.push(newOb); // устанавливаем фильтр
          }
          // nextTick(() => {
          spravFilter.value = filt;
          console.log("фильтр", spravFilter.value);
          // });
        },
        // "ref" is the Vue reference to the QSelect
        (ref) => {
          if (val !== "" && ref.options.length > 0) {
            ref.setOptionIndex(-1); // сбросить optionIndex, если что-то выбрано
            ref.moveOptionSelection(1, true); // сфокусируйте первый выбираемый параметр и не обновляйте входное значение
          }
        }
      );
    }

    return { vmodel, modelStat, filterFn, spravFilter };
  },
};
</script>
