<template>
  <q-item clickable v-ripple @click="$emit('onClick')">
    <!-- <q-item-section avatar>
      <q-avatar color="primary" text-color="white"> П </q-avatar>
    </q-item-section> -->
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ subtitle }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    title: String,
    subtitle: String,
  },
};
</script>
