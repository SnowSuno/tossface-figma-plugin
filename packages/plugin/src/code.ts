import { Message } from "@tossface-figma/common";

figma.showUI(__html__);

figma.ui.resize(400, 480);

figma.ui.onmessage = (msg: Message) => {
  if (msg.type === "create") {
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
