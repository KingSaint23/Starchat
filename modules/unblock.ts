import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type"
import inputSanitization from "../sidekick/input-sanitization";
import Strings from "../lib/db";
const Reply = Strings.unblock;

module.exports = {
    name: "unblock",
    description: Reply.DESCRIPTION,
    extendedDescription: Reply.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try{
            if (!Starchat.isTextReply && typeof args[0] == "undefined") {
                client.sendMessage(
                    Starchat.chatId,
                    Reply.MESSAGE_NOT_TAGGED,
                    MessageType.text
                );
                return;
            }
            const reply = chat.message.extendedTextMessage;
            var contact = "";
            if (!(args.length > 0)) {
                contact = reply.contextInfo.participant.split("@")[0];
            } else {
                contact = await inputSanitization.getCleanedContact(
                    args,
                    client,
                    Starchat
                );
            }

            if (contact === Starchat.owner.split("@")[0]) {
                client.sendMessage(
                    Starchat.chatId,
                    Reply.NOT_UNBLOCK_BOT,
                    MessageType.text
                );
                return;
            }

            if(contact === ""){
                client.sendMessage(
                    Starchat.chatId,
                    Reply.MESSAGE_NOT_TAGGED,
                    MessageType.text
                );
                return;
            }
                var JID = contact + "@s.whatsapp.net";
                client.sock.updateBlockStatus(JID, "unblock");
                client.sendMessage(
                    Starchat.chatId,
                    "*" + contact + " unblocked successfully.*",
                    MessageType.text
                );

        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                Starchat,
                Reply.MESSAGE_NOT_TAGGED
            );
        }
    },
};