import Strings from "../lib/db";
import format from "string-format";
import inputSanitization from "../sidekick/input-sanitization";
import Blacklist from "../database/blacklist";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
const abl = Strings.abl;

module.exports = {
    name: "abl",
    description: abl.DESCRIPTION,
    extendedDescription: abl.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".abl" },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            if (Starchat.isPm && Starchat.fromMe) {
                let PersonToBlacklist = Starchat.chatId;
                Blacklist.addBlacklistUser(PersonToBlacklist, "");
                client.sendMessage(
                    Starchat.chatId,
                    format(abl.PM_ACKNOWLEDGEMENT, PersonToBlacklist.substring(0, PersonToBlacklist.indexOf("@"))),
                    MessageType.text
                );
                return;
            } else {
                await client.getGroupMetaData(Starchat.chatId, Starchat);
                if (args.length > 0) {
                    let PersonToBlacklist = await inputSanitization.getCleanedContact(
                        args,
                        client,
                        Starchat);
                    if (PersonToBlacklist === undefined) return;
                    PersonToBlacklist += "@s.whatsapp.net";
                    if (Starchat.owner === PersonToBlacklist) {
                        client.sendMessage(
                            Starchat.chatId,
                            abl.CAN_NOT_BLACKLIST_BOT,
                            MessageType.text
                        );
                        return;
                    }
                    Blacklist.addBlacklistUser(
                        PersonToBlacklist,
                        Starchat.chatId
                    );
                    client.sendMessage(
                        Starchat.chatId,
                        format(abl.GRP_ACKNOWLEDGEMENT, PersonToBlacklist.substring(0, PersonToBlacklist.indexOf("@"))),
                        MessageType.text
                    );
                    return;
                } else if (Starchat.isTextReply) {
                    let PersonToBlacklist = Starchat.replyParticipant;
                    if (Starchat.owner === PersonToBlacklist) {
                        client.sendMessage(
                            Starchat.chatId,
                            abl.CAN_NOT_BLACKLIST_BOT,
                            MessageType.text
                        );
                        return;
                    }
                    Blacklist.addBlacklistUser(
                        PersonToBlacklist,
                        Starchat.chatId
                    );
                    client.sendMessage(
                        Starchat.chatId,
                        format(abl.GRP_ACKNOWLEDGEMENT, PersonToBlacklist.substring(0, PersonToBlacklist.indexOf("@"))),
                        MessageType.text
                    );
                    return;
                } else {
                    Blacklist.addBlacklistUser("", Starchat.chatId);
                    client.sendMessage(
                        Starchat.chatId,
                        format(abl.GRP_BAN, Starchat.groupName),
                        MessageType.text
                    );
                    return;
                }
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, Starchat);
        }
    },
};
