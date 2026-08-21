// ---------------------------------------------------------------------------
// NQ57 Scene Registry — Maps scene IDs to components
// ---------------------------------------------------------------------------

import { TitleScene } from "./TitleScene";
import { QuoteScene } from "./QuoteScene";
import { RolesScene } from "./RolesScene";
import { PillarsScene } from "./PillarsScene";
import { StatsScene } from "./StatsScene";
import { VisionScene } from "./VisionScene";
import { EndScene } from "./EndScene";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SCENE_REGISTRY: Record<string, React.FC<any>> = {
  s1: TitleScene,
  s2: QuoteScene,
  s3: RolesScene,
  s4: PillarsScene,
  s5: StatsScene,
  s6: VisionScene,
  s7: EndScene,
};
