<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <sprav></sprav>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Sprav from "components/Sprav/Sprav.vue";

export default defineComponent({
  name: "PageSprav",
  components: {
    Sprav,
  },
});
</script>
