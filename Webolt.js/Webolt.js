const SupportStatus = new class{
    constructor(){
        this.File = (window.File)?true:false
        this.Advanced = ("ABC".includes("B"))?true:false
        this.All = this.File && this.Advanced
    }
}

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

/**
 * Get HTMLElement by ID or HTMLElement
 * @param {string|HTMLElement|Document} target
 * @returns {HTMLElement|null}
 */
function $(target) {
    return typeof target === 'string'
        ? document.getElementById(target)
        : target instanceof HTMLElement
        ? target
        : target instanceof Document
        ? target
        : null
}

/**
 * Reload Page
 */
function Reload(){
    location.reload()
}
/**
 * Console Out
 * @param {string|boolean} msg
 * @param {Number|undefined} type
 */
function clog(msg,type=0){
    if(msg){
        switch(type){
            case 0:
                console.log(msg)
                break
            case 1:
                console.warn(msg)
                break
            case 2:
                console.error(msg)
                break
        }
    }
    else{
        console.clear()
    }
}

/**
 * Set HTMLElement as DropReader
 * @param {string|HTMLElement} target
 * @param {Function} drop_callback
 * @param {Function} drag_callback
 */
function setAsDDReader(target,drop_callback,drag_callback){
    // ondragover="onDragOver(event)" ondrop="onDrop(event)"
    const elem = $(target)
    if(!elem){
        try{throw new Error();}
        catch(error){
            console.error(`Webolt: Loading Element Error:\n Failed to load element with ID:"${target}" \n${error.stack.split("\n")[2]}`)
            return
        }
    }else{
        elem.ondragover = (e)=>{
            if(drag_callback instanceof Function)drag_callback(e)
            e.preventDefault()
        }
        elem.ondrop = (e) => {
            const promise = new Promise((resolve) => {
                const result = [];
                const dir = [];
                function isDroppedItemFolder(item) {
                    if (typeof item.webkitGetAsEntry === 'function') {
                        const entry = item.webkitGetAsEntry();
                        return entry && entry.isDirectory;
                    }
                    return false;
                }
                for (const item of e.dataTransfer.items) {
                    if (isDroppedItemFolder(item)) {
                        dir.push(true);
                    } else {
                        dir.push(false);
                    }
                }
                const files = e.dataTransfer.files;
                for (let i = 0; i < files.length; i++) {
                    const f = files[i];
                    const reader = new FileReader();
                    const type = dir[i]
                    ? "DIRECTORY"
                    : f.name.includes(".")
                    ? `.${f.name.split(".")[f.name.split(".").length - 1]}`
                    : "UNKNOWN"
                    let isImage = false
        
                    reader.onload = function (event) {
                        const content = event.target.result;
                        // const image = f.type.startsWith('image') ? content : undefined;
                        result.push(
                            new VFile({
                                name: f.name,
                                type: type,
                                content: content,
                                isImage: f.type.startsWith('image'),
                                size: f.size,
                                original: f
                            }),
                        );
        
                        resolve(result);
                    };
        
                    if (f.type.startsWith('image')) {
                        reader.readAsDataURL(f); 
                    } else {
                        reader.readAsText(f, 'utf-8');
                    }
                }
            });
        
            promise.then((data) => {
                const result = data;
                drop_callback(result);
            });
            e.preventDefault();
        };
        
}}

class VDrive{

}

class VFile{
    #name
    #type
    #content
    #isImage
    #size
    #original
    constructor(f){
        if(typeof f == "object"){
            this.#name = f.name
            this.#type = f.type
            this.#content = f.content
            this.#isImage = f.isImage
            this.#size = f.size
            this.#original = f.original
        }
    }
    get name(){return this.#name}
    get type(){return this.#type}
    get content(){return this.#content}
    get isImage(){return this.#isImage}
    get size(){return this.#size}
    get original(){return this.#original}
}

const VFileManager = new class{
    /**
     * Download VFile as File
     * @param {VFile} vfile
     */
    download(vfile){
        if(vfile instanceof VFile){
            if(vfile.type.startsWith('image') && vfile.content.image){
                const link = document.createElement('a');
                link.href = vfile.content.image;
                link.download = vfile.name;
                link.click();
            }else{
                const blob = new Blob([vfile.content.text], { type: vfile.type });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = vfile.name;
                link.click();
            }
        }
    }
    open(accept, count, callback) {
        function readAsText(file) {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    resolve(reader.result);
                };
            });
        }
        const promise = new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            if (accept !== '') input.accept = accept;
            input.multiple = true;
    
            input.onchange = async (event) => {
                const files = event.target.files;
                const vFiles = [];
    
                for (let i = 0; i < files.length && i < count; i++) {
                    const file = files[i];
                    const content = await readAsText(file);
    
                    vFiles.push(new VFile({
                        name: file.name,
                        type: file.type,
                        content: {
                            text: content,
                            image: file.type.startsWith('image') ? content : null
                        },
                        size: file.size,
                        original: file
                    }));
                }
    
                resolve(vFiles);
            };
    
            input.click();
        });
        promise.then((data) => {
            const result = data;
            callback(result);
        });
    }
}



class textarea{
    constructor(target){
        this.elem = $(target)
        if(!this.elem || this.elem.tagName.toLowerCase() != "textarea"){
            try{throw new Error();}
            catch(error){
                console.error(`Richtml/textarea Loading Element Error:\n Failed to load textarea element:"${target}" \n${error.stack.split("\n")[2]}`)
                return
            }
        }else{
            this.id = this.elem.id
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

