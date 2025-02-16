require('regenerator-runtime/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const msg = require('./translation');
const formatMessage = require('format-message');

const faceapi = require('face-api.js');
const tf = require('@tensorflow/tfjs');

const menuIconURI = `data:image/png;base64,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`;
const blockIconURI = menuIconURI;

const defaultId = 'default';
let theLocale = null;

class faceExpressionRecogintion{
    constructor(runtime) {
        theLocale = this._setLocale();
        this.runtime = runtime;
        // communication related
        this.comm = runtime.ioDevices.comm;
        this.session = null;
        this.runtime.registerPeripheralExtension('faceExpressionRecogintion', this);
        // session callbacks
        this.reporter = null;
        this.onmessage = this.onmessage.bind(this);
        this.onclose = this.onclose.bind(this);
        this.write = this.write.bind(this);

        this._initialized = false;
        this._detecting = false;
        this.facialEmotion = "";
        this.confidence = 0;
    }

    onclose() {
        this.session = null;
    }

    write(data, parser = null) {
        if (this.session) {
            return new Promise(resolve => {
                if (parser) {
                    this.reporter = {
                        parser,
                        resolve
                    };
                }
                this.session.write(data);
            });
        }
    }

    onmessage(data) {
        const dataStr = this.decoder.decode(data);
        this.lineBuffer += dataStr;
        if (this.lineBuffer.indexOf('\n') !== -1) {
            const lines = this.lineBuffer.split('\n');
            this.lineBuffer = lines.pop();
            for (const l of lines) {
                if (this.reporter) {
                    const { parser, resolve } = this.reporter;
                    resolve(parser(l));
                }
            }
        }
    }

    scan() {
        this.comm.getDeviceList().then(result => {
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
        });
    }

    _setLocale() {
        let nowLocale = '';
        switch (formatMessage.setup().locale) {
            case 'zh-tw':
                nowLocale = 'zh-tw';
                break;
            default:
                nowLocale = 'en';
                break;
        }
        return nowLocale;
    }

    getInfo() {
        theLocale = this._setLocale();
        return {
            id: 'faceExpressionRecogintion',
            name: msg.title[theLocale],
            color1: '#3AACFD',
            color2: '#3AACFD',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'videoToggle',
                    text: msg.videoToggle[theLocale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'video_menu',
                            defaultValue: 'off'
                        }
                    }
                },
                {
                    opcode: 'startFaceRecognition',
                    blockType: BlockType.COMMAND,
                    text: msg.startFaceRecognition[theLocale],
                },
                {
                    opcode: 'stopFaceRecognition',
                    blockType: BlockType.COMMAND,
                    text: msg.stopFaceRecognition[theLocale],
                },
                {
                    opcode: 'getFacialEmotion',
                    blockType: BlockType.REPORTER,
                    text: msg.facialEmotion[theLocale]
                },
                {
                    opcode: 'getConfidence',
                    blockType: BlockType.REPORTER,
                    text: msg.confidence[theLocale]
                }
            ],
            menus: {
                video_menu: this.getVideoMenu(),
            }
        };
    }

    getVideoMenu() {
        return [
            { text: msg.off[theLocale], value: 'off' },
            { text: msg.on[theLocale], value: 'on' },
            { text: msg.video_on_flipped[theLocale], value: 'on-flipped' }
        ];
    }

    videoToggle(args) {
        let state = args.VIDEO_STATE;
        if (state === 'off') {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo().then(() => {
                this.video = this.runtime.ioDevices.video.provider.video;
            });
            this.runtime.ioDevices.video.mirror = state === "on";
        }
    }

    setupTensorFlow() {
        return new Promise((resolve, reject) => {
            try {
                if (typeof tf === 'undefined') {
                    throw new Error('TensorFlow.js 未載入');
                }
                tf.setBackend('webgl').then(() => {
                    tf.ready().then(() => {
                        const backend = tf.getBackend();
                        if (backend !== 'webgl') {
                            throw new Error(`無法使用 WebGL 後端，目前使用: ${backend}`);
                        }
                        resolve();
                    });
                });
            } catch (error) {
                console.error('TensorFlow 設定失敗:', error);
                reject(error);
            }
        });
    }

    startVideo() {
        return new Promise((resolve, reject) => {
            this.video.width = 640;
            this.video.height = 480;
            navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' }
            }).then(stream => {
                this.video.srcObject = stream;
                this.video.onloadeddata = () => {
                    this.video.play();
                    resolve();
                };
            }).catch(error => {
                console.error('無法存取攝影機:', error);
                reject(error);
            });
        });
    }

    loadModels() {
        return new Promise((resolve, reject) => {
            console.log('開始載入模型...');
            const modelPath = './static/FERmodels/';
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
                faceapi.nets.faceExpressionNet.loadFromUri(modelPath)
            ]).then(() => {
                console.log('所有模型載入完成');
                resolve();
            }).catch(error => {
                console.error('模型載入失敗:', error);
                reject(error);
            });
        });
    }

    _initFaceRecognition() {
        return this.runtime.ioDevices.video.enableVideo().then(() => {
            this.video = this.runtime.ioDevices.video.provider.video;
            return this.setupTensorFlow();
        })
        .then(() => this.loadModels())
        .then(() => this.startVideo())
        .then(() => {
            this._initialized = true;
            console.log('初始化完成，開始進行臉部表情辨識...');
        });
    }

    startFaceRecognition() {
        if (!this._initialized) {
            this._initFaceRecognition().then(() => {
                this._detecting = true;
                this.detectEmotions();
            })
            .catch(error => {
                console.error('初始化失敗:', error);
            });
        } else {
            if (!this._detecting) {
                this._detecting = true;
                this.detectEmotions();
            }
        }
    }

    stopFaceRecognition() {
        this._detecting = false;
        this.facialEmotion = "已停止臉部表情辨識";
    }

    detectEmotions() {
        const detect = async () => {
            if (!this._detecting) return;
            try {
                if (this.video.readyState !== 4) {
                    requestAnimationFrame(detect);
                    return;
                }
                const options = new faceapi.TinyFaceDetectorOptions({
                    inputSize: 224,
                    scoreThreshold: 0.5
                });
                const detections = await faceapi
                    .detectAllFaces(this.video, options)
                    .withFaceExpressions();
                if (detections && detections.length > 0) {
                    const detection = detections[0];
                    if (detection && detection.expressions) {
                        const emotions = detection.expressions;
                        const emotionLabels = {
                            neutral: '平靜',
                            happy: '開心',
                            sad: '難過',
                            angry: '生氣',
                            fearful: '害怕',
                            disgusted: '厭惡',
                            surprised: '驚訝'
                        };
                        const mainEmotion = Object.entries(emotions)
                            .sort((a, b) => b[1] - a[1])[0];
                        const emotionName = emotionLabels[mainEmotion[0]] || mainEmotion[0];
                        const confidence = mainEmotion[1].toFixed(2);

                        this.facialEmotion = emotionName;
                        this.confidence = confidence;
                    }
                } else {
                    this.facialEmotion = "無法偵測到臉部";
                }
                if (this._detecting) {
                    requestAnimationFrame(detect);
                }
            } catch (error) {
                console.error('偵測錯誤:', error);
                if (this._detecting) {
                    requestAnimationFrame(detect);
                }
            }
        };
        detect();
    }

    getFacialEmotion(){
        return this.facialEmotion;
    }

    getConfidence(){
        return this.confidence;
    }
}

module.exports = faceExpressionRecogintion;
