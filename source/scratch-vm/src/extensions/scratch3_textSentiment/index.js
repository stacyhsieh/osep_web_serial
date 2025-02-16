const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const msg = require('./translation');
const formatMessage = require('format-message');
const fetchWithTimeout = require('../../util/fetch-with-timeout');

const ml5 = require('ml5');

const menuIconURI = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADPgAAAz4Bpn7PwAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA/wSURBVHic7Z1/sBxVlcc/5yVEfsQg7hIlRBOKXyEUBaImCGJesKIGiWEX2ey6VYvrblFQ/uAPkNJStBBKBX8VIoKwK+WumC3YtcjD4CK78tiIgaBb4kswEC0IgRcxyg8lSn4e/zi3k+47PTM9Mz19u2f6W3XrzdzXfe855565P889R1SVskBE5gJHArNiyf8uwK+BrbG/8c9PqupjBZNeWUhIBRCRA4BRYLlLs3MqejPwPeAuYFxVd+RU7sChcAUQkRnAUuBc9/fQPlf5EnAvphCrVfXZPtdXKRSmACJyHnAh9oufVkiljVBgHLhSVe8PREOp0HcFEJEzgWuB0zI8/jwwAUy6tDX2OUoARzRJR7p6Ds5Q173AJ1V1XVZeBhKq2pcEzAfGsF9dq/QUcD3wdmBqDvUeCJwN3OjKblf/KuDkfsmh7Cn3HkBEZgFXAv8ITGny2HrgTuBOVf1prgQ00nMysMylBU0eU+AO4FNDt4LI8Rc/Anwa2E7zX9vtwLxQ2g4sBH7Qgr4dwEWhf5WFyiQnwc4AVrcQ7DiwIDSzMXoXAWta0Pst4KDQdFZCAYCjgQ1NBLkeOCc0ky1ofyfwcBPaHwGOCU1jqRUAWAz8LkV4k8AHgCmhGczIx98CL6Tw8QKwPDR9pVQA4GJgV4rQfgTMDM1YF/wcA/wshZ+9wOeAkdA0lkIBgKnADU26zX8FpoVmqgclOAi4tQlvN4amrywKkNb4u4FLQjOToyL8M/CnFD4/EZq2oArgun1fKM8BS0Iz0gcleAPwRAq/7w9NW54p80aQiCzG1tBTY9m/BM5W1U2ZCqkYRORo4MfAzFj2bmCZqv53GKryRSYFcIJYB7w6lv08sHBQGz+CiLwZ28eIny9sB0ZV9SdBiMoRI+0ecMe3YyQbfw+wYtAbH0BVH8aWiXti2YcAq90Po9JoqQAiMgKsxA524rhUVe/tG1Ulg6reBXzIy54JfFtEJABJuaFdD3AFdrIWxzdV9bo+0VNaqOpN2H5AHKdhh16VRdM5gDvV20Ry7HsAOEtVdxZAW+ngfu2rsJPFCNuA41X1+TBU9YZWPcCVJBt/K/DXw9r4AGq/lg8Df4xlHw5cFYai3pGqACIyn8au7ZOq+pv+k1RuqOpm4Gov+yIROSUEPb0idQgQkTGS3dwGzGpmT8PDQwgRmQb8HDg+lv1j4K2adWOlJGjoAZwN3zIv+2N14++HGwY/6GWfDlwQgJye0NADiMhakgac96vqaJFEVQUi8h/AiljW46p6fLPny4iEAjjT7f/0nlmow2452wRNVkqnq+raQCR1DH8IuND7fkfd+M2hqpPAd73sSg0D+3oAt+W7jeSljRNUdWMIwqoCEVmCHZJFeAF4rVbkOlq8B1hKsvHX142fCf8LPBP7/irsnmMlEFeAc73/3VkkIVWFqu4FbvOyKzMMiKpGt3S3kbyo+Sbt86WNQYGInIhZQEfYA8xW1V8HIikzoh5glGTjb6kbPztUdQPw/7GsKcDfBSKnI0QK4I9Zq4omZADwbe/7wiBUdIhmClCP/53DX/v7NhSlhABzMePHCM9jdv27g1BUUYjIodgSMMJO4OCyb6GPYHfq45ioG79zqOqLJJeD07Brc6XGCOZ4KY7JtAdrZMKj3vfSDwO1AuSLgVCArSEIGRD4CnBiECo6wFQa5wC59QAiMgf4PHYfH+B+zLZgc151FElPBj+Gr/NeWSoi15D0cfSMqj7ZCx9544ckrz6N5nS1ag7Nr1zPKfoKVDf0AAcAS4CvAVtS3u02bXFlLgEOKFoWHo9s9Ig7LqeCV7YQwMoAjGaiB/N2ssI9n6YweacXXF0rgBkhFOD3HkHTcyp4sgXTkwEYbUkPcB5wD+YnqN+N3iztcDScV5RcBPgDMJ39eKWqvkSPEJFJzHdfGraqqj/57Cva0LML6+7bIasfw1leOiL2+STgsAx1PQhcrqprMjzbEzaR1MJji+xyC+wBWtHTKj0FfBU4i3z8GE7FfCJeTzY/hmPA/D7Khf/zKnxbTgXPoRqTwLQ0gV32eGMBdJ0KfAYzM29Gz27gFmBWPxTgdq+yFTkLfSX7u8eVIRrf0TICfMUJs5mgQ/sxnJfSHvG0HfPFmJu/IoDrvEoGxtVLjMmq+TFc4GhqRu9qcloxjGCBFuJoNlGqJNwd/rU03nIGu/G0TFVHtUTWz6q6Tu0uxjKMRh9nA2vz8E8wQuPW78AogHNrs47GPfmtwD9h192+VzhhGeFoOxmj1W+n+cA6x2NPeBfJ7uV/QneBOXWjg+bHcKaj3ednF3BxD+VyglfgS8ArQjPcA0OD7MdwmuMhjbcb6GKZGhXs73O/MzSzPQhpGPwYXkL6auaGbhXgRq+g60Mz2aVghsmP4RLHm89vR8NBVNi7vUKeCM1gFwJZnDLmbyKnnc0yJuBYGndydwGLs5YRXQw5EPP6Hb/lepKqxi87lBZD7sfwWOAhkucLz2H7Gr9q9/4IgKq+jN1xi+OcvIjsJ2o/hroJO0qOWx+/GhhzsmmJ+N1Afz1cegWo/RgaHK+XetnzgZVORi1fjsaTWSTHkr2UPJoWti/esNQLTVdAeaQtET/d8h2vgAe8l8dCM9WC2Vk0Bqj6ERVe5+cgk2k0bhZtp8Upol/AO1I0aGFoxpowe4tH5yQV3OHrg1xm0mj9dEsmBXAFjHsv/yAQI4dgy9MvYOP8D7GDkQ3AT90QFafzA13UMYeSHFc7el6XBz1YvCZ/IyzVqCTt5TNSeoFFBQrhbGxF0olt3no6DFBF+QxWZpMegKtjerDr6euzDOfNCvDPztcUIIBRbD2btdHjqePQdFTLZK1jerBVnF/OmVkV4A0pXex7+sj85dg6tpvGH++yzkpZLXdZ5rhXztpMCuBe9k2Tfgu8vg+M++cQ8fQMZib9ReD9wEdTnunKkmdIFGBBSlkJk/NWL8/D7rjHX36YHI+KsWtV/i9/N/Ad4JSU5+/xnr29h7oHegiIlev/kO/JpADu5Q+mENN0SdEFcYdjrtejsp8lZZxyz86gcWLYtQEnAzwJ9Mqd55W3g5g9YZYC/j2FqI6XXC3K/wcsTu/XMc9azZ5b4dEwkUPdcxjAZWBKuROe7PZZfmd5+WDXQPEC/kQBNvMeHX4XeVWohqpawu44pA4pWcPGHQP8hKQruc3YufMTbQvoEbUfw94gIm/E2i/Ci8Dhqrqrbdg4AFX9JdZVx7VlDvCgiLwpN0qbY5Taj2HXcLLaEss6FJNp+7iBsULGgM962TOBcRF5d480tkPtx7B3+DJbDh0ogMOngG94eYcAq0TEdzWfJ2o/hr3Dl5nJtMtJxRWkr1ev7sMEZq5Xx3PkcEt32BJmLu8bkc7ttAeIlOYq7LaK70/wEyLyXRHx/Q71gtqPYQ5wMpvwso/sSgFcgd/EupHt3r/+CtgoIpe52XuvqN3Y5QdfdrO6VgAAVb0bM8fe5v1rOnaO/zMRGe2lDmoFyBP5KgCAWnTt0zEjDR/zgftE5DYR6fbSae3HMD/4sutdAWDfPsEC4CJsouHjfcDjIvIvIrKow4jbffNjOITwZdf9HMCHqu5V1W8Ax2FLxb3eI9OxieM48ISIXCUix2Uouh4C8kPDEJBpK7gbuO3HG2gfOOEh7MBpDRZ48WWvnI0kQ7Qer6qP50nrsMD94B6LZT3WNwVwFQoWhPoKbD3fDnuBJ4FfxNL1JK+s5eLGbhghItMxt4AR/tBXBYhVLMBbsfOE80nu63eKQhVARJZjt44fAb6kPUZQF5HDgI9gsQS+pgW6pklTgBA7UgdiSjBGo8VRlpSLK9uMtP4F5jAjqnsLcGoP5Z2CRWeJynuaAi+yYPOzuCw35jYJzApVfVlV71DV92ATvA9jZksTmLVKOxTpYfRg4KDY99nAAyLyZRc3OBNE5AgR+QIWYn5u7F+vxQJNFoWGCXUhQ0BWiMgU4CjMbU2UzgH+MvbY36vqdwqk6VbMINXHDmzvY72XwOIExNNC4BUpZfybql6QM8lNISLvIxnk8rYgBxMddlvXkOy2Liu4fgE+R+dDVbv0JXJ0+JiRl8s8Gq4pfAjoAv7atVA3dmr4OPA3JKOrdYvNWC92qVrY2SLhy26yigpQqJfxCKp6B7YfcTHQ1vNGCjYCF2Iuawobwjw0zAGmBiGjM5RCAQBUdRdwE3CTs5N8B2ZaNRt4jUtg5u3PYt7A78Mu2PbddjIDyj0JTIOL0xMXXh3YsguIyFTgNyR9CR1V+iFALcDS07Gsw9gf9KlGdiwi2fhPq+qTpVcAB9+g8dwgVFQbvsxWQedGoaGQatFaoyOkWlaXfg4A9cWQXtHzxZDQcLPv73vZ9TCQHb6svu9kWpkhABrt2msFyA5fVvtkWYkhAPZ5BN2GuUKLcIKqbgxEUiUgIvMwu4oIO7Hu//dQoR7AETzuZX8mAClVgy+j8ajxoUIK4HCz9/18EVkQhJIKwMnmfC87IcPKDAERRGQtcFos6361AEs1PIjIOMlNswdV9S3xZ6rWA4B5FItjkYiU3rF10XAy8XdMfdlVrwcAEJExLKRahA2YY+s9TV4ZKjjDmkcwY5QIdzkrrASq2AMAfIykf/wTgcIsayqAC0g2/h5MZg2opAKo6qPArV721SIyMwQ9ZYKTwdVe9q1OZo3PV3EIAHBGmZtI3hl4ADhLVXeGoSosRGQa5lT7jFj2HzEjlNQbVZXsAQAcQ9d62WdgnkeHFTeSbHyAa5s1PtCdh5CyJEyB04JCD0yMwA5kcUmKHFbTxvC0skNABLdFvJZk3KA9wFIdkrhBIrIEOyybEst+FHiLxnb9Ut+tugJAHTaOXsPGVR2O0feS9Fl0GHC3E9BAwvF2N8nG3w28N0vjw4AoAICq3odduozjGOAh10UOFBxPD2E8xvERJ4tsCD156cNkqA4e3UlZoZnpg3Dq8PHDrAAxYV1MYzBpxeLqVS68HOaW148JqI7HjiKGD4UCOKEtJj0IwyQWWq2jSGOBeJjiaE0LKfM7OogUPnQK4AR4NHZamNZtrqeLiGMF0n4OjeHforQBOLrnOkIzWZAgZ5C+YxilcboMPtUnehfQGPHL3+GbkUtdoZktUKgjWLBpP95wPN1OD3GIcqBxHo1BnuJpu+MhN78CwRsmgJBnYXGH05ZRUZrAwqz0PSwOcCpmuPnzFvTsdjQ3DQJdK0Dngp+POapqJvQoPQV8FTiLHNzUY8vUt2Pu757KUP8YTeL+5pEG4iygF4jImdix8mntnsXOFybYH9Vra+xzlMB6mXg6Ivb5JJJbt83wIHC5qq7Jyks3GHoFiCAi52EePEZJXj4pEjuxyd/NqvpfRVRYK4AHd7y8FLtOtZTenFpmwYvYUe6d2J29lse3eaNWgBZwt5JHsavVyzFXMHngaex69irsps6unMrtGLUCdADnruZIkuO7/x2Sc4Jn/O9qXk9KgT8DE0TnMDEQQ54AAAAASUVORK5CYII=`;
const blockIconURI = menuIconURI;

