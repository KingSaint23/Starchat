import inputSanitization from "../sidekick/input-sanitization";
import STRINGS from "../lib/db.js";
import Client from "../sidekick/client.js";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import { proto } from "@adiwajshing/baileys";

module.exports = {
    name: "tagall",
    description: STRINGS.tagall.DESCRIPTION,
    extendedDescription: STRINGS.tagall.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".tagall",
            ".tagall Hey everyone! You have been tagged in this message hehe.",
        ],
    },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            if(Starchat.chatId === "917838204238-1632576208@g.us"){
                return; // Disable this for Spam Chat
            }
            if (!Starchat.isGroup) {
                client.sendMessage(
                    Starchat.chatId,
                    STRINGS.general.NOT_A_GROUP,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            await client.getGroupMetaData(Starchat.chatId, Starchat);
            let members = [];
            for (var i = 0; i < Starchat.groupMembers.length; i++) {
                members[i] = Starchat.groupMembers[i].id;
            }
            if (Starchat.isTextReply) {
                let quote = await client.store.loadMessage(Starchat.chatId, Starchat.replyMessageId, undefined);
                await client.sock.sendMessage(
                    Starchat.chatId,
                    {
                        text: STRINGS.tagall.TAG_MESSAGE,
                        mentions: members
                    },
                    {
                        quoted: quote
                    }
                )
                // client.sendMessage(
                //     Starchat.chatId,
                //     STRINGS.tagall.TAG_MESSAGE,
                //     MessageType.text,
                //     {
                //         contextInfo: {
                //             stanzaId: Starchat.replyMessageId,
                //             participant: Starchat.replyParticipant,
                //             quotedMessage: {
                //                 conversation: Starchat.replyMessage,
                //             },
                //             mentionedJid: members,
                //         },
                //     }
                // ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            if (args.length) {
                client.sendMessage(
                    Starchat.chatId,
                    Starchat.body.replace(
                        Starchat.body[0] + Starchat.commandName + " ",
                        ""
                    ),
                    MessageType.text,
                    {
                        contextInfo: {
                            mentionedJid: members,
                        },
                    }
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }

            client.sendMessage(
                Starchat.chatId,
                STRINGS.tagall.TAG_MESSAGE,
                MessageType.text,
                {
                    contextInfo: {
                        mentionedJid: members,
                    },
                }
            ).catch(err => inputSanitization.handleError(err, client, Starchat));
        } catch (err) {
            await inputSanitization.handleError(err, client, Starchat);
        }
        return;
    },
};
