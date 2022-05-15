<template>
  <q-td :props="propsV">
    {{ propsV.value }}
    <!-- <q-menu context-menu>
      <q-list style="min-width: 100px">
        <div style="text-align: center; background-color: silver">
          {{ propsV.row.nomencl_name }}
        </div>
        <q-item clickable v-close-popup @click="clickMenuEdit(propsV.row)">
          <q-item-section>Изменить</q-item-section>
        </q-item>
        <q-item
          v-if="propsV.row.recept_check == 'есть'"
          clickable
          v-close-popup
          @click="clickRecepts(propsV.row)"
        >
          <q-item-section>Рецепты</q-item-section>
        </q-item>
        <q-item
          v-if="
            !(propsV.row.recept_check == 'есть') &&
            propsV.row.vidnomencl_meta.isRecept
          "
          clickable
          v-close-popup
          @click="emit('newRecept', propsV.row)"
        >
          <q-item-section>Создать рецепт</q-item-section>
        </q-item>
        <q-separator />
      </q-list>
    </q-menu> -->
  </q-td>
</template>

<script>
export default {
  name: "TableCell",
  props: ["propsV"],
  setup() {},
};
</script>
