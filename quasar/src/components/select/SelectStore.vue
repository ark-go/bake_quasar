<template>
  <div class="row">
    <q-input
      v-model="dateValue"
      :dense="dense"
      readonly
      style="width: 100%"
      :label="label"
    >
      <template v-slot:append>
        <q-icon name="shopping_cart" class="cursor-pointer">
          <q-popup-proxy
            :ref="(el) => (refPopup = el)"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <store
              @dbl-click="dblClick"
              v-model:vidColumns="vidColumns"
              requiredColumn="city"
            ></store>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import { ref } from "vue";
import Store from "components/Store.vue";
export default {
  props: ["label", "dense"],
  components: {
    Store,
  },
  setup() {
    const dateValue = ref();
    const refPopup = ref();
    const vidColumns = ref();
    function dblClick(val) {
      console.log("Выбран магазин:", val.city + "/" + val.street);
      dateValue.value = val.city + "/" + val.street;
      refPopup.value.hide();
    }
    return {
      dateValue,
      dblClick,
      refPopup,
      vidColumns,
      // Store,
    };
  },
};
</script>
