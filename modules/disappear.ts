import STRINGS from "../lib/db.js";
import inputSanitization from "../sidekick/input-sanitization";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type"

module.exports = {
    name: "disappear",
    description: STRINGS.disappear.DESCRIPTION,
    extendedDescription: STRINGS.disappear.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: [".disappear", ".disappear off"] },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            var time: any = 7 * 24 * 60 * 60;
            if (Starchat.isPm) {
                client.sendMessage(
                    Starchat.chatId,
                    STRINGS.general.NOT_A_GROUP,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            if (Starchat.isGroup) {
                if (chat.message.extendedTextMessage == null) {
                    await client.sock.sendMessage(
                        Starchat.chatId,
                        {disappearingMessagesInChat: time}
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));
                } else {
                    await client.sock.sendMessage(
                        Starchat.chatId,
                        {disappearingMessagesInChat: false}
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));
                }
                return;
            }
            if (chat.message.extendedTextMessage.contextInfo.expiration == 0) {
                time = 7 * 24 * 60 * 60;
            } else {
                time = false;
            }
            await client.sock.sendMessage(
                Starchat.chatId,
                {disappearingMessagesInChat: time}
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
            return;
        } catch (err) {
            await inputSanitization.handleError(err, client, Starchat);
        }
    },
};
