import Greetings from "../database/greeting";
import inputSanitization from "../sidekick/input-sanitization";
import Strings from "../lib/db";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
const WELCOME = Strings.welcome;

module.exports = {
    name: "welcome",
    description: WELCOME.DESCRIPTION,
    extendedDescription: WELCOME.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [".welcome", ".welcome off", ".welcome delete"],
    },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            if (!Starchat.isGroup) {
                client.sendMessage(
                    Starchat.chatId,
                    WELCOME.NOT_A_GROUP,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            }
            await client.getGroupMetaData(Starchat.chatId, Starchat);
            var Msg: any = await Greetings.getMessage(Starchat.chatId, "welcome");
            if (args.length == 0) {
                var enabled = await Greetings.checkSettings(
                    Starchat.chatId,
                    "welcome"
                );
                try {
                    if (enabled === false || enabled === undefined) {
                        client.sendMessage(
                            Starchat.chatId,
                            WELCOME.SET_WELCOME_FIRST,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));
                        return;
                    } else if (enabled === "OFF") {
                        await client.sendMessage(
                            Starchat.chatId,
                            WELCOME.CURRENTLY_DISABLED,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));
                        await client.sendMessage(
                            Starchat.chatId,
                            Msg.message,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));
                        return;
                    }

                    await client.sendMessage(
                        Starchat.chatId,
                        WELCOME.CURRENTLY_ENABLED,
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, Starchat));
                    await client.sendMessage(
                        Starchat.chatId,
                        Msg.message,
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, Starchat));
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
                            WELCOME.GREETINGS_UNENABLED,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));
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
                            WELCOME.GREETINGS_ENABLED,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));

                        return;
                    }
                    if (args[0] === "delete") {
                        var Msg: any = await Greetings.deleteMessage(
                            Starchat.chatId,
                            "welcome"
                        );
                        if (Msg === false || Msg === undefined) {
                            client.sendMessage(
                                Starchat.chatId,
                                WELCOME.SET_WELCOME_FIRST,
                                MessageType.text
                            ).catch(err => inputSanitization.handleError(err, client, Starchat));
                            return;
                        }

                        await client.sendMessage(
                            Starchat.chatId,
                            WELCOME.WELCOME_DELETED,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));

                        return;
                    }
                    let text = Starchat.body.replace(
                        Starchat.body[0] + Starchat.commandName + " ",
                        ""
                    );
                    if (Msg === false || Msg === undefined) {
                        await Greetings.setWelcome(Starchat.chatId, text);
                        await client.sendMessage(
                            Starchat.chatId,
                            WELCOME.WELCOME_UPDATED,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));

                        return;
                    } else {
                        await Greetings.deleteMessage(
                            Starchat.chatId,
                            "welcome"
                        );
                        await Greetings.setWelcome(Starchat.chatId, text);
                        await client.sendMessage(
                            Starchat.chatId,
                            WELCOME.WELCOME_UPDATED,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));

                        return;
                    }
                } catch (err) {
                    throw err;
                }
            }
        } catch (err) {
            inputSanitization.handleError(err, client, Starchat);
            return;
        }
    },
};
