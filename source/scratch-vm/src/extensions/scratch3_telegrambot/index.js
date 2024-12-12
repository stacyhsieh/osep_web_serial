/*
This is the Scratch 3 extension to remotely control an
MQTT
 */
// Boiler plate from the Scratch Team

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const msg = require('./translation');

const { locale } = require('core-js');
require('sweetalert');
//async await estea
const ml5 = require('ml5');
//const jqueryMin = require("./jquery.min.js");
//require('babel-polyfill');
//參考文件https://blog.sean.taipei/2016/10/telegram-bot
let the_locale = null;

class Scratch3TelegramBot {
    constructor(runtime) {
        the_locale = this._setLocale();
        this.runtime = runtime;
        this.payload ={
            token:'',
            message:'',
            imageFile:'',
            chat_id : '',
            stickerPackageId : ''
        };
        this.exec = 'https://script.google.com/macros/s/AKfycbyPMsaLgEEcia39_vcK1AmSGfpAi2YViAUcZFMbmKdYJ5niqDVui9Rgb4241Zdwca5d/exec';
    }

    getInfo() {
        the_locale = this._setLocale();
        return {
            id: 'telegrambot',
            color1: '#336600', //'#0C5986',
            color2: '#FFFFFF',
            name: 'Telegram Bot',
            blockIconURI: 'data:image/png;base64,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',
            blocks: [
                //https://unicode.org/emoji/charts/full-emoji-list.html
                {
                    opcode: 'checkOut',
                    blockType: BlockType.COMMAND,
                    text: msg.checkOut[the_locale],
                },
                {
                    opcode: 'gettoken',
                    blockType: BlockType.COMMAND,
                    text: msg.Token[the_locale],
                    arguments: {
                        TOKEN: {
                            type: ArgumentType.STRING,
                            defaultValue: ' ',
                            //defaultValue: 'ws://broker.emqx.io:8083/mqtt'
                        }
                    },
                },
                {
                    opcode: 'get_chat_id',
                    blockType: BlockType.COMMAND,
                    text: msg.chat_id[the_locale],
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: ' ',
                        },
                        
                    },
                },
                {
                    opcode: 'sendimagefile',
                    blockType: BlockType.COMMAND,
                    text: msg.SendImageFile[the_locale],
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://.png',
                        }
                    },
                },
                {
                    opcode: 'sendmessage',
                    blockType: BlockType.COMMAND,
                    text: msg.SendMessage[the_locale],
                    arguments: {
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: ' ',
                        }
                    },
                },
                /*                
                {
                    opcode: 'sendstickerId',
                    blockType: BlockType.COMMAND,
                    text: msg.SendstickerId[the_locale],
                    arguments: {
                        STICKERId: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                        },
                        StickerPackageId:{
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                        }
                    },
                },*/
                
            ],

        };
    }

    // command blocks
    checkOut(){
        window.open('https://unicode.org/emoji/charts/full-emoji-list.html');
    }

    get_chat_id(args){
        this.payload.chat_id=args.ID;
    }

    gettoken(args){
        this.payload.token = args.TOKEN;
        console.log(this.payload.token);
    }

    async sendmessage(args){
        try {
            this.payload.message = args.MESSAGE;
            console.log('Sending message:', this.payload);
            
            const response = await fetch(
                `https://api.telegram.org/bot${this.payload.token}/sendMessage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: this.payload.chat_id,
                        text: this.payload.message
                    })
                }
            );

            const result = await response.json();
            console.log('API Response:', result);

            if (!result.ok) {
                console.error('Telegram API Error:', result.description);
                return;
            }

            // 成功發送後再清空
            this.payload.message = '';
            this.payload.imageFile = '';
            
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
    
    async sendimagefile(args) {
        try {
            this.payload.imageFile = args.URL;
            console.log('Sending image:', this.payload);
            
            const response = await fetch(
                `https://api.telegram.org/bot${this.payload.token}/sendPhoto`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: this.payload.chat_id,
                        photo: this.payload.imageFile,  // 直接使用圖片URL
                        caption: '圖片來自Scratch'  // 可選的圖片說明
                    })
                }
            );

            const result = await response.json();
            console.log('API Response:', result);

            if (!result.ok) {
                console.error('Telegram API Error:', result.description);
                return;
            }

            // 成功發送後清空圖片URL
            this.payload.imageFile = '';
            
        } catch (error) {
            console.error('Error sending image:', error);
        }
    }

    async sendstickerId(args){
        this.payload.stickerID = args.STICKERId;
        this.payload.stickerPackageId = args.StickerPackageId;
    } 
    // end of block handlers

    _setLocale() {
        let now_locale = '';
        switch (formatMessage.setup().locale) {
            case 'zh-tw':
                now_locale = 'zh-tw';
                break;
            default:
                now_locale = 'en';
                break;
        }
        return now_locale;
    }

    // helpers

}

module.exports = Scratch3TelegramBot;
