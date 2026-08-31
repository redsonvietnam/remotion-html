// ---------------------------------------------------------------------------
// Root — Remotion entry point
//
// Registers all compositions. This is the thinnest layer.
// ---------------------------------------------------------------------------

import React from "react";
import { Composition } from "remotion";
import { NQ57Template } from "./templates/nq57";
import { StoicLoveTemplate } from "./templates/stoicLove";
import { NodeFlowTemplate } from "./templates/nodeflow";
import { SCENES, sceneFrames } from "./data/nq57";
import { DE_AN06_SCENES, DE_AN06_CONTENT, sceneFrames as deAn06SceneFrames } from "./data/deAn06";
import { deAn06 } from "./theme/deAn06";
import { NGHI_QUYET_79_SCENES, NGHI_QUYET_79_CONTENT, sceneFrames as nq79SceneFrames } from "./data/nghiQuyet79";
import { nghiQuyet79 } from "./theme/nghiQuyet79";
import { STOIC_LOVE_SCENES, STOIC_LOVE_CONTENT, sceneFrames as stoicLoveSceneFrames } from "./data/stoicLove";
import { stoicLove } from "./theme/stoicLove";
import { CAN_CUOC_SCENES, CAN_CUOC_CONTENT, sceneFrames as canCuocSceneFrames } from "./data/canCuoc";
import { canCuoc } from "./theme/canCuoc";
import { LUAT_GTDB_SCENES, LUAT_GTDB_CONTENT, sceneFrames as luatGTDBSceneFrames } from "./data/luatGTDB";
import { luatGTDB } from "./theme/luatGTDB";
import { BlueprintTemplate } from "./templates/blueprint";
import { LUAT_BHXH_SCENES, LUAT_BHXH_CONTENT, sceneFrames as luatBHXHSceneFrames } from "./data/luatBHXH";
import { blueprint } from "./theme/blueprint";
import { BAO_HIEM_SCENES, BAO_HIEM_CONTENT, sceneFrames as baoHiemSceneFrames } from "./data/baoHiem2024";
import { baoHiem2024 } from "./theme/baoHiem2024";
import { CR7Template } from "./templates/cr7";
import { CR7_SCENES, CR7_CONTENT, sceneFrames as cr7SceneFrames } from "./data/cr7Records";
import { cr7 } from "./theme/cr7";
import { CR7_VS_MESSI_SCENES, CR7_VS_MESSI_CONTENT, sceneFrames as cr7VsMessiSceneFrames } from "./data/cr7VsMessi";
import { CosmosTemplate } from "./templates/cosmos";
import { SOLAR_SYSTEM_SCENES, SOLAR_SYSTEM_CONTENT, sceneFrames as solarSystemSceneFrames } from "./data/solarSystem";
import { cosmos } from "./theme/cosmos";
import { ScrapbookTemplate } from "./templates/scrapbook";
import { CHAMPIONS_LEAGUE_SCENES, CHAMPIONS_LEAGUE_CONTENT, sceneFramesCl } from "./data/championsLeague";
import { TerminalTemplate } from "./templates/terminal";
import { TERMINAL_SCENES, TERMINAL_CONTENT, terminalSceneFrames } from "./data/terminalDemo";
import { terminalTheme } from "./theme/terminal";
import { KineticStatementTemplate } from "./templates/kinetic-statement";
import { KINETIC_SCENES, KINETIC_CONTENT, kineticSceneFrames } from "./data/kineticStatement";
import { kineticStatementTheme } from "./templates/kinetic-statement/theme";
import { ProductTeaserTemplate } from "./templates/product-teaser";
import { PRODUCT_TEASER_SCENES, PRODUCT_TEASER_CONTENT, PRODUCT_TEASER_TOTAL_FRAMES, FPS as PRODUCT_TEASER_FPS } from "./data/productTeaser";
import { productTeaser } from "./theme/productTeaser";
import { EditorialFeatureTemplate } from "./templates/editorial-feature";
import { EDITORIAL_FEATURE_CONTENT, EDITORIAL_FEATURE_TOTAL_FRAMES } from "./data/editorialFeature";
import { RealEstateListingTemplate } from "./templates/real-estate-listing";
import { REAL_ESTATE_LISTING_CONTENT, REAL_ESTATE_LISTING_TOTAL_FRAMES } from "./data/realEstateListing";

