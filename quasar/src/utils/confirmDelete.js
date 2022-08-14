import { sanitizeDef } from "./sanitize.js";
import { useQuasar } from "quasar";
import DialogConfirm from "./DialogConfirm.vue";

export function useConfirmDelete() {
  const $q = useQuasar();
  /**
   * Диалог подтверждения Promise
   */
  function confirmDelete(message, title) {
    return new Promise((resolve, reject) => {
      $q.dialog({
        component: DialogConfirm,
        persistent: true,

        // props forwarded to your custom component
        componentProps: {
          title: sanitizeDef(title) || "Подтверждение",
          message: sanitizeDef(message) || "Укажите сообщение",
          // ...more..props...
        },
      })
        .onOk(() => {
          console.log("OKx");
          resolve(true);
        })
        .onCancel(() => {
          console.log("Cancelx");
          resolve(false);
        })
        .onDismiss(() => {
          console.log("Called on OK or Cancelx");
          resolve(false);
        });
    });
  }
  return { confirmDelete };
}
