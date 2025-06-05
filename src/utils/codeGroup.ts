export function generateGroupCode() {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let x = 0; x < 6; x++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
