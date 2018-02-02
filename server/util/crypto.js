'use strict';
var crypto = require("crypto");
var Crypto = {
    md5: function (str) {
        if (str && str !== null) {
            var md5 = crypto.createHash('md5');
            return md5.update(str).digest('hex');
        } else {
            throw '字符串不可以为空!';
        }
    },
    sha1: function (str) {
        if (str && str !== null) {
            var sha1 = crypto.createHash('sha1');
            return sha1.update(str).digest('hex');
        } else {
            throw '字符串不可以为空!';
        }
    },
    rsa_sha1_Sign: function (str, privateKey, charset) {
        charset = charset || 'UTF-8';
        var signer = crypto.createSign('RSA-SHA1');
        signer.update(str, charset);
        return signer.sign(privateKey, 'base64');
    },
    rsa_sha1_verify: function (str, sign, publicKey, charset) {
        charset = charset || 'UTF-8';
        var verify = crypto.createVerify('RSA-SHA1');
        verify.update(str, charset);
        return verify.verify(publicKey, sign, 'base64');
    },
    rsa_sha256_Sign: function (str, privateKey, charset) {
        charset = charset || 'UTF-8';
        var signer = crypto.createSign('RSA-SHA256');
        signer.update(str, charset);
        return signer.sign(privateKey, 'base64');
    },
    rsa_sha256_verify: function (str, sign, publicKey, charset) {
        charset = charset || 'UTF-8';
        var verify = crypto.createVerify('RSA-SHA256');
        verify.update(str, charset);
        return verify.verify(publicKey, sign, 'base64');
    }
}
module.exports = Crypto;

