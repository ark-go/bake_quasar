<template>
  <q-item-label dense header v-if="header">{{ header }}</q-item-label>
  <q-item dense v-if="visible && !header" clickable @click="onClick(link)">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" color="blue-grey-4" />
    </q-item-section>

    <q-item-section>
      <q-item-label v-html="title"></q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "MenuSideItems",
  props: {
    title: {
      type: String,
      required: true,
    },
    header: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    //>tag="a" :href="link">
    const router = useRouter();
    function onClick(lnk) {
      if (lnk == "api/pdf") {
        window.open(lnk, "_blank");
      } else {
        router.push({ path: lnk });
      }
    }
    return {
      onClick,
    };
  },
});
</script>
