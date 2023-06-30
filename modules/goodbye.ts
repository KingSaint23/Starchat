import Strings from "../lib/db";
import inputSanitization from "../sidekick/input-sanitization";
import Greetings from "../database/greeting";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
const GOODBYE = Strings.goodbye;

module.exports = {
    name: "goodbye",
    description: GOODBYE.DESCRIPTION,
    extendedDescription: GOODBYE.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [".goodbye", ".goodbye off", ".goodbye delete"],
    },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            if (!Starchat.isGroup) {
                client.sendMessage(
                    Starchat.chatId,
                    GOODBYE.NOT_A_GROUP,
                    MessageType.text
                );
                return;
            }
            if (args.length == 0) {
                await client.getGroupMetaData(Starchat.chatId, Starchat);
                var Msg: any = await Greetings.getMessage(Starchat.chatId, "goodbye");
                try {
                    var enabled = await Greetings.checkSettings(
                        Starchat.chatId,
                        "goodbye"
                    );
                    if (enabled === false || enabled === undefined) {
                        client.sendMessage(
                            Starchat.chatId,
                            GOODBYE.SET_GOODBYE_FIRST,
                            MessageType.text
                        );
                        return;
                    } else if (enabled === "OFF") {
                        await client.sendMessage(
                            Starchat.chatId,
                            GOODBYE.CURRENTLY_DISABLED,
                            MessageType.text
                        );
                        await client.sendMessage(
                            Starchat.chatId,
                            Msg.message,
                            MessageType.text
                        );
                        return;
                    }

                    await client.sendMessage(
                        Starchat.chatId,
                        GOODBYE.CURRENTLY_ENABLED,
                        MessageType.text
                    );
                    await client.sendMessage(
                        Starchat.chatId,
                        Msg.message,
                        MessageType.text
                    );
                } catch (err) {
                    throw err;
                }
            } else {
                try {
                    if (
                        args[0] === "OFF" ||
                        args[0] === "off" ||
                        args[0] === "Off"
                    ) {
                        let switched = "OFF";
                        await Greetings.changeSettings(
                            Starchat.chatId,
                            switched
                        );
                        client.sendMessage(
                            Starchat.chatId,
                            GOODBYE.GREETINGS_UNENABLED,
                            MessageType.text
                        );
                        return;
                    }
                    if (
                        args[0] === "ON" ||
                        args[0] === "on" ||
                        args[0] === "On"
                    ) {
                        let switched = "ON";
                        await Greetings.changeSettings(
                            Starchat.chatId,
                            switched
                        );
                        client.sendMessage(
                            Starchat.chatId,
                            GOODBYE.GREETINGS_ENABLED,
                            MessageType.text
                        );
                        return;
                    }
                    if (args[0] === "delete") {
                        var Msg: any = await Greetings.deleteMessage(
                            Starchat.chatId,
                            "goodbye"
                        );
                        if (Msg === false || Msg === undefined) {
                            client.sendMessage(
                                Starchat.chatId,
                                GOODBYE.SET_GOODBYE_FIRST,
                                MessageType.text
                            );
                            return;
                        }
                        await client.sendMessage(
                            Starchat.chatId,
                            GOODBYE.GOODBYE_DELETED,
                            MessageType.text
                        );

                        return;
                    }
                    let text = Starchat.body.replace(
                        Starchat.body[0] + Starchat.commandName + " ",
                        ""
                    );

                    var Msg: any = await Greetings.getMessage(
                        Starchat.chatId,
                        "goodbye"
                    );
                    if (Msg === false || Msg === undefined) {
                        await Greetings.setGoodbye(Starchat.chatId, text);
                        await client.sendMessage(
                            Starchat.chatId,
                            GOODBYE.GOODBYE_UPDATED,
                            MessageType.text
                        );

                        return;
                    } else {
                        await Greetings.deleteMessage(
                            Starchat.chatId,
                            "goodbye"
                        );
                        await Greetings.setGoodbye(Starchat.chatId, text);
                        await client.sendMessage(
                            Starchat.chatId,
                            GOODBYE.GOODBYE_UPDATED,
                            MessageType.text
                        );
                        return;
                    }
                } catch (err) {
                    throw err;
                }
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, Starchat);
        }
    },
};
