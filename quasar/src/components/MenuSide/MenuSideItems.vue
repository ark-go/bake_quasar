<template>
  <q-item v-if="visible" clickable @click="onClick(link)">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
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
