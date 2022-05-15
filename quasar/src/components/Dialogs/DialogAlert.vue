<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="show">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <span v-html="messageAlert"></span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    title: {
      type: String,
      default: "Внимание",
    },
    message: {
      type: String,
      default: " - - - - - ",
    },
  },
  //   props: {
  //     show: String, // раньше было `value: String`
  //   },
  //emits: ["update:show"],
  setup(props, { emit }) {
    const show = ref(false);
    const messageAlert = ref("");
    watch(props, () => {
      if (props.message) {
        messageAlert.value = props.message;
        show.value = true;
        console.log("Есть алерт", props.message);
      }
    });
    watch(show, () => {
      if (show.value == false) {
        emit("update:message", "");
      }
    });
    return {
      show,
      messageAlert,
    };
  },
};
</script>
