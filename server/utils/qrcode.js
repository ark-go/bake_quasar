import QRCode from "qrcode";

export async function getQRCodeUrl(text) {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err);
    return null;
  }
}
