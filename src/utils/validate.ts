// Validate Username (allow letters, numbers, underscores, 3-16 characters)
export const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    if(usernameRegex.test(username)) {
        return {isValid: true, errMsg: null, validated: username.trim().toLowerCase()};
    }
    return {isValid: false, errMsg: "Invalid username. Use only letters, numbers and underscores. Use 3-16 characters without spaces."};
}

export const validateEmail = (email: string) => {
    if (email.trim().length == 0) { return {isValid: false, errMsg: "Enter email."}; }
    if (email.trim().length > 191) { return {isValid: false, errMsg: "Email is too long. Use maximum of 191 characters."}; }
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
    if (atpos < 1 || ( dotpos - atpos < 2 )) {
        return {isValid: false, errMsg: "Invalid email!"};
    }
    return {isValid: true, errMsg: null, validated: email.trim().toLowerCase()};
};

export const validatePassword = (password: string) => {
    if (password.trim().length == 0) { return {isValid: false, errMsg: "Enter password."}; }
    if (password.length < 8) { return {isValid: false, errMsg: "Password is too short. Use a minimum of 8 characters."}; }
    return {isValid: true, errMsg: null, validated: password.trim()};
};

export const validateName = (name: string) => {
    if (name.trim().length == 0 || !isNaN(name as unknown as number)) { return{isValid: false, errMsg: "Enter name."}; }
    if (name.trim().length < 4) { return {isValid: false, errMsg: "Name is not valid. Expects minimum of 4 characters."}; }
    if (name.trim().length > 191) { return {isValid: false, errMsg: "Name is too long. Use maximum of 191 characters."}; }
    var reg: any = /[0-9]/;
    if (reg.test(name)) { return {isValid: false, errMsg: "Invalid name. Name cannot contain numerals."}; }
    reg = /[\`\"\\\>\<\%\*\^\=\[\]\}\{\”\“\+\|\;\,\(\)\/\?\:\@\!\#\$\~]/;
    if (reg.test(name)) { return {isValid: false, errMsg: "Invalid name. Name cannot contain symbolic characters."}; }
    reg = name.match(/[^\.\']/gi);
    if (reg == null || reg.length < 4 || reg.length < Math.ceil(name.length / 2)) { return {isValid: false, errMsg: "Invalid name. Name cannot contain symbolic characters."}; }
    return {isValid: true, errMsg: null, validated: name.trim()};
};

export const validateText = (text: string) => {
    if (text.trim().length == 0 || !isNaN(text as unknown as number)) { return{isValid: false, errMsg: "Enter text."}; }
    if (text.trim().length > 191) { return {isValid: false, errMsg: "Name is too long. Use maximum of 191 characters."}; }
    return {isValid: true, errMsg: null, validated: text.trim()};
};
