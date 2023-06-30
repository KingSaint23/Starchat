import chalk from 'chalk';
import config from '../config';
import { adminCommands, sudoCommands } from "../sidekick/input-sanitization"
import STRINGS from "../lib/db";
import Users from '../database/user';
import format from 'string-format';
import Starchat from '../sidekick/sidekick';
import { WASocket } from '@adiwajshing/baileys';
import Client from '../sidekick/client';
import { MessageType } from '../sidekick/message-type';

const GENERAL = STRINGS.general;

const clearance = async (Starchat: Starchat, client: Client, isBlacklist: boolean): Promise<boolean> => {
    if (isBlacklist) {
        if (Starchat.isGroup) {
            await client.getGroupMetaData(Starchat.chatId, Starchat);
            if ((!Starchat.fromMe && !Starchat.isSenderSUDO && !Starchat.isSenderGroupAdmin)) {
                return false;
            }
        } else if ((!Starchat.fromMe && !Starchat.isSenderSUDO)) {
            console.log(chalk.blueBright.bold(`[INFO] Blacklisted Chat or User.`));
            return false;
        }
    }
    else if ((Starchat.chatId === "917838204238-1634977991@g.us" || Starchat.chatId === "120363020858647962@g.us" || Starchat.chatId === "120363023294554225@g.us")) {
        console.log(chalk.blueBright.bold(`[INFO] Bot disabled in Support Groups.`));
        return false;
    }
    if (Starchat.isCmd && (!Starchat.fromMe && !Starchat.isSenderSUDO)) {
        if (config.WORK_TYPE.toLowerCase() === "public") {
            if (Starchat.isGroup) {
                await client.getGroupMetaData(Starchat.chatId, Starchat);
                if (adminCommands.indexOf(Starchat.commandName) >= 0 && !Starchat.isSenderGroupAdmin) {
                    console.log(
                        chalk.redBright.bold(`[INFO] admin commmand `),
                        chalk.greenBright.bold(`${Starchat.commandName}`),
                        chalk.redBright.bold(
                            `not executed in public Work Type.`
                        )
                    );
                    await client.sendMessage(
                        Starchat.chatId,
                        GENERAL.ADMIN_PERMISSION,
                        MessageType.text
                    );
                    return false;
                } else if (sudoCommands.indexOf(Starchat.commandName) >= 0 && !Starchat.isSenderSUDO) {
                    console.log(
                        chalk.redBright.bold(`[INFO] sudo commmand `),
                        chalk.greenBright.bold(`${Starchat.commandName}`),
                        chalk.redBright.bold(
                            `not executed in public Work Type.`
                        )
                    );
                    let messageSent: boolean = await Users.getUser(Starchat.chatId);
                    if (messageSent) {
                        console.log(chalk.blueBright.bold("[INFO] Promo message had already been sent to " + Starchat.chatId))
                        return false;
                    }
                    else {
                        await client.sendMessage(
                            Starchat.chatId,
                            format(GENERAL.SUDO_PERMISSION, { worktype: "public", groupName: Starchat.groupName ? Starchat.groupName : "private chat", commandName: Starchat.commandName }),
                            MessageType.text
                        );
                        await Users.addUser(Starchat.chatId);
                        return false;
                    }
                } else {
                    return true;
                }
            }else if(Starchat.isPm){
                return true;
            }
        } else if (config.WORK_TYPE.toLowerCase() != "public" && !Starchat.isSenderSUDO) {
            console.log(
                chalk.redBright.bold(`[INFO] commmand `),
                chalk.greenBright.bold(`${Starchat.commandName}`),
                chalk.redBright.bold(
                    `not executed in private Work Type.`
                )
            );
            //             let messageSent = await Users.getUser(Starchat.chatId);
            //             if(messageSent){
            //                 console.log(chalk.blueBright.bold("[INFO] Promo message had already been sent to " + Starchat.chatId))
            //                 return false;
            //             }
            //             else{
            //                 await client.sendMessage(
            //                     Starchat.chatId,
            //                     GENERAL.SUDO_PERMISSION.format({ worktype: "private", groupName: Starchat.groupName ? Starchat.groupName : "private chat", commandName: Starchat.commandName }),
            //                     MessageType.text,
            //                     {
            //                         contextInfo: {
            //                             stanzaId: Starchat.chatId,
            //                             participant: Starchat.sender,
            //                             quotedMessage: {
            //                                 conversation: Starchat.body,
            //                             },
            //                         },
            //                     }
            //                 );
            //                 await Users.addUser(Starchat.chatId)
            //                 return false;
            //             }
        }
    } else {
        return true;
    }
}

export = clearance;