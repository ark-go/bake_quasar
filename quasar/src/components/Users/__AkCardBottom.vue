<template>
  <slot v-if="buttonArrProp" name="buttons">
    <q-btn
      disable
      flat
      :key="item.key"
      v-for="item in buttonArrProp"
      @click="emit('buttonClick', item.key)"
    >
      {{ item.name }}
    </q-btn>
    <!-- <q-btn flat @click="clickNewRecept">Создать</q-btn>
        <q-btn flat @click="emit('closeModal')">Отмена</q-btn> -->
  </slot>
</template>
