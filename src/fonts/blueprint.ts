import { loadFont as loadDisplay } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

// Be Vietnam Pro — full Vietnamese diacritic support. Used for every piece of
// narration text, title, and label copy in the template.
export const { fontFamily: BV } = loadDisplay("normal", {
  weights: ["400", "500", "600", "700", "800"],
});

// IBM Plex Mono — technical/drafting register. Used ONLY for pure Latin or
// numeric content that carries no Vietnamese diacritics: dimension figures
// ("15", "20", "141"), codes ("41/2024/QH15", "01/07/2025"), and callout tag
// numbers ("01", "02"...). Never used for narration text.
export const { fontFamily: MONO } = loadMono("normal", {
  weights: ["400", "500", "600"],
});
