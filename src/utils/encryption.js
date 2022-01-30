const xxtea = require('xxtea-node');
const { Logger } = require('./logger');

/**
 * 
 * @param {*} obj The object to encrypt.
 * @param {String} key The encryption key.
 * @param {Logger} logger The logger implementation.
 * @returns {ArrayBuffer} The encrypted binary buffer.
 */
function Encrypt3(obj, key, logger){
    try{
        const encryption = xxtea.encrypt(xxtea.toBytes(JSON.stringify(obj)), xxtea.toBytes(key));
        const output = new Uint8Array(8 + encryption.length);        
        const buf = new ArrayBuffer(4);
        new DataView(buf).setUint32(0, encryption.length, !1);
        const bufAsUint = new Uint8Array(buf);
        output.set([0,4,1,1], 0);
        output.set(bufAsUint, 4);
        output.set(encryption, 8);
        return output;
    }catch(e){
        logger.error(e)
        throw e;
    }
}

/**
 * 
 * @param {ArrayBuffer} buf The ArrayBuffer to decrypt.
 * @param {String} key The decryption key.
 * @param {Logger} logger The logger implementation.
 * @returns {*} The decrypted JSON object.
 */
function Decrypt(buf, key, logger){
    const buffer = Buffer.from(buf);
    try{
        const slice = buffer.slice(8);
        const str = xxtea.toString(xxtea.decrypt(slice, xxtea.toBytes(key)))
        const obj = JSON.parse(str);
        return obj;
    }catch (e){
        logger.error(e);
        throw e;
    }
}

function atob(base64){
    return Buffer.from(base64, 'base64');
}

function btoa(buf){
    return Buffer.from(buf).toString('base64')
}

module.exports.encrypt = Encrypt3;
module.exports.decrypt = Decrypt; 
