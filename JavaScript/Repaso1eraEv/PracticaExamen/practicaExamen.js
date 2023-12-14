import {datos} from "./datos.js"

const arrayCsv= cvsToArray();
const cabecera = extraerCabecera();
const arrObj = arrayAObjetos();
const tabla = crearTabla();
anadirEventL(tabla);
document.body.appendChild(tabla);

function cvsToArray(){
    return datos
                .split("\n")
                .map(linea=>linea.trim()
                                 .split(",")
                                 .map(dato=>dato.trim())
                                 .filter(campo=>campo)     
                                 )  
                                  
                .filter(elem=>elem.length===4);
}
function extraerCabecera(){
    return arrayCsv.shift();
}
function arrayAObjetos(){
    return arrayCsv.map(array=>array.reduce(function(acc,v,p){
        acc[cabecera[p]]=v;
        return acc;
    },{}));
}
function crearTabla(){
    let table = crearNodo("table");
    let tHeader= crearTheader();
    table.appendChild(tHeader);
    let tbody = crearTbody();
    table.appendChild(tbody);
    return table;
}
function crearTheader(){
    let tHead =  crearNodo("thead");
    let tr = crearNodo("tr");
    cabecera.forEach(function(cab){
        let th= crearNodo("th",cab);
        tr.appendChild(th);
    })
    tHead.appendChild(tr);
    return tHead;
}
function crearTbody(){
    let tbody=crearNodo("tbody");
    arrObj.forEach(function(obj){
        let tr = crearNodo("tr");
        for(let camp in obj){
            let td=crearNodo("td",obj[camp]);
            tr.appendChild(td);
        }
        tbody.appendChild(tr)
    })
    return tbody;
}
function crearNodo(elemento, contenido){
    const nodo = document.createElement(elemento);
    contenido&&nodo.appendChild(document.createTextNode(contenido));
    nodo.style.border="1px solid fuchsia";
    return nodo;
}
function anadirEventL(tabla){
    let alocate=tabla.tHead.children[0].children;

    [...alocate].forEach((th)=>{
        th.addEventListener("click",clickeaste);
        th.style.cursor="Pointer";
    })
    function clickeaste(evt){
        let elem = evt.currentTarget;
        let clas= elem.innerHTML;
        
        if (estado[clas]==="asc")desc(clas);
        else asc(clas);
        let padre = document.querySelector("body");
        padre.removeChild(padre.firstElementChild);
        let refurbrished = crearTabla();
        anadirEventL(refurbrished)
        padre.appendChild(refurbrished);
    }    
}
function asc(clas){
    arrObj.sort((a,b)=>(a[clas]>b[clas]&&1)||-1);
    for(let prop in estado){
        if(prop==clas) estado[prop]="asc";
        else estado[prop]="none"
    }
}

function desc(clas){
    arrObj.sort((a,b)=>(a[clas]<b[clas]&&1)||-1);
    for(let prop in estado){
        if(prop==clas) estado[prop]="desc";
        else estado[prop]="none"
    }
}
let estado={
    QuotaAmount:"none",
    StartDate:"none",
    OwnerName:"none",
    Username:"none"
}
