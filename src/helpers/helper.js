const path = require('path')
const fs = require('fs');
const { logError } = require('./logger');
const dayjs = require('dayjs');

require('dotenv').config()


const getRandomChar = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}



class Helper {

    static generateOTP = () => {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }

    static getDomainName = async (req) => {
        var result = ""

        if (req.headers["x-forwarded-host"]) {                                                                                                        // server
            result = await 'https' + '://' + req.headers["x-forwarded-host"].split(',')[0]
        } else {                                                                                                                                      // local
            result = await req.protocol + '://' + req.headers.host
        }

        return result
    }

    static getDomainWithPath = async (req) => {
        var result = ""

        if (req.headers["x-forwarded-host"]) {                                                                                                        // server
            result = await 'https' + '://' + req.headers["x-forwarded-host"].split(',')[0] + process.env.PROJECT_PATH
        } else {                                                                                                                                      // local
            result = await req.protocol + '://' + req.headers.host + process.env.PROJECT_PATH
        }

        return result
    }

    static deleteImage = async (arrImage, pathImage = '') => {
        try {
            await Promise.all(arrImage.map(async (urlImage) => {
                const imgName = path.basename(urlImage, '.png')                                     // get filename yg berformat .png
                const imgPath = path.resolve(process.env.IMAGE_PATH) + '/' + pathImage + imgName + '.png'
                console.log(imgPath)
                console.log("IMAGE to delete :", imgPath)

                await fs.unlink(imgPath, err => {
                    if (err) {
                        console.log(err)
                        logError.info('model:Helper' + `|func:deleteImage` + `|err:${err.message}`)
                    }
                })
            }))
        } catch (error) {
            console.log(error)
            logError.info('model:Helper' + `|func:deleteImage` + `|err:${error.message}`)
        }
    }

    static deleteSingleImage = async (urlImage) => {
        try {
            const imgName = path.basename(urlImage, '.png')                                     // get filename yg berformat .png
            const imgPath = path.resolve(process.env.IMAGE_PATH) + '/' + imgName + '.png'
            console.log(imgPath)

            await fs.unlink(imgPath, err => {
                if (err) {
                    console.log(err)
                    logError.info('model:Helper' + `|func:deleteImage` + `|err:${err.message}`)
                }
            })
        } catch (error) {
            console.log(error)
            logError.info('model:Helper' + `|func:deleteImage` + `|err:${error.message}`)
        }
    }

    static generateTicketNumber = () => {
        return dayjs().format('YYMMDD') + getRandomChar(2)
    }

    static generateReportID = (terminalCode, date) => {
        return terminalCode + dayjs(date).format('YYMMDD')
    }
}

module.exports = Helper