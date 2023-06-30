import inputSanitization from "../sidekick/input-sanitization";
import STRINGS from "../lib/db.js";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type"

module.exports = {
    name: "invite",
    description: STRINGS.invite.DESCRIPTION,
    extendedDescription: STRINGS.invite.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            if (!Starchat.isGroup) {
                client.sendMessage(
                    Starchat.chatId,
                    STRINGS.general.NOT_A_GROUP,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            await client.getGroupMetaData(Starchat.chatId, Starchat);
            if (!Starchat.isBotGroupAdmin) {
                client.sendMessage(
                    Starchat.chatId,
                    STRINGS.general.BOT_NOT_ADMIN,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            const code = await client.sock.groupInviteCode(Starchat.chatId);
            if (Starchat.isTextReply) {
                client.sendMessage(
                    chat.message.extendedTextMessage.contextInfo.participant,
                    "https://chat.whatsapp.com/" + code,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                client.sendMessage(
                    Starchat.chatId,
                    STRINGS.invite.LINK_SENT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            client.sendMessage(
                Starchat.chatId,
                "https://chat.whatsapp.com/" + code,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, Starchat));
            return;
        } catch (err) {
            await inputSanitization.handleError(err, client, Starchat);
        }
    },
};
