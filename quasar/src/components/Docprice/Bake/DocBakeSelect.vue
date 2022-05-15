<template>
  <q-item @click="$emit('onClick')">
    <q-item-section>
      <q-item-label overline>{{ title }}</q-item-label>
      <q-item-label>
        <field-select
          :sprav="sprav"
          @update:selectId="(val) => $emit('update:selectId', val)"
          :selectId="selectId"
          :readonly="readonly"
        ></field-select>
      </q-item-label>
      <q-item-label caption v-for="(item, index) in subtitle" :key="index">
        {{ item }}
      </q-item-label>
      <transition appear name="comp-fade" mode="out-in">
        <q-btn
          v-if="readonly"
          dense
          flat
          color="primary"
          @click="$emit('deleteBake')"
          label="Удалить"
        ></q-btn>
        <q-btn
          v-else
          dense
          flat
          color="primary"
          @click="$emit('addBake')"
          label="Добавить"
        ></q-btn>
      </transition>
    </q-item-section>
  </q-item>
</template>

<script>
import FieldSelect from "./FieldSelect.vue";
import { ref } from "vue";
export default {
  name: "DocBakeSelect",
  props: {
    title: String,
    subtitle: Array,
    sprav: Array,
    selectId: [Number, String],
    readonly: Boolean,
  },
  emits: ["update:selectId", "addBake"],
  components: { FieldSelect },
  // setup(props, { emit }) {
  //   const selectId = ref(0);
  //   return { selectId };
  // },
};
</script>
<style lang="scss" scoped>
.comp-fade-enter-active,
.comp-fade-leave-active {
  transition: opacity 0.3s ease;
}

.comp-fade-enter-from,
.comp-fade-leave-to {
  opacity: 0;
}
</style>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
