const User = new class{
    constructor(){
        this.ua = window.navigator.userAgent.toLowerCase()
    }
    get OS(){
        if(this.ua.includes("mac os x"))return "Mac OS"
        if(this.ua.includes("windows nt"))return "Windows"
        if(this.ua.includes("iphone"))return "iPhone"
        if(this.ua.includes("android"))return "Android"
    }
    get browser(){
        console.log(this.ua)
        if(this.ua.includes("chrome")){
            if(this.ua.includes("edg"))return "Edge"
            else return "Google Chrome"
        }
        if(this.ua.includes("opr")){
            if(this.ua.includes("brave"))return "Brave"
            else return "Opera"
        }
        if(this.ua.includes("firefox"))return "Firefox"
        if(this.ua.includes("safari"))return "Safari"
        if(this.ua.includes("ie"))return "Internet Explorer"
        if(this.ua.includes("vivaldi"))return "Vivaldi"
        return "Other Browser"
    }
    get language(){
        return navigator.language
    }
}