import { loadFont } from "@remotion/google-fonts/BeVietnamPro";

// Be Vietnam Pro ho tro tieng Viet day du, thay the font fallback he thong
// cho tat ca text trong video NQ57.
export const { fontFamily: BV } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
});
