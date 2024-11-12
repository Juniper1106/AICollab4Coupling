import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

interface Payload {
  text: string,
  img_url: string
}

export class AddContent extends Networker.MessageType<Payload> {
  public receivingSide(): Networker.Side {
    return NetworkSide.PLUGIN;
  }

  public async handle(payload: Payload, from: Networker.Side): Promise<void> {
    if (figma.editorType === "figma") {
      const nodes = figma.currentPage.children;
      const offset = 20;
      let foundPosition = false;

      if (payload.text !== '') {
        //在figma中创建文本框
        console.log("add text")
        const text = figma.createText()
        text.characters = payload.text
        text.x = figma.viewport.center.x;
        text.y = figma.viewport.center.y;
        // 设置文本框最大宽度
        const width = text.width>320?320:text.width
        text.resize(width, text.height)
        for (let x = figma.viewport.center.x; x < figma.viewport.bounds.x + figma.viewport.bounds.width && !foundPosition; x += offset) {
          for (let y = figma.viewport.center.y; y < figma.viewport.bounds.y + figma.viewport.bounds.height && !foundPosition; y += offset) {
            let isOverlapping = false;

            // 检查是否与已有节点重叠
            for (const node of nodes) {
              if (node.visible && node.absoluteBoundingBox) {
                const { x: nodeX, y: nodeY, width: nodeWidth, height: nodeHeight } = node.absoluteBoundingBox;

                if (
                  x < nodeX + nodeWidth + offset &&
                  x + text.width > nodeX - offset &&
                  y < nodeY + nodeHeight + offset &&
                  y + text.height > nodeY - offset
                ) {
                  isOverlapping = true;
                  console.log('overlapping', nodes)
                  break;
                }
              }
            }

            if (!isOverlapping) {
              text.x = x;
              text.y = y;
              foundPosition = true;
            }
          }
        }

        // 在文本框周边绘制一个矩形
        const rect = figma.createRectangle();
        rect.x = text.x-5;
        rect.y = text.y-5;
        rect.resize(text.width+10, text.height+10);
        rect.strokes = [{ type: 'SOLID', color: { r: 1, g: 0.835, b: 0.569 }, opacity: 1 }];
        rect.strokeWeight = 3;
        rect.fills = [];
        figma.currentPage.appendChild(rect);
        figma.currentPage.appendChild(text)
        // figma.viewport.scrollAndZoomIntoView([text])
      } else {
        // 在figma中添加图片
        const imageUrl = payload.img_url; // 获取传递的图片 URL
        console.log(imageUrl)

        // 获取图片数据并创建图像
        const response = await fetch(imageUrl);
        const imageData = await response.arrayBuffer();
        const image = figma.createImage(new Uint8Array(imageData));

        // 创建图片节点并设置图片填充
        const imageNode = figma.createRectangle();
        imageNode.resize(160, 160); // 设置图片大小，可以根据需求调整
        imageNode.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }];
        imageNode.name = 'image'
        // 设置边框
        imageNode.strokes = [{ type: 'SOLID', color: { r: 1, g: 0.835, b: 0.569 }, opacity: 1 }];
        imageNode.strokeWeight = 3;
        // 插入到画布的中心
        figma.currentPage.appendChild(imageNode);
        imageNode.x = figma.viewport.center.x;
        imageNode.y = figma.viewport.center.y;
        for (let x = figma.viewport.center.x; x < figma.viewport.bounds.x + figma.viewport.bounds.width && !foundPosition; x += offset) {
          for (let y = figma.viewport.center.y; y < figma.viewport.bounds.y + figma.viewport.bounds.height && !foundPosition; y += offset) {
            let isOverlapping = false;

            // 检查是否与已有节点重叠
            for (const node of nodes) {
              if (node.visible && node.absoluteBoundingBox) {
                const { x: nodeX, y: nodeY, width: nodeWidth, height: nodeHeight } = node.absoluteBoundingBox;

                if (
                  x < nodeX + nodeWidth + offset &&
                  x + imageNode.width > nodeX - offset &&
                  y < nodeY + nodeHeight + offset &&
                  y + imageNode.height > nodeY - offset
                ) {
                  isOverlapping = true;
                  console.log('overlapping', nodes)
                  break;
                }
              }
            }

            if (!isOverlapping) {
              imageNode.x = x;
              imageNode.y = y;
              foundPosition = true;
            }
          }
        }

        console.log('image added')
      }
    }
  }
}
