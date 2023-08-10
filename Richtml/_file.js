const FileManager = new class{
    download(file){
        if(file instanceof File){
            const a = document.createElement('a');
            a.href = `data:${type},` + encodeURIComponent(file.value);
            a.download = file.name;
            a.click();
        }
    }
    open(accept,func){
        const OpenFile = () => {
            return new Promise(resolve => {
                const input = document.createElement('input');
                input.type = 'file';
                if(accept!="")input.accept = accept;
                input.onchange = event => { resolve(event.target.files[0]); };
                input.click();
            });
        };
        const readAsText = file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => { resolve(reader.result); };
            });
        };
        function ReadCode(){
            (async () => {
                const file = await OpenFile();
                const content = await readAsText(file);
                func(content,file.name)
            })();
        }
        ReadCode()
    }
}

// class File{
//     constructor(value,name){
//         this.value = value
//         this.name = name
//     }
//     set(value){
//         this.value = value
//     }
//     get(){
//         return this.value
//     }
// }