const defaultId = 'default';
let theLocale = null;

class textSentiment {
    constructor(runtime) {
        theLocale = this._setLocale();
        this.runtime = runtime;
        // communication related
        this.comm = runtime.ioDevices.comm;
        this.session = null;
        this.runtime.registerPeripheralExtension('facePerception', this);
        // session callbacks
        this.reporter = null;
        this.onmessage = this.onmessage.bind(this);
        this.onclose = this.onclose.bind(this);
        this.write = this.write.bind(this);

        // 設定文字情緒的置信度
        this.confidence = 0;

        // 載入 ML5 Sentiment Model 
        this.sentiment = ml5.sentiment('MovieReviews');
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
            id: 'textSentiment',
            name: msg.title[theLocale],
            color1: '#3AACFD',
            color2: '#3AACFD',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'inputText',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        defaultText: {
                            type: ArgumentType.STRING,
                            defaultValue: msg.defaultText[theLocale]
                        },
                    },
                    text: msg.inputText[theLocale]
                },
                {
                    opcode: 'startTextSentiment',
                    blockType: BlockType.COMMAND,
                    text: msg.startTextSentiment[theLocale]
                },
                {
                    opcode: 'getConfidence',
                    blockType: BlockType.REPORTER,
                    text: msg.confidence[theLocale]
                },
            ],
        };
    }

    inputText(args) {
        var words = args.defaultText;

        this.translateToEnglish(words);
    }

    translateToEnglish(words) {
        let urlBase = `https://translate-service.scratch.mit.edu/translate?language=en&text=` + encodeURIComponent(words);

        const translatePromise = fetchWithTimeout(urlBase, {}, 3000)
            .then(response => response.text())
            .then(responseText => {
                const translated = JSON.parse(responseText).result;
                this.text = translated;
            });
    }

    async startTextSentiment() {
        await this.sleep(2000);
        this.confidence = this.sentiment.predict(this.text)["score"];
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getConfidence() {
        return this.confidence.toFixed(2);
    }
}

module.exports = textSentiment;
