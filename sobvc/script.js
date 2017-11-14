//Replacer script v2.0 - Sorting between "in quotes" and "not in quotes", past tense checking, and MLA/Regular formatting
var editor = CKEDITOR.replace( 't' );//Link the editor
var searchPastTense = true;
var edata;//Define the edata variable
var sobv = ["is", "be", "am", "are", "was", "were", "been", "has", "have", "had", "do", "does", "did", "can", "could", "shall", "should", "will", "would", "may", "might", "must", "being"];//The list of 22 SOBV
var wc = [" ", ".", ",", "\n", ":", "'", '"', "|", "!", "?", "<", ">", "&"];//Whitespace characters
for(var i = 0; i<sobv.length; i++){sobv[i]='\.'+sobv[i]+'\.'}//Add wildcards to every one
var other_words = ["due date", "sample text", "sample title", "template title"];//The other phrases you don't want
var hwords = sobv.concat(other_words);//Highlighted words
for(var i = 0; i<hwords.length; i++){
    hwords[i] = new RegExp(hwords[i], "ig")}
var ptv = [/\swas\s/ig,/\sgot\s/ig,/\sdrank\s/ig,/\shad\s/ig,/\sdid\s/ig,/\sbought\s/ig,/\sate\s/ig, /\swent\s/ig, /\swere\s/ig, /\sran\s/ig, /\ssat\s/ig, /\sblew\s/ig, /\sflew\s/ig, /\S+ed\s/ig]; //Last item detects verbs ending in "ed" (usually past tense)
//Convert the list to rexexp

var stats = {
    sobv: 0,//SOBV, excluding ones in quotes
    sobv_all:0,//SOBV, including ones in quotes
    pastTense: 0,
    pastTense_all:0
};

function createString(x){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < (x!=undefined?x:16); i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));}
    return text;
}

var quotePos = {
    start: [],
    end: []
};

editor.addCommand("ct", {
    exec: function() {
        markText();
    }
});//Register the markText function

editor.ui.addButton('checkTextButton', {
    label: "Check Text",
    command: 'ct',
    toolbar: 'others',
    icon: 'highlighter.png'
});//Add the "Mark Text" button

function checkForQuote(offset){
    var res = 0; 
    var pos = 0;
    if(quotePos.start[pos] > offset){
        return false;
    }
    while(offset >= quotePos.start[pos] && pos <= quotePos.start.length){
        res = pos;
        pos ++;
    }
    if(offset <= quotePos.end[res]){
        return true;
    }
    else{
        return false;
    }
}

function replacer(match, offset){
    var lastChar = match.slice(match.length-1, match.length);
    var firstChar = match.slice(0, 1);
    if(other_words.indexOf(match.toLowerCase())!==-1){
        stats.sobv_all++;
        var inQuote = checkForQuote(offset);
        if(!inQuote){stats.sobv++}
        return firstChar+'<span style="background-color: #'+(inQuote?'fff9d5':'ffce00')+'>'+match+'</span>'+lastChar;
        //Highlight String
    }
    else if(wc.indexOf(lastChar)!==-1 && wc.indexOf(firstChar)!==-1){
        stats.sobv_all++;
        var inQuote = checkForQuote(offset);
        if(!inQuote){stats.sobv++}
        return firstChar+'<span style="background-color: #'+(inQuote?'fff9d5':'ffce00')+'">'+match.slice(1,match.length-1)+'</span>'+lastChar;
        //Highlight string
    }
    else{
        return match;//False detection (ex. am in camera)
    }
}

var gq = 0;
function grayQuotes(match, offset){
    if(gq === 0){
        gq = 1;
        return '<span style="color: #888">'+match;
    }
    else{
        gq = 0;
        return match+'</span>';
    }
}

function markQuotes(str){
    quotePos = {start: [],end: []};
    var newstr = str;
    newstr = str.replace(/&ldquo;|&rdquo;/g,'&quot; ');
    var slicePos = 0;
    var t = 0;
    while(typeof str === 'string' && newstr.indexOf('&quot;')!==-1){
        if(t === 0){
            t = 1;
            quotePos.start[quotePos.start.length]=newstr.indexOf('&quot;')+slicePos;
        }
        else{
            t = 0;
            quotePos.end[quotePos.end.length]=newstr.indexOf('&quot;')+slicePos;
        }
        slicePos += (newstr.indexOf('&quot;')+1);
        newstr = newstr.slice(newstr.indexOf('&quot;')+1);
    }
}

var ptmarked = [];
function ptreplacer(match, offset){
    let term = match.toLocaleLowerCase();
    if(wc.indexOf(term.slice(-1)) !== -1){term = term.slice(0, term.length-1)}
    if(['bed','red','need','reed', 'breed', 'seed','deed','feed'].indexOf(term)!==-1){return match}//False positives (not completely inclusive)
    var lastChar = match.slice(match.length-1, match.length);
    var firstChar = '';
    if(wc.indexOf(match.slice(0, 1)) !== -1){firstChar = match.slice(0, 1); match = match.slice(1)}
    var id = createString(6);
    ptmarked[ptmarked.length] = offset;
    var inQuote = checkForQuote(offset);
    stats.pastTense_all++;
    if(!inQuote){
        stats.pastTense ++;
        ptmarked[ptmarked.length] = id;
    }
    return firstChar+'<span data-pt'+id+' style="text-decoration:underline">'+match.slice(0, match.length-1)+'</span>'+lastChar;
};

