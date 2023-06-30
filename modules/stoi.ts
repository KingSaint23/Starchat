import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import inputSanitization from "../sidekick/input-sanitization";
import Strings from "../lib/db";
import Client from "../sidekick/client";
import { downloadContentFromMessage, proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import { Transform } from "stream";
const STOI = Strings.stoi;

module.exports = {
    name: "stoi",
    description: STOI.DESCRIPTION,
    extendedDescription: STOI.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        // Task starts here
        try {
            // Function to convert media to sticker
            const convertToImage = async (stickerId: string, replyChat: { message: proto.Message.IStickerMessage; type: any; }) => {
                var downloading = await client.sendMessage(
                    Starchat.chatId,
                    STOI.DOWNLOADING,
                    MessageType.text
                );

                const fileName = "./tmp/convert_to_image-" + stickerId;
                const stream: Transform = await downloadContentFromMessage(replyChat.message, replyChat.type);
                await inputSanitization.saveBuffer(fileName, stream);
                const imagePath = "./tmp/image-" + stickerId + ".png";
                try {
                    ffmpeg(fileName)
                        .save(imagePath)
                        .on("error", function (err, stdout, stderr) {
                            inputSanitization.deleteFiles(fileName);
                            client.deleteMessage(Starchat.chatId, {
                                id: downloading.key.id,
                                remoteJid: Starchat.chatId,
                                fromMe: true,
                            });
                            throw err;
                        })
                        .on("end", async () => {
                            await client.sendMessage(
                                Starchat.chatId,
                                fs.readFileSync(imagePath),
                                MessageType.image,
                            ).catch(err => inputSanitization.handleError(err, client, Starchat));
                            await inputSanitization.deleteFiles(fileName, imagePath);
                            return await client.deleteMessage(Starchat.chatId, {
                                id: downloading.key.id,
                                remoteJid: Starchat.chatId,
                                fromMe: true,
                            }).catch(err => inputSanitization.handleError(err, client, Starchat));
                        });
                } catch (err) {
                    throw err;
                }
            };

            if (Starchat.isReplySticker && !Starchat.isReplyAnimatedSticker) {
                var replyChatObject = {
                    message:
                        chat.message.extendedTextMessage.contextInfo
                            .quotedMessage.stickerMessage,
                    type: 'sticker'
                };
                var stickerId =
                    chat.message.extendedTextMessage.contextInfo.stanzaId;
                convertToImage(stickerId, replyChatObject);
            } else if (Starchat.isReplyAnimatedSticker) {
                client.sendMessage(
                    Starchat.chatId,
                    STOI.TAG_A_VALID_STICKER_MESSAGE,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            } else {
                client.sendMessage(
                    Starchat.chatId,
                    STOI.TAG_A_VALID_STICKER_MESSAGE,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
            }
            return;
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                Starchat,
                STOI.ERROR
            );
        }
    },
};
