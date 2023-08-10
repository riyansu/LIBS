let Main,Dammy
window.onload=()=>{
    Main = new textarea("Main")
    Main.value = "0\n1\n2\n3\n4"
    console.log(Main.value)
    console.log(Main.length)
    // console.log(Main.caretEnd)
    Cookie.set("test=nice","おはよう=おはよーさん","max-age:100")
    Main.elem.onkeydown=(e)=>{
        if(e.key == "]" && e.metaKey){
            e.preventDefault()
            let col = Main.caret.col
            let row = Main.caret.row
            console.log(col,row)
            Main.processLines([Main.caret.start.col,Main.caret.end.col],(l,index)=>{
                console.log(index)
                return `\t${l}`
            },false)
            Main.caret.setPos(row+1,col)
        }
        if(e.key == "[" && e.metaKey){
            e.preventDefault()
            let col = Main.caret.col
            let row = Main.caret.row
            Main.processLines([Main.caret.start.col,Main.caret.end.col],(l,index)=>{
                return (l[0]=="\t")?l.substring(1,l.length):l
            })
            Main.caret.setPos(row-1,col)
        }
        if(e.key == "/" && e.metaKey){
            e.preventDefault()
            Main.processLines([Main.caret.start.col,Main.caret.end.col],(l,index)=>{
                return (l[0]=="/"&&l[1]=="/")?l.substring(2,l.length):"//"+l
            })
        }
        if(e.key == "-" && e.metaKey){
            e.preventDefault()
            // Main.swapLines(0,[2,4])
            // FileManager.download("おはよう","hello.js","js")
            FileManager.open('',(c,n)=>{
                console.log(n)
            })
        }
    }
    Main.elem.onblur = ((e)=>{
        console.log(Main.id)
    })
    Main.onupdate = (()=>{
    })
    Main.setup("off","false",3)
    Main.tabSize = 2
    console.log(User.OS)
    console.log(User.browser)
    console.log(User.language)
    console.log(Cookie.get("test=nicea"))
}