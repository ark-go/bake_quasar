<template>
  <q-page class="flex flex-center" style="min-width: 160px">
    <nomenclature
      v-if="!editReceptShow"
      @edit-recept="editRecept"
      @show-recepts="showRecepts"
      @new-recept="newRecept"
    ></nomenclature>
    <recepts
      v-if="editReceptShow"
      :dataRec="dataRec"
      :action="receptAction"
      @add-recept="addRecept"
      @close="close"
      @close-back="closeBack"
    ></recepts>
  </q-page>
  <teleport to="body">
    <div
      v-show="newReceptModal"
      @click.self="newReceptModal = false"
      class="modal1 flex flex-center ark-popup shadow-6"
    >
      <div class="ark-popup-body">
        <new-recept-modal
          :row="newReceptProps"
          @edit-recept="editRecept"
          @close-modal="newReceptModal = false"
        >
        </new-recept-modal>
      </div>
    </div>
  </teleport>
</template>

<script>
import { defineComponent, ref, nextTick } from "vue";
import Nomenclature from "components/Nomenclature.vue";
import Recepts from "components/Recepts/Recepts.vue";
import NewReceptModal from "components/NewReceptModal.vue";
import { emitter } from "boot/axios.js";

export default defineComponent({
  name: "PageNomenclature",
  components: {
    Nomenclature,
    Recepts,
    NewReceptModal,
  },
  setup(props, { emit }) {
    const editReceptShow = ref(false);
    const dataRec = ref({});
    const receptAction = ref("");
    const newReceptModal = ref(false);
    const newReceptProps = ref({});
    function editRecept(val) {
      newReceptModal.value = false;
      receptAction.value = "editRecept";
      console.log("editRecept:", val);
      dataRec.value = val;
      editReceptShow.value = true;
    }
    function showRecepts(val) {
      // val строка из номенклатуры
      receptAction.value = "showRecepts";
      dataRec.value = val;
      editReceptShow.value = true;
    }
    function close(val) {
      // val - то с чем открывали новый рецепт
      editReceptShow.value = false;
    }
    function closeBack(val) {
      // val - то с чем открывали
      console.log("closeBack", val);
      //dataRec.value = val;
      receptAction.value = "showRecepts";
      editReceptShow.value = false;
      // await nextTick()
      nextTick(() => (editReceptShow.value = true));
    }
    emitter.on("addRecept", (val) => {
      // val - полная строка из номенклатуры
      console.log("готов к новому рецепту", val.value);
      newRecept(val.value);
    });
    function newRecept(val) {
      newReceptProps.value = val;
      console.log("newRecept", newReceptProps.value);
      newReceptModal.value = true;
    }
    return {
      emit,
      close,
      closeBack,
      dataRec,
      editReceptShow,
      editRecept,
      showRecepts,
      receptAction,
      newReceptModal,
      newReceptProps,
      newRecept,
      addRecept() {
        console.log("addRecept//");
      },
    };
  },
});
</script>
<style lang="scss" scoped>
.modal1 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
}

.ark-popup-body {
  background-color: white;
}
.ark-popup {
  background-color: rgba(123, 123, 124, 0.5);
}
</style>
