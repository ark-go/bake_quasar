<template>
  <q-expansion-item
    expand-separator
    icon="perm_identity"
    label="Настрока"
    caption="Текущая страница"
  >
    <q-item>
      <q-item-section side>
        <q-icon color="primary" name="swap_horiz" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Ширина</q-item-label>
        <q-item-section>
          <q-slider
            v-model="cardMain.width.curr"
            :min="cardMain.width.min"
            :max="cardMain.width.max"
          />
        </q-item-section>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section side>
        <q-icon color="primary" name="swap_vert" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Количество строк</q-item-label>
        <q-item-section>
          <q-slider
            v-model="cardMain.rowsPerPage.curr"
            :min="cardMain.rowsPerPage.min"
            :max="cardMain.rowsPerPage.max"
            label
          />
        </q-item-section>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <div class="flex justify-center">
          <q-btn flat rounded="" color="green-8" label="Сохранить" />
          <q-btn
            flat
            rounded=""
            color="red-3"
            label="Сброс"
            @click="resetPage"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-expansion-item>
</template>

<script>
import { defineComponent, nextTick, ref } from "vue";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";

export default defineComponent({
  name: "setupCurrentPage",
  setup() {
    const { cardMain } = storeToRefs(usePagesSetupStore()); // только реактивные
    const { resetPageSetup } = usePagesSetupStore(); // для НЕ реактивных
    function resetPage() {
      resetPageSetup();
    }
    return { cardMain, resetPage };
  },
});
</script>
