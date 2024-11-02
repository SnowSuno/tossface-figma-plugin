import { Message } from "@tossface-figma/common";

figma.showUI(__html__, { themeColors: true });

figma.ui.resize(386, 480);

figma.ui.onmessage = (msg: Message) => {
  if (msg.type === "create") {
    figma.notify("이모지를 삽입했어요.");

    const emojis = msg.emojis;

    const nodes = emojis.map((emoji, i) => {
      const icon = figma.createNodeFromSvg(emoji.source);

      icon.name = emoji.name;
      icon.x = figma.viewport.center.x + 40 * i;
      icon.y = figma.viewport.center.y;

      icon.children.forEach(node => {
        node.locked = true;
      });

      icon.constrainProportions = true;

      return icon;
    });

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  if (msg.type === "exit") {
    figma.closePlugin();
  }
};
