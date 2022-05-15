<template>
  <q-page class="flex flex-center">
    <partners></partners>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Partners from "components/Partners.vue";

export default defineComponent({
  name: "PageTabPartners",
  components: {
    Partners,
  },
});
</script>
