import { selectPartnerGroup } from "./selectPartnerGroup.js";
import { selectPartnerName } from "./selectPartnerName.js";
import { selectPartnerRegistr } from "./selectPartnerRegistr.js";
import { selectPartnerType } from "./selectPartnerType.js";

// export { selectPartnerGroup } from "./selectPartnerGroup.js";
// export { selectPartnerName } from "./selectPartnerName.js";
// export { selectPartnerRegistr } from "./selectPartnerRegistr.js";
// export { selectPartnerType } from "./selectPartnerType.js";

export async function selectPartners() {
  console.log("SSS", selectPartners);
  return {
    partner: await selectPartnerName(),
    typepartner: await selectPartnerType(),
    typeregistracion: await selectPartnerRegistr(),
    grouppartner: await selectPartnerGroup(),
    groups: await selectPartnerGroup(),
  };
}
