import chalk from "chalk";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ytdl from "ytdl-core";
import yts from "yt-search";
import inputSanitization from "../sidekick/input-sanitization";
import STRINGS from "../lib/db.js";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
const SONG = STRINGS.song;

module.exports = {
    name: "song",
    description: SONG.DESCRIPTION,
    extendedDescription: SONG.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".song love of my life",
            ".song https://www.youtube.com/watch?v=0Gc3nvmMQP0",
            ".song https://youtu.be/pWiI9gabW9k",
        ],
    },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            if (args.length === 0) {
                await client.sendMessage(
                    Starchat.chatId,
                    SONG.ENTER_SONG,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            var reply = await client.sendMessage(
                Starchat.chatId,
                SONG.DOWNLOADING,
                MessageType.text
            );

            var Id = " ";
            if (args[0].includes("youtu")) {
                Id = args[0];
                try {
                    if (args[0].includes("watch?v=")) {
                        var songId = args[0].split("watch?v=")[1];
                    } else {
                        var songId = args[0].split("/")[3];
                    }
                    const video = await yts({ videoId: songId });
                } catch (err) {
                    throw err;
                }
            } else {
                var song = await yts(args.join(" "));
                song = song.all;
                if (song.length < 1) {
                    client.sendMessage(
                        Starchat.chatId,
                        SONG.SONG_NOT_FOUND,
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, Starchat));
                    return;
                }
                Id = song[0].url;
            }
            try {
                var stream = ytdl(Id, {
                    quality: "highestaudio",
                });

                ffmpeg(stream)
                    .audioBitrate(320)
                    .toFormat("ipod")
                    .saveToFile(`tmp/${chat.key.id}.mp3`)
                    .on("end", async () => {
                        var upload = await client.sendMessage(
                            Starchat.chatId,
                            SONG.UPLOADING,
                            MessageType.text
                        );
                        await client.sendMessage(
                            Starchat.chatId,
                            fs.readFileSync(`tmp/${chat.key.id}.mp3`),
                            MessageType.audio
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));
                        inputSanitization.deleteFiles(`tmp/${chat.key.id}.mp3`);
                        client.deleteMessage(Starchat.chatId, {
                            id: reply.key.id,
                            remoteJid: Starchat.chatId,
                            fromMe: true,
                        });
                        client.deleteMessage(Starchat.chatId, {
                            id: upload.key.id,
                            remoteJid: Starchat.chatId,
                            fromMe: true,
                        });
                    });
            } catch (err) {
                throw err;
            }
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                Starchat,
                SONG.SONG_NOT_FOUND
            );
        }
    },
};
