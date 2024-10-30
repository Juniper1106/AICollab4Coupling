import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

interface Payload {
  message: string;
  canvasScreenshot: string;
  relativeBBox: number[];
  timeStamp: number;
}

export class CommitUserOperation extends Networker.MessageType<Payload> {
  receivingSide(): Networker.Side {
    return NetworkSide.UI;
  }

  handle(payload: Payload, from: Networker.Side) {
    console.log('Plugin commit a user operation:', payload);
    fetch(
      'http://127.0.0.1:5010/save_operation',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    ).then(
      response => response.text()
    ).then(
      text => console.log(text)
    ).catch(
      error => console.error(error)
    )
  }
}
