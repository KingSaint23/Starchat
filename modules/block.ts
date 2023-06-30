import Strings from "../lib/db";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type"
import inputSanitization from "../sidekick/input-sanitization";
const Reply = Strings.block;

module.exports = {
    name: "block",
    description: Reply.DESCRIPTION,
    extendedDescription: Reply.EXTENDED_DESCRIPTION,
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            const reply: proto.Message.IExtendedTextMessage = chat.message.extendedTextMessage;
            var contact: string = "";
            if(args.length == 0 && !Starchat.isTextReply){
                client.sendMessage(
                    Starchat.chatId,
                    Reply.MESSAGE_NOT_TAGGED,
                    MessageType.text
                );
                return;
            }

            if (!(args.length > 0) && Starchat.isTextReply) {
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
                    Reply.NOT_BLOCK_BOT,
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
            var JID: string = contact + "@s.whatsapp.net";
            client.sock.updateBlockStatus(JID, "block");
            client.sendMessage(
                Starchat.chatId,
                "*" + contact + " blocked successfully.*",
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
