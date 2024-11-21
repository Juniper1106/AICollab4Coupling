import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

interface Payload {
  nodeId: string;
}

export class FindNode extends Networker.MessageType<Payload> {
  public receivingSide(): Networker.Side {
    return NetworkSide.PLUGIN;
  }

  public handle(payload: Payload, from: Networker.Side): void {
    if (figma.editorType === "figma") {
      const node = figma.getNodeById(payload.nodeId);
      
      if (node && node.type !== 'PAGE') {
        // 将当前页面的选中节点设置为该节点
        figma.currentPage.selection = [node as SceneNode];
        
        // 滚动并缩放到该节点，使其可见
        figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
      } else {
        console.error("Node not found or invalid node type");
      }
    }
  }
}
