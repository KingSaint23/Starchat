import inputSanitization from "../sidekick/input-sanitization";
import STRINGS from "../lib/db";
import got, {Response} from "got";
import Client from "../sidekick/client.js";
import Starchat from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import { proto } from "@adiwajshing/baileys";

module.exports = {
    name: "github",
    description: STRINGS.github.DESCRIPTION,
    extendedDescription: STRINGS.github.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".github KingSaint23" },
    async handle(client: Client, chat: proto.IWebMessageInfo, Starchat: Starchat, args: string[]): Promise<void> {
        try {
            let user_name: string = "";
            if (Starchat.isTextReply) {
                user_name = Starchat.replyMessage;
            } else {
                if (args.length == 0) {
                    client.sendMessage(
                        Starchat.chatId,
                        STRINGS.github.NO_ARG_ERROR,
                        MessageType.text
                    );
                    return;
                }
                user_name = args[0];
            }
            var fetching: proto.WebMessageInfo = await client.sendMessage(
                Starchat.chatId,
                STRINGS.github.FETCHING,
                MessageType.text
            );
            let userResponse: Response<string> = await got(
                "https://api.github.com/users/" + user_name
            );
            let user: any = JSON.parse(userResponse.body);
            Object.keys(user).forEach(function (key) {
                if (user[key] === null || user[key] === "") {
                    user[key] = "N/A";
                }
            });
            let caption: string =
                "*👤 Name :* " +
                user.name +
                "\n*💻 Link :* " +
                user.html_url +
                "\n*🔧 Type :* " +
                user.type +
                "\n*🏢 Company :* " +
                user.company +
                "\n*🔭 Blog :* " +
                user.blog +
                "\n*📍 Location :* " +
                user.location +
                "\n*📝 Bio :* " +
                user.bio +
                "\n*❤️ Followers :* " +
                user.followers +
                "\n*👁️ Following :* " +
                user.following +
                "\n*📊 Public Repos :* " +
                user.public_repos +
                "\n*📄 Public Gists :* " +
                user.public_gists +
                "\n*🔗 Profile Created :* " +
                user.created_at +
                "\n*✏️ Profile Updated :* " +
                user.updated_at;
            if (user.public_repos > 0) {
                let reposResponse: Response<string> = await got(user.repos_url);
                let reposData: any = JSON.parse(reposResponse.body);
                let repos: string = reposData[0].name;
                for (let i = 1; i < reposData.length && i < 5; i++) {
                    repos += " | " + reposData[i].name;
                }
                caption += "\n*🔍 Some Repos :* " + repos;
            }
            try {
                await client.sendMessage(
                    Starchat.chatId,
                    {
                        url: user.avatar_url,
                    },
                    MessageType.image,
                    {
                        caption: caption,
                    }
                );
            } catch (err) {
                client.sendMessage(Starchat.chatId, caption, MessageType.text);
            }
            return await client.deleteMessage(Starchat.chatId, {
                id: fetching.key.id,
                remoteJid: Starchat.chatId,
                fromMe: true,
            });
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                Starchat,
                STRINGS.github.ERROR_MSG
            );
            return await client.deleteMessage(Starchat.chatId, {
                id: fetching.key.id,
                remoteJid: Starchat.chatId,
                fromMe: true,
            });
        }
    },
};
