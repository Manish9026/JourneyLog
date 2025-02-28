function isMobNo(value){

    return /^[0-9]{10}$/.test(value)
   
}

export {isNotEmpty,isMobNo}
export default {isNotEmpty,isMobNo}
console.log(isMobNo("843578575h"))