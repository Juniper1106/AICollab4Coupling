import { CreateRectMessage } from "@common/network/messages/CreateRectMessage";
import { HelloMessage } from "@common/network/messages/HelloMessage";
import { PingMessage } from "@common/network/messages/PingMessage";
import { AddTextInAI } from "@common/network/messages/AddTextInAI";
import { AddText } from "@common/network/messages/AddText";
import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";

export namespace NetworkMessages {
  export const registry = new Networker.MessageTypeRegistry();

  export const PING = registry.register(new PingMessage("ping"));

  export const HELLO_PLUGIN = registry.register(
    new HelloMessage(NetworkSide.PLUGIN)
  );

  export const HELLO_UI = registry.register(new HelloMessage(NetworkSide.UI));

  export const CREATE_RECT = registry.register(
    new CreateRectMessage("create-rect")
  );

  export const ADD_TEXT = registry.register(
    new AddText("add-text")
  );

  export const ADD_TEXT_IN_AI = registry.register(
    new AddTextInAI("add-text-in-ai")
  );
}
