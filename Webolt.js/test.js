let Main,Dammy,get
window.onload=()=>{
    Main = new textarea("Main")
    // console.log(Main.value)
    Main.value = 100
    Dammy = $("Dammy")
    // Main.elem.setAsDropReader((e)=>{console.log(e)})
    // setAsDDReader("Main",(e)=>{Main.value = e[0].content.text})
    setAsDDReader($("Dammy"),(e)=>{$("Img").src = e[0].content})
    setAsDDReader(document,(e)=>{
        get = e[0]
    })

    $(document).ondblclick = ()=>{
        get.del()
        // VFileManager.open('',5,(files)=>{get = files})
    }

    clog("Message",1)
    clog("Message",2)
    clog("Message",3)
    setTimeout(() => {
        clog()
    }, 1000);
}