function ptmark(){
    for(var i = 0; i < ptmarked.length; i++){
        var pos = edata.indexOf('pt'+ptmarked[i]);
        var str = edata;
        var foundStart = false;
        var p = pos;
        while (!foundStart && p > 0){
            p -= 1;
            var s = edata.slice(p, p+1);
            if(s === '&quot;' || s === '.' || s === ',' || s === '!' || s === ';' || s === '?' || edata.slice(p-2, p+1)==='<p>'){
                foundStart = true;
            }
        }
        var foundEnd = false;
        var p2 = pos;
        while (!foundEnd && p2 < str.length){
            p2 += 1;
            var s = edata.slice(p2, p2+1);
            if(s === '&quot;' || s === '.' || s === ',' || s === '!' || s === ';' || s === '?'){
                foundEnd = true;
            }
        }
        if(p !== -1){
            var startpos = 0;
            if(str.slice(0, 1) === ' '){startpos = 1}
            edata = str.slice(startpos, p+1)+'<span style="background-color: #c4ddff">'+str.slice(p+1, p2+1)+'</span>'+edata.slice(p2+1);
        }
    }
    ptmarked = [];
}

function markText(){
    stats.sobv=0;
    stats.sobv_all=0;
    stats.pastTense=0;
    stats.pastTense_all=0;
    quotePos = {
        start: [],
        end: []
    };
    edata = editor.getData();//Get the text from the editor
    edata = edata.replace(/&quot;|&ldquo;|&rdquo;/ig, grayQuotes);//Gray out quotes
    if(searchPastTense){
        for(var i = 0; i < ptv.length; i++){
            markQuotes(edata);
            console.log(ptv[i]);
            edata = edata.replace(ptv[i],ptreplacer);
            ptmark(edata);
        }
    }
    for(var i = 0; i < hwords.length; i++){
        markQuotes(edata);
        //Mark position of quotes (not very efficient, but prevents inaccuracy from HTML characters)
        edata = edata.replace(hwords[i], replacer);//Run the replacer on every word from the list
    }
    editor.setData(edata);//Set the data in the editor with the highlighted version
    if(stats.sobv > 0){
        alertify.success("Found "+stats.sobv+" State of Being Verbs (Gold)");
    }
    else{
        alertify.success("No instances to highlight")
    }
    if(stats.pastTense > 0){
        alertify.success('Found '+stats.pastTense+' Past Tense Sentences (Blue)')
    }
    //Send the results in a notification
}

function cl(){
    alertify.alert('<p style="text-align:left;padding:0px 12px;margin-top:0"><b>Changelog</b><br><br>Relase v2.1 (11/13/17): </p><ul style="text-align:left"><li>Improved past tense checker (fewer false positives, more detections, minor improvements)</li><li>Improved site metadata/descriptions</li><li>Several minor aesthetic changes</li><li>Changed license to CC-BY-NC-SA 4.0</li></ul><p style="text-align:left;padding:12px;padding-bottom:0px;line-height:0">Release v2.0 (2/15/17): </p><ul style="text-align:left"><li>Better, simpler, updated editor</li><li>Now uses MLA styling: "12px" font (16px actual size) w/ Double Spacing (Customizable)</li><li>Results now differentiate between verbs in quotes and verbs outside of quotes</li><li>Basic past tense checker (looks for sentences written with past tense verbs)</li><li>Different colored highlighting for SOBV/Past Tense</li></ul>')
}

function formatEditor(v){
    if(v === 0){
        bfe0.disabled = true;
        bfe1.disabled = false;
        altStyle.innerHTML = '';
        localStorage.sobvcFormat = '0';
    }
    else{
        bfe0.disabled = false;
        bfe1.disabled = true;
        altStyle.innerHTML = ".cke_editable{font-family: 'Arial', sans-serif;font-size: 14px;line-height: 1.15;}";
        localStorage.sobvcFormat = '1';
    }
}

function togglePTVS(){
    if(searchPastTense){
        searchPastTense = false;
        localStorage.sobvcSPT = '0';
        bptv.style.backgroundColor = '#f9ffce';
        bptv.innerHTML = 'Inactive';
    }
    else{
        searchPastTense = true;
        localStorage.sobvcSPT = '1';
        bptv.style.backgroundColor = '#daffe7';
        bptv.innerHTML = 'Active';
    }
}

if(localStorage.sobvcFormat === '1'){formatEditor(1)}
if(localStorage.sobvcSPT === '0'){togglePTVS()}
