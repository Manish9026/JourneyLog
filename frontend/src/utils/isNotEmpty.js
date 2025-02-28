function isNotEmpty(value) {
    if (
        value === null || 
        value === undefined || 
        value === "null" || 
        value === "undefined" || 
        (typeof value === "string" && value.trim() === "") || 
        (Array.isArray(value) && value.length === 0) || 
        (typeof value === "object" && Object.keys(value).length === 0)
    ) {
        return false;
    }
    return true;
}
const isMobNo = (value) => {
    return /^[0-9]{10}$/.test(String(value).trim());
};

export {isNotEmpty,isMobNo}
export default {isNotEmpty,isMobNo}
