import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

interface Payload {
  text: string
}

export class AddTextInAI extends Networker.MessageType<Payload> {
  public receivingSide(): Networker.Side {
    return NetworkSide.PLUGIN;
  }

  public handle(payload: Payload, from: Networker.Side): void {
    if (figma.editorType === "figma") {
      //寻找名称为AI workspace的frmae，如果没有则创建
      let aiWorkspace = figma.currentPage.findOne(node => node.name === 'AI workspace' && node.type === 'FRAME') as FrameNode
      if (!aiWorkspace) {
        aiWorkspace = figma.createFrame()
        aiWorkspace.name = 'AI workspace'
        aiWorkspace.layoutMode = 'VERTICAL'
        aiWorkspace.counterAxisSizingMode = 'AUTO'
        aiWorkspace.primaryAxisSizingMode = 'AUTO'
        aiWorkspace.itemSpacing = 20
        aiWorkspace.x = 0
        aiWorkspace.y = 0
        figma.currentPage.appendChild(aiWorkspace)
      }
      //在AI workspace中添加文本框
      const nodes = aiWorkspace.children;
      const text = figma.createText()
      text.characters = payload.text
      aiWorkspace.appendChild(text)

      // //在figma中创建文本框
      //   const nodes = figma.currentPage.children;
      //   const text = figma.createText()
      //   text.characters = payload.text

      //   let foundPosition = false;
      //   const offset = 20;

      //   text.x = figma.viewport.center.x;
      //   text.y = figma.viewport.center.y;
  
      //   for (let y = figma.viewport.center.y; y < figma.viewport.bounds.y + figma.viewport.bounds.height && !foundPosition; y += offset) {
      //     for (let x = figma.viewport.center.x; x < figma.viewport.bounds.x + figma.viewport.bounds.width && !foundPosition; x += offset) {
      //       let isOverlapping = false;
  
      //       // 检查是否与已有节点重叠
      //       for (const node of nodes) {
      //         if (node.visible && node.absoluteBoundingBox) {
      //           const { x: nodeX, y: nodeY, width: nodeWidth, height: nodeHeight } = node.absoluteBoundingBox;
  
      //           if (
      //             x < nodeX + nodeWidth + offset &&
      //             x + text.width > nodeX - offset &&
      //             y < nodeY + nodeHeight + offset &&
      //             y + text.height > nodeY - offset
      //           ) {
      //             isOverlapping = true;
      //             console.log('overlapping', nodes)
      //             break;
      //           }
      //         }
      //       }
  
      //       if (!isOverlapping) {
      //         text.x = x;
      //         text.y = y;
      //         foundPosition = true;
      //       }
      //     }
      //   }

      //   figma.currentPage.appendChild(text)
        // figma.viewport.scrollAndZoomIntoView([text])
    }
  }
}
