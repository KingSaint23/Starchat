import translate from "@vitalets/google-translate-api";
import inputSanitization from "../sidekick/input-sanitization";
import STRINGS from "../lib/db";
import format from "string-format";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";

module.exports = {
    name: "tr",
    description: STRINGS.tr.DESCRIPTION,
    extendedDescription: STRINGS.tr.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".tr やめてください",
            ".tr how are you | hindi",
            ".tr how are you | hi",
        ],
    },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        const processing = await client.sendMessage(
            Starchat.chatId,
            STRINGS.tr.PROCESSING,
            MessageType.text
        );
        try {
            var text = "";
            var language = "";
            if (args.length == 0) {
                await client.sendMessage(
                    Starchat.chatId,
                    STRINGS.tr.EXTENDED_DESCRIPTION,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return await client.deleteMessage(Starchat.chatId, {
                    id: processing.key.id,
                    remoteJid: Starchat.chatId,
                    fromMe: true,
                });
            }
            if (!Starchat.isTextReply) {
                try {
                    var body = Starchat.body.split("|");
                    text = body[0].replace(
                        Starchat.body[0] + Starchat.commandName + " ",
                        ""
                    );
                    var i = 0;
                    while (body[1].split(" ")[i] == "") {
                        i++;
                    }
                    language = body[1].split(" ")[i];
                } catch (err) {
                    if (err instanceof TypeError) {
                        text = Starchat.body.replace(
                            Starchat.body[0] + Starchat.commandName + " ",
                            ""
                        );
                        language = "English";
                    }
                }
            } else if (Starchat.replyMessage) {
                text = Starchat.replyMessage;
                language = args[0];
            } else {
                await client.sendMessage(
                    Starchat.chatId,
                    STRINGS.tr.INVALID_REPLY,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return await client.deleteMessage(Starchat.chatId, {
                    id: processing.key.id,
                    remoteJid: Starchat.chatId,
                    fromMe: true,
                });
            }
            if (text.length > 4000) {
                await client.sendMessage(
                    Starchat.chatId,
                    format(STRINGS.tr.TOO_LONG, String(text.length)),
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return await client.deleteMessage(Starchat.chatId, {
                    id: processing.key.id,
                    remoteJid: Starchat.chatId,
                    fromMe: true,
                });
            }
            await translate(text, {
                to: language,
            })
                .then((res) => {
                    client.sendMessage(
                        Starchat.chatId,
                        format(
                            STRINGS.tr.SUCCESS,
                            res.from.language.iso,
                            language,
                            res.text
                        ),
                        MessageType.text
                    );
                })
                .catch((err) => {
                    inputSanitization.handleError(
                        err,
                        client,
                        Starchat,
                        STRINGS.tr.LANGUAGE_NOT_SUPPORTED
                    );
                });
            return await client.deleteMessage(Starchat.chatId, {
                id: processing.key.id,
                remoteJid: Starchat.chatId,
                fromMe: true,
            });
        } catch (err) {
            inputSanitization.handleError(err, client, Starchat);
        }
    },
};
