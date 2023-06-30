import chalk from "chalk";
import STRINGS from "../lib/db.js";
import inputSanitization from "../sidekick/input-sanitization";
import CONFIG from "../config";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import format from "string-format";
import fs from 'fs';
const ADD = STRINGS.add;

module.exports = {
    name: "add",
    description: ADD.DESCRIPTION,
    extendedDescription: ADD.EXTENDED_DESCRIPTION,
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
            if (!args[0]) {
                client.sendMessage(
                    Starchat.chatId,
                    ADD.NO_ARG_ERROR,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            let number;
            if (parseInt(args[0]) === NaN || args[0][0] === "+" || args[0].length < 10) {
                client.sendMessage(
                    Starchat.chatId,
                    ADD.NUMBER_SYNTAX_ERROR,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            if (args[0].length == 10 && !(parseInt(args[0]) === NaN)) {
                number = CONFIG.COUNTRY_CODE + args[0];
            } else {
                number = args[0];
            }
            const [exists] = await client.sock.onWhatsApp(
                number + "@s.whatsapp.net"
            );
            if (!(exists)) {
                client.sendMessage(
                    Starchat.chatId,
                    format(ADD.NOT_ON_WHATSAPP, number),
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            const response: any = await client.sock.groupParticipantsUpdate(Starchat.chatId, [number + "@s.whatsapp.net"], 'add');

            // if (response[number + "@c.us"] == 408) {
            //     client.sendMessage(
            //         Starchat.chatId,
            //         ADD.NO_24HR_BAN,
            //         MessageType.text
            //     ).catch(err => inputSanitization.handleError(err, client, Starchat));
            //     return;
            // } else if (response[number + "@c.us"] == 403) {
            //     for (const index in response.participants) {
            //         if ((number + "@c.us") in response.participants[index]) {
            //             var code = response.participants[index][number + "@c.us"].invite_code;
            //             var tom = response.participants[index][number + "@c.us"].invite_code_exp;
            //         }
            //     }
            //     var invite = {
            //         caption: "```Hi! You have been invited to join this WhatsApp group by Starchat!```\n\n🔗https://myStarchat.com",
            //         groupJid: Starchat.groupId,
            //         groupName: Starchat.groupName,
            //         inviteCode: code,
            //         inviteExpiration: tom,
            //         jpegThumbnail: fs.readFileSync('./images/Starchat_invite.jpeg')
            //     }
            //     await client.sendMessage(
            //         number + "@s.whatsapp.net",
            //         invite,
            //         MessageType.groupInviteMessage
            //     );
            //     client.sendMessage(
            //         Starchat.chatId,
            //         ADD.PRIVACY,
            //         MessageType.text
            //     ).catch(err => inputSanitization.handleError(err, client, Starchat));
            //     return;
            // } else if (response[number + "@c.us"] == 409) {
            //     client.sendMessage(
            //         Starchat.chatId,
            //         ADD.ALREADY_MEMBER,
            //         MessageType.text
            //     ).catch(err => inputSanitization.handleError(err, client, Starchat));
            //     return;
            // }
            client.sendMessage(
                Starchat.chatId,
                "```" + number + ADD.SUCCESS + "```",
                MessageType.text
            );
        } catch (err) {
            if (err.status == 400) {
                await inputSanitization.handleError(
                    err,
                    client,
                    Starchat,
                    ADD.NOT_ON_WHATSAPP
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
            }
            await inputSanitization.handleError(err, client, Starchat);
        }
        return;
    },
};
