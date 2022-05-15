<template>
  <q-pdfviewer
    v-model="show"
    type="html5"
    :src="pdfurl"
    content-class="absolute"
  />
</template>
<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
//import pdfviewer from "@quasar/quasar-app-extension-qpdfviewer";
export default defineComponent({
  name: "PagePdf",
  props: {
    key1: [String, Object],
    command: String,
  },
  components: {
    //   pdfviewer,
  },
  setup(props) {
    const show = ref(true);
    const pdfurl = ref("");
    const route = useRoute();
    // const updatedSrc = ref("/console.pdf");
    onMounted(() => {
      console.log("pdfpfdpffpdp", route.params);
      pdfurl.value = `/api/pdfget?key=${route.params.key1}&tabname=${route.params.command}`;
    });
    return { show, pdfurl };
    //'/api/pdfget?key=' + key + '&tabname=' + command
  },
});
</script>
