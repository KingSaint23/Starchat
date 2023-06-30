import chalk from "chalk";
import STRINGS from "../lib/db.js";
import inputSanitization from "../sidekick/input-sanitization";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";

module.exports = {
    name: "remove",
    description: STRINGS.remove.DESCRIPTION,
    extendedDescription: STRINGS.remove.EXTENDED_DESCRIPTION,
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
            let owner: string;
            for (const index in Starchat.groupMembers) {
                if (Starchat.groupMembers[index].admin === 'superadmin') {
                    owner = Starchat.groupMembers[index].id.split("@")[0];
                }
            }
            if (Starchat.isTextReply) {
                let PersonToRemove =
                    chat.message.extendedTextMessage.contextInfo.participant;
                if (PersonToRemove === owner + "@s.whatsapp.net") {
                    client.sendMessage(
                        Starchat.chatId,
                        "*" + owner + " is the owner of the group*",
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, Starchat));
                    return;
                }
                if (PersonToRemove === Starchat.owner) {
                    client.sendMessage(
                        Starchat.chatId,
                        "```Why man, why?! Why would you use my powers to remove myself from the group?!🥺```\n*Request Rejected.* 😤",
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, Starchat));
                    return;
                }
                var isMember = inputSanitization.isMember(
                    PersonToRemove,
                    Starchat.groupMembers
                );
                if (!isMember) {
                    client.sendMessage(
                        Starchat.chatId,
                        "*person is not in the group*",
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, Starchat));
                }
                try {
                    if (PersonToRemove) {
                        await client.sock.groupParticipantsUpdate(Starchat.chatId, [PersonToRemove], 'remove').catch(err => inputSanitization.handleError(err, client, Starchat));
                        return;
                    }
                } catch (err) {
                    throw err;
                }
                return;
            }
            if (!args[0]) {
                client.sendMessage(
                    Starchat.chatId,
                    STRINGS.remove.INPUT_ERROR,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            if (args[0][0] == "@") {
                const number = args[0].substring(1);
                if (parseInt(args[0]) === NaN) {
                    client.sendMessage(
                        Starchat.chatId,
                        STRINGS.remove.INPUT_ERROR,
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, Starchat));
                    return;
                }

                if((number + "@s.whatsapp.net") === Starchat.owner){
                    client.sendMessage(
                        Starchat.chatId,
                        "```Why man, why?! Why would you use my powers to remove myself from the group?!🥺```\n*Request Rejected.* 😤",
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, Starchat));
                    return;
                }

                if (!(number === owner)) {
                    await client.sock.groupParticipantsUpdate(Starchat.chatId, [number + "@s.whatsapp.net"], 'remove').catch(err => inputSanitization.handleError(err, client, Starchat));
                    return;
                } else {
                    client.sendMessage(
                        Starchat.chatId,
                        "*" + owner + " is the owner of the group*",
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, Starchat));
                    return;
                }
            }
            client.sendMessage(
                Starchat.chatId,
                STRINGS.remove.INPUT_ERROR,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, Starchat));
        } catch (err) {
            await inputSanitization.handleError(err, client, Starchat);
            return;
        }
    },
};
