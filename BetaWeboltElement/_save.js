const Cookie = new class{
    set(Key,Value,Property){
        document.cookie = `${Key.replace(/_/g,"_d").replace(/=/,"_e")}="${Value.replace(/_/g,"_d").replace(/=/,"_e")}";${Property}`
    }
    get(Key){
        const get = ((document.cookie.split(";").filter((element) => element.includes(`${Key.replace(/_/g,"_d").replace(/=/,"_e")}=`))).join("").split("=")[1] || undefined)
        return (get!==undefined)? slice(1,-1).replace(/_d/,"_").replace(/_e/,"=") : false
    }
    delete(Key){
        document.cookie = `${Key}="";max-age=0`
    }
}
const LocalStorage = new class{
    set(Key,Value){
        localStorage.setItem(Key,Value)
    }
    get(Key){
        return localStorage.getItem(Key)
    }
    delete(Key){
        localStorage.removeItem(Key)
    }
}