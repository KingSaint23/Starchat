import Strings from "../lib/db";
import format from "string-format";
import inputSanitization from "../sidekick/input-sanitization";
import Blacklist from "../database/blacklist";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
const rbl = Strings.rbl;

module.exports = {
    name: "rbl",
    description: rbl.DESCRIPTION,
    extendedDescription: rbl.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".rbl" },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            if (Starchat.isPm && Starchat.fromMe) {
                let PersonToRemoveFromBlacklist = Starchat.chatId;
                if (!(await Blacklist.getBlacklistUser(PersonToRemoveFromBlacklist, ""))) {
                    client.sendMessage(
                        Starchat.chatId,
                        format(rbl.NOT_IN_BLACKLIST, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                        MessageType.text
                    );
                    return;
                }
                Blacklist.removeBlacklistUser(PersonToRemoveFromBlacklist, "");
                client.sendMessage(
                    Starchat.chatId,
                    format(rbl.PM_ACKNOWLEDGEMENT, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                    MessageType.text
                );
                return;
            } else {
                await client.getGroupMetaData(Starchat.chatId, Starchat);
                if (args.length > 0) {
                    let PersonToRemoveFromBlacklist =
                        await inputSanitization.getCleanedContact(
                            args,
                            client,
                            Starchat
                        );

                    if (PersonToRemoveFromBlacklist === undefined) return;
                    PersonToRemoveFromBlacklist += "@s.whatsapp.net";
                    if (
                        !(await Blacklist.getBlacklistUser(
                            PersonToRemoveFromBlacklist,
                            Starchat.chatId
                        ))
                    ) {
                        client.sendMessage(
                            Starchat.chatId,
                            format(rbl.NOT_IN_BLACKLIST, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                            MessageType.text
                        );
                        return;
                    }
                    Blacklist.removeBlacklistUser(
                        PersonToRemoveFromBlacklist,
                        Starchat.chatId
                    );
                    client.sendMessage(
                        Starchat.chatId,
                        format(rbl.GRP_ACKNOWLEDGEMENT, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                        MessageType.text
                    );
                    return;
                } else if (Starchat.isTextReply) {
                    let PersonToRemoveFromBlacklist = Starchat.replyParticipant;
                    if (
                        !(await Blacklist.getBlacklistUser(
                            PersonToRemoveFromBlacklist,
                            Starchat.chatId
                        ))
                    ) {
                        client.sendMessage(
                            Starchat.chatId,
                            format(rbl.NOT_IN_BLACKLIST, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                            MessageType.text
                        );
                        return;
                    }
                    Blacklist.removeBlacklistUser(
                        PersonToRemoveFromBlacklist,
                        Starchat.chatId
                    );
                    client.sendMessage(
                        Starchat.chatId,
                        format(rbl.GRP_ACKNOWLEDGEMENT, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                        MessageType.text
                    );
                    return;
                } else {
                    if (
                        !(await Blacklist.getBlacklistUser("", Starchat.chatId))
                    ) {
                        client.sendMessage(
                            Starchat.chatId,
                            format(rbl.NOT_IN_BLACKLIST, Starchat.groupName),
                            MessageType.text
                        );
                        return;
                    }
                    Blacklist.removeBlacklistUser("", Starchat.chatId);
                    client.sendMessage(
                        Starchat.chatId,
                        format(rbl.GRP_BAN, Starchat.groupName),
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
