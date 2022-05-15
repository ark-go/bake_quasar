//import { arkVuex } from "src/utils/arkVuex.js";
import { dataLoad } from "src/utils/ark.js";
import { Notify } from "quasar";
//import { createRouter, useRoute } from "vue-router";

// import { getPDF } from "src/utils/getPDF.js";
export async function getPDF(command, pdfOpts) {
  //  const router = createRouter({});
  // const $q = useQuasar();
  console.log("PDF:", command, pdfOpts);

  console.log("нажалcя", command);
  if (command) {
    let res = await dataLoad(
      "/api/pdfmain",
      //pdfOpts,
      { pdfOpts: { ...{ tabname: command }, ...pdfOpts } },
      "Запрос разрешения PDF"
    );
    if (!res.result) {
      return;
    }
    console.log("PDF=" + res.result);
    let url =
      // "/api/pdfget?key=" + res.result + "&tabname=" + currentTabname.value;
      "/api/pdfget?key=" + res.result + "&tabname=" + command;
    // router.push({ name: "pdf", params: { url: url } });
    Notify.create({
      color: "silver",
      textColor: "white",
      icon: "thumb_up",
      message: "Открыть PDF ?",
      caption: "откроется в новом окне",
      position: "center",
      // avatar,
      multiLine: true,
      timeout: 0,
      actions: [
        {
          label: "Открыть",
          color: "green",
          handler: () => {
            console.log("Запрос: " + url);
            window.open(url, "_blank");
            //router.push({ name: "pdf", params: { url: url } });
          },
        },
        {
          label: "Не хочу",
          color: "yellow",
          handler: () => {
            /* console.log('wooow') */
          },
        },
      ],
    });
    return { key: res.result, command: command };
  }
}
