import Strings from "../lib/db";
const ADMINS = Strings.admins;
import inputSanitization from "../sidekick/input-sanitization";
import Client from "../sidekick/client.js";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import { proto } from "@adiwajshing/baileys";

module.exports = {
    name: "admins",
    description: ADMINS.DESCRIPTION,
    extendedDescription: ADMINS.EXTENDED_DESCRIPTION,
    demo: { text: ".admins", isEnabled: true },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            if (!Starchat.isGroup) {
                client.sendMessage(
                    Starchat.chatId,
                    ADMINS.NOT_GROUP_CHAT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }

            let message: string = "";
            await client.getGroupMetaData(Starchat.chatId, Starchat);
            for (let admin of Starchat.groupAdmins) {
                let number: string = admin.split("@")[0];
                message += `@${number} `;
            }

            client.sendMessage(Starchat.chatId, message, MessageType.text, {
                contextInfo: {
                    mentionedJid: Starchat.groupAdmins,
                },
            }).catch(err => inputSanitization.handleError(err, client, Starchat));
            return;
        } catch (err) {
            await inputSanitization.handleError(err, client, Starchat);
        }
    },
};