const FPS = 30;

const NQ57_FRAMES =
  SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) + (SCENES.length - 1) * 16;

const DE_AN06_FRAMES =
  DE_AN06_SCENES.reduce((acc, s) => acc + deAn06SceneFrames(s.dur), 0) +
  (DE_AN06_SCENES.length - 1) * 16;

const NGHI_QUYET_79_FRAMES =
  NGHI_QUYET_79_SCENES.reduce((acc, s) => acc + nq79SceneFrames(s.dur), 0) +
  (NGHI_QUYET_79_SCENES.length - 1) * 16;

const STOIC_LOVE_FRAMES =
  STOIC_LOVE_SCENES.reduce((acc, s) => acc + stoicLoveSceneFrames(s.dur), 0) +
  (STOIC_LOVE_SCENES.length - 1) * 12;

const CAN_CUOC_FRAMES =
  CAN_CUOC_SCENES.reduce((acc, s) => acc + canCuocSceneFrames(s.dur), 0) +
  (CAN_CUOC_SCENES.length - 1) * 16;

const LUAT_GTDB_FRAMES =
  LUAT_GTDB_SCENES.reduce((acc, s) => acc + luatGTDBSceneFrames(s.dur), 0) +
  (LUAT_GTDB_SCENES.length - 1) * 16;

const LUAT_BHXH_FRAMES =
  LUAT_BHXH_SCENES.reduce((acc, s) => acc + luatBHXHSceneFrames(s.dur), 0) +
  (LUAT_BHXH_SCENES.length - 1) * 14;

const BAO_HIEM_FRAMES =
  BAO_HIEM_SCENES.reduce((acc, s) => acc + baoHiemSceneFrames(s.dur), 0) +
  (BAO_HIEM_SCENES.length - 1) * 20;

const CR7_FRAMES =
  CR7_SCENES.reduce((acc, s) => acc + cr7SceneFrames(s.dur), 0) +
  (CR7_SCENES.length - 1) * 16;

const CR7_VS_MESSI_FRAMES =
  CR7_VS_MESSI_SCENES.reduce((acc, s) => acc + cr7VsMessiSceneFrames(s.dur), 0) +
  (CR7_VS_MESSI_SCENES.length - 1) * 16;

const SOLAR_SYSTEM_FRAMES =
  SOLAR_SYSTEM_SCENES.reduce((acc, s) => acc + solarSystemSceneFrames(s.dur), 0) +
  (SOLAR_SYSTEM_SCENES.length - 1) * 16;

const CHAMPIONS_LEAGUE_FRAMES =
  CHAMPIONS_LEAGUE_SCENES.reduce((acc, s) => acc + sceneFramesCl(s.dur), 0) -
  (CHAMPIONS_LEAGUE_SCENES.length - 1) * 16;

const TERMINAL_DEMO_FRAMES =
  TERMINAL_SCENES.reduce((acc, s) => acc + terminalSceneFrames(s.dur), 0) +
  (TERMINAL_SCENES.length - 1) * 12;

const KINETIC_STATEMENT_FRAMES =
  KINETIC_SCENES.reduce((acc, s) => acc + kineticSceneFrames(s.dur), 0) +
  (KINETIC_SCENES.length - 1) * 12;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="NghiQuyet57V2"
        component={NQ57Template}
        durationInFrames={NQ57_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="DeAn06"
        component={NQ57Template}
        durationInFrames={DE_AN06_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: DE_AN06_SCENES,
          content: DE_AN06_CONTENT,
          theme: deAn06,
        }}
      />
      <Composition
        id="NghiQuyet79"
        component={NQ57Template}
        durationInFrames={NGHI_QUYET_79_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: NGHI_QUYET_79_SCENES,
          content: NGHI_QUYET_79_CONTENT,
          theme: nghiQuyet79,
        }}
      />
      <Composition
        id="StoicLove"
        component={StoicLoveTemplate}
        durationInFrames={STOIC_LOVE_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: STOIC_LOVE_SCENES,
          content: STOIC_LOVE_CONTENT,
          theme: stoicLove,
        }}
      />
      <Composition
        id="CanCuoc"
        component={NQ57Template}
        durationInFrames={CAN_CUOC_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: CAN_CUOC_SCENES,
          content: CAN_CUOC_CONTENT,
          theme: canCuoc,
        }}
      />
