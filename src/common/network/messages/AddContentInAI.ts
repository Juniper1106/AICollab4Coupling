import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

interface Payload {
  text: string,
  img_url: string
}

export class AddContentInAI extends Networker.MessageType<Payload> {
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
      if (payload.img_url === '') {
        //在AI workspace中添加文本框
        const nodes = aiWorkspace.children;
        const text = figma.createText()
        text.characters = payload.text
        aiWorkspace.appendChild(text)
      } else {
        //在AI workspace中添加图片
        console.log('add image')
      }
    }
  }
}
