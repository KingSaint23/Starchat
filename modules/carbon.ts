import chalk from "chalk";
import String from "../lib/db.js";
import * as Carbon from "unofficial-carbon-now";
import inputSanitization from "../sidekick/input-sanitization";
import format from "string-format";
import Client from "../sidekick/client.js";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import { proto } from "@adiwajshing/baileys";

const CARBON = String.carbon;

module.exports = {
    name: "carbon",
    description: CARBON.DESCRIPTION,
    extendedDescription: CARBON.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".carbon Hi! Welcome to Starchat.",
            '.carbon #include <iostream> \nint main() \n{\n   std::cout << "Hello Starchat!"; \n   return 0;\n} -t yeti',
            ".carbon -t",
        ],
    },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            let themes: string[] = [
                "3024 night",
                "a11y dark",
                "blackboard",
                "base 16 (dark)",
                "base 16 (light)",
                "cobalt",
                "duotone",
                "hopscotch",
                "lucario",
                "material",
                "monokai",
                "night owl",
                "nord",
                "oceanic next",
                "one light",
                "one dark",
                "panda",
                "paraiso",
                "seti",
                "shades of purple",
                "solarized (dark)",
                "solarized (light)",
                "synthwave '84",
                "twilight",
                "verminal",
                "vscode",
                "yeti",
                "zenburn",
            ];
            let code: string = "";
            let themeInput: string;
            if (args[0] == null && !Starchat.isTextReply) {
                await client.sendMessage(
                    Starchat.chatId,
                    CARBON.NO_INPUT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            } else if (Starchat.isTextReply && !Starchat.replyMessage) {
                await client.sendMessage(
                    Starchat.chatId,
                    CARBON.INVALID_REPLY,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return;
            } else if (Starchat.isTextReply) {
                code = Starchat.replyMessage;
                themeInput = themes[Math.floor(Math.random() * themes.length)];
            } else {
                try {
                    let text: string = Starchat.body.replace(
                        Starchat.body[0] + Starchat.commandName + " ",
                        ""
                    );
                    if (text[0] === "-" && text[1] === "t") {
                        if(text[2] == null){
                            let counter: number = 1;
                            let message: string = 'Available themes: ';
                            themes.forEach((theme) => {
                                message += `\n${counter}. ${theme}`;
                                counter += 1;
                            })
                            await client.sendMessage(
                                Starchat.chatId,
                                "```" + message + "```",
                                MessageType.text
                            )
                            return;
                        }
                        else{
                            await client.sendMessage(
                                Starchat.chatId,
                                CARBON.NO_INPUT,
                                MessageType.text
                            ).catch(err => inputSanitization.handleError(err, client, Starchat));
                            return;
                        }
                    }
                    let body: string[] = Starchat.body.split("-t");
                    code = body[0].replace(
                        Starchat.body[0] + Starchat.commandName + " ",
                        ""
                    );
                    themeInput = body[1].substring(1);
                    if (!themes.includes(themeInput)) {
                        await client.sendMessage(
                            Starchat.chatId,
                            CARBON.INVALID_THEME,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, Starchat));
                        return;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {
                        code = Starchat.body.replace(
                            Starchat.body[0] + Starchat.commandName + " ",
                            ""
                        );
                        themeInput =
                            themes[Math.floor(Math.random() * themes.length)];
                    }
                }
            }
            try {
                const processing: proto.WebMessageInfo = await client.sendMessage(
                    Starchat.chatId,
                    CARBON.CARBONIZING,
                    MessageType.text
                );
                const carbon = new Carbon.createCarbon()
                    .setCode(code)
                    .setPrettify(true)
                    .setTheme(themeInput);
                const output = await Carbon.generateCarbon(carbon);
                await client.sendMessage(
                    Starchat.chatId,
                    output,
                    MessageType.image,
                    {
                        caption: format(CARBON.OUTPUT, themeInput),
                    }
                ).catch(err => inputSanitization.handleError(err, client, Starchat));
                return await client.deleteMessage(Starchat.chatId, {
                    id: processing.key.id,
                    remoteJid: Starchat.chatId,
                    fromMe: true,
                });
            } catch (err) {
                throw err;
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, Starchat);
        }
    },
};
