const User = new class{
    constructor(){
        this._ua = window.navigator.userAgent.toLowerCase()
    }
    get OS(){
        if(this._ua.includes("mac os x"))return "MacOS"
        if(this._ua.includes("windows nt"))return "Windows"
        if(this._ua.includes("iphone"))return "iPhone"
        if(this._ua.includes("android"))return "Android"
    }
    get browser(){
        if(this._ua.includes("chrome")){
            return "Chromium"
        }
        if(this._ua.includes("ie"))return "Internet Explorer"
        if(this._ua.includes("safari"))return "Safari"
        if(this._ua.includes("firefox"))return "Firefox"
        if(this._ua.includes("opr")){
            if(this._ua.includes("brave"))return "Brave"
            else return "Opera"
        }
        return "Others"
    }
    get lang_uage(){
        return navigator.lang_uage
    }
}