const CryptoJS = require("crypto-js")
const sizeOfKey = 256
const iter = 100

function hash(password) {
    // Generate a random salt
    let salt = CryptoJS.lib.WordArray.random(128 / 8);

    // Generate a key
    let key = CryptoJS.PBKDF2(password, salt, {
        keySize: sizeOfKey / 32,
        iterations: iter
    });

    // Create a hash using the key and the entered password
    let hash = CryptoJS.HmacSHA256(password, key);

    // Concatenate the salt and the hash to create the encrypted password
    let encryptedPassword = salt.toString() + hash.toString();

    return encryptedPassword;

};


function checkPassword(enteredPassword, encryptedPassword) {
    // Get the salt from the encrypted password
    let salt = CryptoJS.enc.Hex.parse(encryptedPassword.substr(0, 32));

    // Use the salt and the entered password to generate a key
    let key = CryptoJS.PBKDF2(enteredPassword, salt, {
        keySize: sizeOfKey / 32,
        iterations: iter
    });

    // Create a hash using the key and the entered password
    let hash = CryptoJS.HmacSHA256(enteredPassword, key);

    // Concatenate the salt and the hash
    let newEncryptedPassword = salt.toString() + hash.toString()

    return newEncryptedPassword == encryptedPassword;
}


module.exports = {hash, checkPassword}