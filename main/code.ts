import type { Emoji } from "../src/typings/emoji";

figma.showUI(__html__);

// figma.showUI(
//   `<script>window.location.href = 'http://localhost:5173/ui'</script>`,
// );

figma.ui.resize(400, 480);

figma.ui.onmessage = msg => {
  if (msg.type === "create") {
    const emojis = msg.emojis as Emoji[];

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

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
