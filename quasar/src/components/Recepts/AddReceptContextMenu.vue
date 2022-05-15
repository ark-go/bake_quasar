<template>
  <q-td :props="dataslot">
    {{ dataslot.value }}
    <q-menu context-menu>
      <q-list style="min-width: 100px">
        <div class="labelContextMenu">
          {{ dataslot.row.recept_name }}
        </div>
        <q-separator />
        <q-item clickable v-close-popup @click="emit('addToRecept', dataslot)">
          <q-item-section>Добавить в рецепт</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-td>
</template>

<script>
import { ref } from "vue";
export default {
  props: ["dataslot"],
  setup(props, { emit }) {
    return {
      emit,
    };
  },
};
</script>
