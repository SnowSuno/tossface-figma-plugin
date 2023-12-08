import type { Emoji } from "@/typings/emoji";

figma.showUI(__html__);

figma.ui.resize(320, 276);

figma.ui.onmessage = msg => {
  if (msg.type === "create") {
    const emojis = msg.emojis as Emoji[];

    const nodes = emojis.map((emoji, i) => {
      const icon = figma.createNodeFromSvg(emoji.source);

      icon.name = emoji.name;
      icon.x = figma.viewport.center.x + 40 * i;
      icon.y = figma.viewport.center.y;

      return icon;
    });

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
