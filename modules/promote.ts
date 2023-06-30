import inputSanitization from "../sidekick/input-sanitization";
import String from "../lib/db.js";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
const REPLY = String.promote;

module.exports = {
    name: "promote",
    description: REPLY.DESCRIPTION,
    extendedDescription: REPLY.EXTENDED_DESCRIPTION,
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            if (!Starchat.isGroup) {
                client.sendMessage(
                    Starchat.chatId,
                    REPLY.NOT_A_GROUP,
                    MessageType.text
                );
                return;
            }
            await client.getGroupMetaData(Starchat.chatId, Starchat);
            if (!Starchat.isBotGroupAdmin) {
                client.sendMessage(
                    Starchat.chatId,
                    REPLY.BOT_NOT_ADMIN,
                    MessageType.text
                );
                return;
            }
            if (!Starchat.isTextReply && typeof args[0] == "undefined") {
                client.sendMessage(
                    Starchat.chatId,
                    REPLY.MESSAGE_NOT_TAGGED,
                    MessageType.text
                );
                return;
            }
            const reply = chat.message.extendedTextMessage;

            if (Starchat.isTextReply) {
                var contact = reply.contextInfo.participant.split("@")[0];
            } else {
                var contact = await inputSanitization.getCleanedContact(
                    args,
                    client,
                    Starchat
                );
            }

            var admin = false;
            var isMember = await inputSanitization.isMember(
                contact,
                Starchat.groupMembers
            );
            for (const index in Starchat.groupMembers) {
                if (contact == Starchat.groupMembers[index].id.split("@")[0]) {
                    admin = Starchat.groupMembers[index].admin != undefined;
                }
            }
            if (isMember) {
                if (!admin) {
                    const arr = [contact + "@s.whatsapp.net"];
                    await client.sock.groupParticipantsUpdate(Starchat.chatId, arr, 'promote');
                    client.sendMessage(
                        Starchat.chatId,
                        "*" + contact + " promoted to admin*",
                        MessageType.text
                    );
                } else {
                    client.sendMessage(
                        Starchat.chatId,
                        "*" + contact + " is already an admin*",
                        MessageType.text
                    );
                }
            }
            if (!isMember) {
                if (contact === undefined) {
                    return;
                }

                client.sendMessage(
                    Starchat.chatId,
                    REPLY.PERSON_NOT_IN_GROUP,
                    MessageType.text
                );
                return;
            }
        } catch (err) {
            if (err === "NumberInvalid") {
                await inputSanitization.handleError(
                    err,
                    client,
                    Starchat,
                    "```Invalid number ```" + args[0]
                );
            } else {
                await inputSanitization.handleError(err, client, Starchat);
            }
        }
    },
};
