// Disabled till fix can be found.

// const { MessageType } = require("@adiwajshing/baileys");
// const inputSanitization = require("../sidekick/input-sanitization");
// const String = require("../lib/db.js");
// const got = require("got");
// const REPLY = String.neko;
// module.exports = {
//     name: "neko",
//     description: REPLY.DESCRIPTION,
//     extendedDescription: REPLY.EXTENDED_DESCRIPTION,
//     demo: {
//         isEnabled: true,
//         text: '.neko #include <iostream> \nint main() \n{\n   std::cout << "Hello Starchat!"; \n   return 0;\n}',
//     },
//     async handle(client, chat, Starchat, args) {
//         try {
//             if (args.length === 0 && !Starchat.isReply) {
//                 await client.sendMessage(
//                     Starchat.chatId,
//                     REPLY.ENTER_TEXT,
//                     MessageType.text
//                 ).catch(err => inputSanitization.handleError(err, client, Starchat));
//                 return;
//             }
//             const processing = await client.sendMessage(
//                 Starchat.chatId,
//                 REPLY.PROCESSING,
//                 MessageType.text
//             ).catch(err => inputSanitization.handleError(err, client, Starchat));
//             if (!Starchat.isReply) {
//                 var json = {
//                     content: Starchat.body.replace(
//                         Starchat.body[0] + Starchat.commandName + " ",
//                         ""
//                     ),
//                 };
//             } else {
//                 var json = {
//                     content: Starchat.replyMessage.replace(
//                         Starchat.body[0] + Starchat.commandName + " ",
//                         ""
//                     ),
//                 };
//             }
//             let text = await got.post("https://nekobin.com/api/documents", {
//                 json,
//             });
//             json = JSON.parse(text.body);
//             neko_url = "https://nekobin.com/" + json.result.key;
//             client.sendMessage(Starchat.chatId, neko_url, MessageType.text).catch(err => inputSanitization.handleError(err, client, Starchat));
//             return await client.deleteMessage(Starchat.chatId, {
//                 id: processing.key.id,
//                 remoteJid: Starchat.chatId,
//                 fromMe: true,
//             }).catch(err => inputSanitization.handleError(err, client, Starchat));
//         } catch (err) {
//             if (json.result == undefined) {
//                 await inputSanitization.handleError(
//                     err,
//                     client,
//                     Starchat,
//                     REPLY.TRY_LATER
//                 );
//             } else {
//                 await inputSanitization.handleError(err, client, Starchat);
//             }
//             return await client.deleteMessage(Starchat.chatId, {
//                 id: processing.key.id,
//                 remoteJid: Starchat.chatId,
//                 fromMe: true,
//             }).catch(err => inputSanitization.handleError(err, client, Starchat));
//         }
//     },
// };
