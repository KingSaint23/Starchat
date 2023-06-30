import fs from 'fs'
import config from '../config'
import chalk from 'chalk'
import StarchatClass from '../sidekick/sidekick'
import { Contact, GroupMetadata, GroupParticipant, proto, WASocket } from '@adiwajshing/baileys'


const resolve = async function (messageInstance: proto.IWebMessageInfo, client: WASocket) {
    var Starchat: StarchatClass = new StarchatClass();
    var prefix: string = config.PREFIX + '\\w+'
    var prefixRegex: RegExp = new RegExp(prefix, 'g');
    var SUDOstring: string = config.SUDO;
    try {
        var jsonMessage: string = JSON.stringify(messageInstance);
    } catch (err) {
        console.log(chalk.redBright("[ERROR] Something went wrong. ", err))
    }
    Starchat.chatId = messageInstance.key.remoteJid;
    Starchat.fromMe = messageInstance.key.fromMe;
    Starchat.owner = client.user.id.replace(/:.*@/g, '@');
    Starchat.mimeType = messageInstance.message ? (Object.keys(messageInstance.message)[0] === 'senderKeyDistributionMessage' ? Object.keys(messageInstance.message)[2] : (Object.keys(messageInstance.message)[0] === 'messageContextInfo' ? Object.keys(messageInstance.message)[1] : Object.keys(messageInstance.message)[0])) : null;
    Starchat.type = Starchat.mimeType === 'imageMessage' ? 'image' : (Starchat.mimeType === 'videoMessage') ? 'video' : (Starchat.mimeType === 'conversation' || Starchat.mimeType == 'extendedTextMessage') ? 'text' : (Starchat.mimeType === 'audioMessage') ? 'audio' : (Starchat.mimeType === 'stickerMessage') ? 'sticker' : (Starchat.mimeType === 'senderKeyDistributionMessage' && messageInstance.message?.senderKeyDistributionMessage?.groupId === 'status@broadcast') ? 'status' : null;
    Starchat.isTextReply = (Starchat.mimeType === 'extendedTextMessage' && messageInstance.message?.extendedTextMessage?.contextInfo?.stanzaId) ? true : false;
    Starchat.replyMessageId = messageInstance.message?.extendedTextMessage?.contextInfo?.stanzaId;
    Starchat.replyParticipant = messageInstance.message?.extendedTextMessage?.contextInfo?.participant.replace(/:.*@/g, '@');;
    Starchat.replyMessage = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
    Starchat.body = Starchat.mimeType === 'conversation' ? messageInstance.message?.conversation : (Starchat.mimeType == 'imageMessage') ? messageInstance.message?.imageMessage.caption : (Starchat.mimeType == 'videoMessage') ? messageInstance.message?.videoMessage.caption : (Starchat.mimeType == 'extendedTextMessage') ? messageInstance.message?.extendedTextMessage?.text : (Starchat.mimeType == 'buttonsResponseMessage') ? messageInstance.message?.buttonsResponseMessage.selectedDisplayText : null;
    Starchat.isCmd = prefixRegex.test(Starchat.body);
    Starchat.commandName = Starchat.isCmd ? Starchat.body.slice(1).trim().split(/ +/).shift().toLowerCase().split('\n')[0] : null;
    Starchat.isImage = Starchat.type === "image";
    Starchat.isReplyImage = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ? true : false;
    Starchat.imageCaption = Starchat.isImage ? messageInstance.message?.imageMessage.caption : null;
    Starchat.isGIF = (Starchat.type === 'video' && messageInstance.message?.videoMessage?.gifPlayback);
    Starchat.isReplyGIF = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.gifPlayback ? true : false;
    Starchat.isSticker = Starchat.type === 'sticker';
    Starchat.isReplySticker = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage ? true : false;
    Starchat.isReplyAnimatedSticker = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage?.isAnimated;
    Starchat.isVideo = (Starchat.type === 'video' && !messageInstance.message?.videoMessage?.gifPlayback);
    Starchat.isReplyVideo = Starchat.isTextReply ? (jsonMessage.indexOf("videoMessage") !== -1 && !messageInstance.message?.extendedTextMessage?.contextInfo.quotedMessage.videoMessage.gifPlayback) : false;
    Starchat.isAudio = Starchat.type === 'audio';
    Starchat.isReplyAudio = messageInstance.message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage ? true : false;
    Starchat.logGroup = client.user.id.replace(/:.*@/g, '@');;
    Starchat.isGroup = Starchat.chatId.endsWith('@g.us');
    Starchat.isPm = !Starchat.isGroup;
    Starchat.sender = (Starchat.isGroup && messageInstance.message && Starchat.fromMe) ? Starchat.owner : (Starchat.isGroup && messageInstance.message) ? messageInstance.key.participant.replace(/:.*@/g, '@') : (!Starchat.isGroup) ? Starchat.chatId : null;
    Starchat.isSenderSUDO = SUDOstring.includes(Starchat.sender?.substring(0, Starchat.sender.indexOf("@")));

    return Starchat;
}

export = resolve;