import { Config } from "@remotion/cli/config";

// Video setting mac dinh: 1080p, 30fps, codec h264.
// Doi thanh 'prores' neu can chat luong cao hon de edit tiep o Premiere/DaVinci.
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(2);

// Three.js render bang webGL trong headless Chromium can flag 'angle'.
// Remotion tu dong ap dung khi phat hien @remotion/three trong project,
// nhung khai bao ro cho chac (xem docs: https://www.remotion.dev/docs/three).
Config.setChromiumOpenGlRenderer("angle");
