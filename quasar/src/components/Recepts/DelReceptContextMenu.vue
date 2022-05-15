<template>
  <q-td :props="dataslot">
    {{ dataslot.value }}
    <q-menu context-menu>
      <q-list style="min-width: 100px">
        <div class="labelContextMenu">
          {{ dataslot.row.nameingredient }}
        </div>
        <q-separator />
        <q-item
          clickable
          v-close-popup
          @click="emit('editFromRecept', dataslot.row)"
        >
          <q-item-section>Изменить</q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="emit('delFromRecept', dataslot.row)"
        >
          <q-item-section>Удалить из рецепта</q-item-section>
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
