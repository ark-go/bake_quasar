<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <transition name="slide-fade">
      <spec-doc-store
        key="1"
        v-if="!isValueTab"
        vidColumns="date_start,doc_number"
        requiredColumn="doc_number"
        @dblClick="dblClickDocument"
      ></spec-doc-store>
      <spec-doc-value-store
        key="2"
        v-else
        :dateMagazin="dateMagazin"
        :idDocument="idDocument"
        @onExit="onExitValue"
      ></spec-doc-value-store>
    </transition>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import SpecDocStore from "components/Spec/SpecDocStore.vue";
import SpecDocValueStore from "components/Spec/SpecDocValueStore.vue";
export default defineComponent({
  name: "PageProdaja",
  components: {
    SpecDocStore,
    SpecDocValueStore,
  },
  setup() {
    const idDocument = ref();
    const isValueTab = ref(false);
    const dateMagazin = ref("");
    function dblClickDocument(val) {
      console.log("Выбран документ", val.id);
      dateMagazin.value = val.date_start + " | " + val.store_name;
      idDocument.value = val.id;
      isValueTab.value = true;
      // val.id
    }
    return {
      dblClickDocument,
      idDocument,
      isValueTab,
      dateMagazin,
      onExitValue() {
        isValueTab.value = false;
      },
    };
  },
});
</script>

<style lang="scss" scoped>
/* Анимации появления и исчезновения могут иметь    */
/* различные продолжительности и функции плавности. */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s; // cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(100px);
}
.slide-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
</style>
