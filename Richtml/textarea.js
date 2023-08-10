class textarea{
    constructor(id){
        this.elem = document.getElementById(id)
        this.id = id
        if(!this.elem || this.elem.tagName.toLowerCase() != "textarea"){
            try{throw new Error();}
            catch(error){
                console.error(`Richtml/textarea Loading Element Error:\n Failed to load textarea element with ID:"${id}" \n${error.stack.split("\n")[2]}`)
                return
            }
        }

        class _caret{
            constructor(element){
                this.elem = element
                class _start{
                    constructor(element){
                        this.elem = element
                    }
                    get offset(){
                        return this.elem.selectionStart
                    }
                    set offset(n){
                        this.elem.selectionStart = n
                    }
                    get col(){
                        return (this.elem.value.substring(0,this.offset).match(/\n/g) || []).length
                    }
                    get row(){
                        return ((Row => (Row >= 1 ? this.offset - Row : this.offset))(this.elem.value.lastIndexOf("\n", this.offset - 1) + 1))
                    }
                    set col(n){
                        this.setPos(this.row,n)
                    }
                    set row(n){
                        this.setPos(n,this.col)
                    }
                    setPos(row,col) {
                        const lines = this.elem.value.split("\n");
                        const yPos = Math.min(col, lines.length - 1);
                        const yMove = lines.slice(0, yPos).join("").length + yPos;
                        const xMove = Math.min(lines[yPos].length, row);
                        this.elem.selectionStart = yMove + xMove;
                    }
                }
                class _end{
                    constructor(element){
                        this.elem = element
                    }
                    get offset(){
                        return this.elem.selectionEnd
                    }
                    set offset(n){
                        this.elem.selectionEnd = n
                    }
                    get col(){
                        return (this.elem.value.substring(0,this.offset).match(/\n/g) || []).length
                    }
                    get row(){
                        return ((Row => (Row >= 1 ? this.offset - Row : this.offset))(this.elem.value.lastIndexOf("\n", this.offset - 1) + 1))
                    }
                    set col(n){
                        this.setPos(this.row,n)
                    }
                    set row(n){
                        this.setPos(n,this.col)
                    }
                    setPos(row,col) {
                        const lines = this.elem.value.split("\n");
                        const yPos = Math.min(col, lines.length - 1);
                        const yMove = lines.slice(0, yPos).join("").length + yPos;
                        const xMove = Math.min(lines[yPos].length, row);
                        this.elem.selectionEnd = yMove + xMove;
                    }
                }
                [this.start, this.end] = [new _start(this.elem), new _end(this.elem)];
            }
            get offset(){
                return (this.elem.selectionStart===this.elem.selectionEnd)? this.elem.selectionStart : false
            }
            set offset(n){
                this.elem.selectionStart = this.elem.selectionEnd = n
            }
            get col(){
                return this.offset? (this.elem.value.substring(0,this.offset).match(/\n/g) || []).length : false
            }
            get row(){
                return ((Row => (Row >= 1 ? this.offset - Row : this.offset))(this.elem.value.lastIndexOf("\n", this.offset - 1) + 1))
            }
            set col(n){
                this.setPos(this.row,n)
            }
            set row(n){
                this.setPos(n,this.col)
            }
            setPos(row,col) {
                const lines = this.elem.value.split("\n");
                const yPos = Math.min(col, lines.length - 1);
                const yMove = lines.slice(0, yPos).join("").length + yPos;
                const xMove = Math.min(lines[yPos].length, row);
                this.offset = yMove + xMove;
            }
            get single(){
                return this.elem.selectionStart===this.elem.selectionEnd
            }
        }
        this.caret = new _caret(this.elem)
        // this.elem.onkeydown = (e)=>{this.onkeydown(e)}
        // this.elem.onkeyup = (e)=>{this.onkeyup(e)}
        // this.elem.oninput = (e)=>{this.oninput(e)}
        // this.elem.onchange = (e)=>{this.onchange(e)}
        // this.elem.onfocus = (e)=>{this.onfocus(e)}
        // this.elem.onblur = (e)=>{this.onblur(e)}
        // this.elem.onscroll = (e)=>{this.onscroll(e)}
        this.elem.addEventListener('keydown',()=>{this.onupdate()})
        this.elem.addEventListener('click',()=>{this.onupdate()})
        this.elem.addEventListener('input',()=>{this.onupdate()})
    }

    get value(){
        return this.elem.value
    }
    set value(str){
        this.elem.value = str
    }

    get length(){
        return this.value.length
    }
    get selected(){
        return this.elem == document.activeElement && this.caretStart!=this.caretEnd
    }
    get selection(){
        return this.value.substring(this.caretStart,this.caretEnd)
    }
    set selection(str){
        if(this.selected)this.value = this.value.substring(0,this.caretStart)+str+this.value.substring(this.caretEnd,this.length)
    }
    get selectionBefore(){
        return this.value.substring(0,this.caretStart)
    }
    set selectionBefore(str){
        if(this.selected)this.value = str+this.value.substring(this.caretEnd,this.length)
    }
    get selectionAfter(){
        return this.value.substring(this.caretEnd,this.length)
    }
    set selectionAfter(str){
        if(this.selected)this.value = this.value.substring(0,this.caretEnd)+str
    }

    focus(bool = true) {
        if(bool) this.elem.focus()
        else this.elem.blur()
    }
    get focused(){
        return document.activeElement == this.elem
    }

    select(S=undefined,E=undefined){
        console.log(typeof S)
        if(typeof S == "number"){
            this.caret.start.offset = S
            this.caret.end.offset = (E)?E:S+1
            return this.selection
        }else if(typeof S == "string" && E==undefined){
            let search = Main.value.indexOf(S)
            if (search >= 0) this.select(search,search+S.length)
            return [search,search+S.length]
        }
        else{
            this.caretStart = 0
            this.caretEnd = this.value.length
        }
    }
    
    get lines(){
        return this.value.split("\n")
    }
    get cols(){
        return this.lines.length
    }

    set tabSize(n){
        this.elem.style.tabSize = n
    }
    get tabSize(){
        return this.elem.style.tabSize
    }


    edit(line,str,type){
        if(typeof line == "number"){
            let Lines = this.lines
            Lines[line] = ((type)? str.replace(/{{}}/g,this.lines[line]) : str)
            this.value = Lines.join("\n")
        }
        else if(Array.isArray(line) && line.length==2){
            let Lines = this.lines
            for(let i = line[0]; i <= line[1]; i++){
                Lines[i] = ((type)? str.replace(/{{}}/g,(this.lines[i] || "")) : str)
            }
            this.value = Lines.join("\n")
        }
    }

    processLines(line,func){
        if(typeof line == "number"){
            let Lines = this.lines
            Lines[line] = func(Lines[line])
            this.value = Lines.join("\n")
        }
        else if(Array.isArray(line) && line.length==2){
            let Lines = this.lines
            for(let i = line[0]; i <= line[1]; i++){
                Lines[i] = func(Lines[i],i-line[0])
            }
            this.value = Lines.join("\n")
        }
    }

    deleteLines(lineS=undefined,lineE=undefined){
        if(typeof lineS == "number" && lineE==undefined){
            let Lines = this.lines
            Lines.splice(lineS,1)
            this.value = Lines.join("\n")
        }
        else if(typeof lineS == "number" && typeof lineE == "number"){
            let Lines = this.lines
            Lines.splice(lineS,lineE-lineS+1)
            this.value = Lines.join("\n")
        }
    }
    insertLines(col,str){
        if(typeof col == "number"){
            let Lines = this.lines
            Lines.splice(col,0,(Array.isArray(str))?str.join("\n"):str) 
            this.value = Lines.join("\n")
        }
    }
    getLines(colS,colE=undefined){
        if(typeof colS == "number" && colE==undefined){
            return this.lines[colS]
        }else if(typeof colS == "number" && typeof colE == "number"){
            return this.lines.slice(colS,colE+1)
        }
    }
    swapLines(colS, colE) {
        if(typeof colS == "number")colS = [colS,colS]
        if(typeof colE == "number")colE = [colE,colE]
        if(colS[0]<=colS[1] && colS[1]<colE[0] && colE[0]<=colE[1]){
            const lineS = this.getLines(...colS)
            const lineE = this.getLines(...colE)
            this.deleteLines(colE[0],colE[1])
            this.deleteLines(colS[0],colS[1])
            this.insertLines(colS[0],"")
            this.insertLines(colE[0]-lineS.length+1,"")
            let Lines = this.lines
            Lines.splice(colS[0], 1, ...lineE);
            Lines.splice(colE[0]-lineS.length+lineE.length, 1, ...lineS);
            this.value = Lines.join("\n")
        }
    }

    setup(wrap,spellcheck,maxlength){
        this.elem.wrap = wrap
        this.elem.spellcheck = spellcheck
        this.elem.setAttribute('maxlength',maxlength)
    }

    onupdate(){}
}