<Composition
        id="LuatGTDB"
        component={NQ57Template}
        durationInFrames={LUAT_GTDB_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: LUAT_GTDB_SCENES,
          content: LUAT_GTDB_CONTENT,
          theme: luatGTDB,
        }}
      />
      <Composition
        id="LuatBHXH"
        component={BlueprintTemplate}
        durationInFrames={LUAT_BHXH_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: LUAT_BHXH_SCENES,
          content: LUAT_BHXH_CONTENT,
          theme: blueprint,
        }}
      />
      <Composition
        id="BaoHiem2024"
        component={NodeFlowTemplate}
        durationInFrames={BAO_HIEM_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: BAO_HIEM_SCENES,
          content: BAO_HIEM_CONTENT,
          theme: baoHiem2024,
        }}
      />
      <Composition
        id="CR7Records"
        component={CR7Template}
        durationInFrames={CR7_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: CR7_SCENES,
          content: CR7_CONTENT,
          theme: cr7,
        }}
      />
      <Composition
        id="CR7VsMessi"
        component={CR7Template}
        durationInFrames={CR7_VS_MESSI_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: CR7_VS_MESSI_SCENES,
          content: CR7_VS_MESSI_CONTENT,
          theme: cr7,
        }}
      />
      <Composition
        id="SolarSystem"
        component={CosmosTemplate}
        durationInFrames={SOLAR_SYSTEM_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: SOLAR_SYSTEM_SCENES,
          content: SOLAR_SYSTEM_CONTENT,
          theme: cosmos,
        }}
      />
      <Composition
        id="ChampionsLeague"
        component={ScrapbookTemplate}
        durationInFrames={CHAMPIONS_LEAGUE_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: CHAMPIONS_LEAGUE_SCENES,
          content: CHAMPIONS_LEAGUE_CONTENT,
        }}
      />
      <Composition
        id="ChampionsLeague9x16"
        component={ScrapbookTemplate}
        durationInFrames={CHAMPIONS_LEAGUE_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: CHAMPIONS_LEAGUE_SCENES,
          content: CHAMPIONS_LEAGUE_CONTENT,
        }}
      />
      <Composition
        id="TerminalCodeTip"
        component={TerminalTemplate}
        durationInFrames={TERMINAL_DEMO_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: TERMINAL_SCENES,
          content: TERMINAL_CONTENT,
          theme: terminalTheme,
        }}
      />
      <Composition
        id="KineticStatement"
        component={KineticStatementTemplate}
        durationInFrames={KINETIC_STATEMENT_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: KINETIC_SCENES,
          content: KINETIC_CONTENT,
          theme: kineticStatementTheme,
        }}
      />
      <Composition
        id="ProductTeaser"
        component={ProductTeaserTemplate}
        durationInFrames={PRODUCT_TEASER_TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: PRODUCT_TEASER_SCENES,
          content: PRODUCT_TEASER_CONTENT,
          theme: productTeaser,
        }}
      />
      <Composition
        id="EditorialFeature"
        component={EditorialFeatureTemplate}
        durationInFrames={EDITORIAL_FEATURE_TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          cover: EDITORIAL_FEATURE_CONTENT.cover,
          pullquote: EDITORIAL_FEATURE_CONTENT.pullquote,
          takeawaysTitle: EDITORIAL_FEATURE_CONTENT.takeawaysTitle,
          takeaways: EDITORIAL_FEATURE_CONTENT.takeaways,
          outro: EDITORIAL_FEATURE_CONTENT.outro,
        }}
      />
      <Composition
        id="RealEstateListing"
        component={RealEstateListingTemplate}
        durationInFrames={REAL_ESTATE_LISTING_TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          cover: REAL_ESTATE_LISTING_CONTENT.cover,
          specs: REAL_ESTATE_LISTING_CONTENT.specs,
          highlightsTitle: REAL_ESTATE_LISTING_CONTENT.highlightsTitle,
          highlights: REAL_ESTATE_LISTING_CONTENT.highlights,
          agent: REAL_ESTATE_LISTING_CONTENT.agent,
        }}
      />
    </>
  );
};
