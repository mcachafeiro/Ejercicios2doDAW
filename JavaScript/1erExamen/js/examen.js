/* ---------------------------------------
Pon aquí tu nombre y apellido, por favor.
Marcos Cachafeiro 

------------------------------------------*/


/*
* Se pueden utilizar los formatos de las correspondientes resultados de los diferentes pasos.
* Se encuentran en datos.js y, en cada paso pertinente, se indica la variable correspondiente
* Si se utiliza alguna de esas variables, en el apartado correspondiente a su generación,
* se tendrá un 0
*/


/*
++ salida en la variable salP1 de datos.js 
*/

const arrObj= tratarDatosEntrada(datos,"\n",";");
const arrObjFiltrado = filtarPorFecha(arrObj,"date","2023-11-30");
const arrayFinal= realizarTablaIncidencias(arrObjFiltrado);
let tablaInicial = crearTablaHTML(arrayFinal);
pintar(tablaInicial);//si ejecutas en consola esta funcion si me dibuja la tabla en el html
function tratarDatosEntrada(cadena, sepLinea, sepCampos) {
  let arrDatos= cadena.trim()
                     .split(sepLinea)
                     .map(linea=>linea.trim()
                                      .split(sepCampos).map(campo=>campo.trim()))
                     ;
  let cabecera = arrDatos.shift();
  return aObjeto(arrDatos,cabecera);
}


function aObjeto(array,nomCampos) {
  return array.map(datos=>datos.reduce((acc,v,p)=>{
    acc[nomCampos[p]]=v;
    return acc;
  },{}));
}


/*
++ salida en la variable salP3 
*/
function filtarPorFecha(array, campo, fecha) {
  fecha=new Date(fecha);
  return array.filter((objeto)=>{
    fechaObj= new Date(objeto[campo]);
    return fechaObj.getDate()===fecha.getDate()&&fechaObj.getMonth()===fecha.getMonth()&&fechaObj.getFullYear()===fecha.getFullYear();
  });
}



function objetosConCampos(arrayObj, campos) {
  return arrayObj.map(objeto=>{
    return campos.reduce((acc,v)=>{
                    acc[v]=objeto[v];
                    return acc;
                  },{});
  });
}
   

/*
++ salida en la variable salP5 
*/
function realizarTablaIncidencias(arrayObj) {
  // Las fórmulas son:

  // Para 7 días
  // Si hay un valor en cases_PCR_7days, utilizarlo. Si no, utilizar el valor de cases_7days
  // La incidencia se calcula con el valor anterior dividido entre la población y multiplicado por 1000000

  // Para 14 días
  // Si hay un valor en cases_PCR_14days, utilizarlo. Si no, utilizar el valor de cases_14days
  // La incidencia se calcula con el valor anterior dividido entre la población y multiplicado por 1000000

  
  
  return arrayObj.map(obj=>anadirProps(obj));

  function anadirProps(objeto){
    objeto["ia7d"]=sieteDays(objeto);
    objeto["ia14d"]=catorceDays(objeto);
    return objeto;
  }
  function sieteDays(objeto){
    let valor= (objeto["cases_PCR_7days"]==""&&objeto["cases_7days"])||objeto["cases_PCR_7days"];
    let resultado = (valor / objeto["poblacion"]) * 100000;
    resultado = Math.floor(resultado*10)/10;
    return resultado;
  }
  function catorceDays(objeto){
    let valor= (objeto["cases_PCR_14days"]==""&&objeto["cases_14days"])||objeto["cases_PCR_14days"];
    let resultado = (valor / objeto["poblacion"]) * 100000;
    resultado = Math.floor(resultado*10)/10;
    return resultado;
  }
}


function crearTablaHTML(arrayObj) {
/*
  table
    caption 
    thead
      tr
        th
    tbody
      tr
        td
    tfoot
      tr
        td
*/
let tabla = crearNodo("table");
let header = ["ine_code","ccaa","ia7d","ia14d"];
let caption = crearNodo("caption","Incidencias al 30/11");
tabla.appendChild(caption);
let tHead =crearThead();
tabla.appendChild(tHead);
let tbody = crearTbody();
tabla.appendChild(tbody);
let tfooter = crearTfooter();
tabla.appendChild(tfooter);

return tabla;
function crearTfooter(){
  let tf = crearNodo("tfoot");
  let tr = crearNodo("tr");
  let td= crearNodo("td");
  tr.appendChild(td);
  td=crearNodo("td");
  tr.appendChild(td);
  td = crearNodo("td",calcularFooter()[0]);
  tr.appendChild(td);
  td = crearNodo("td",calcularFooter()[1]);
  tr.appendChild(td);
  tf.appendChild(tr);
  return tf;

  function calcularFooter(){
    let resultado=[];
    resultado[0]=Math.floor((arrayObj.reduce((acc,v)=>acc+v["ia7d"],0)/arrayObj.length)*10)/10;
    resultado[1]=Math.floor((arrayObj.reduce((acc,v)=>acc+v["ia14d"],0)/arrayObj.length)*10)/10;
    return resultado;
  }
}

function crearTbody(){
  let tb = crearNodo("tbody");
  arrayObj.forEach(objeto=>{
    let tr = crearNodo("tr");
    header.forEach(campo=>{
      let td = crearNodo("td",objeto[campo]);
      tr.appendChild(td);
    })
    tb.appendChild(tr);
  })
  return tb;
}

function crearThead(){
  let tHead2 = crearNodo("thead");
  let trh = crearNodo("tr");
  header.forEach(texto=>{
    let th = crearNodo("th",texto);
    trh.addEventListener("click",clickeaste)
    trh.appendChild(th);
  });
  tHead2.appendChild(trh);
  return tHead2;
}

function crearNodo(elemento, contenido){
  let nodo = document.createElement(elemento);
  (contenido)&&nodo.appendChild(document.createTextNode(contenido));
  return nodo;
}
}

function pintar(elementos){
  document.body.insertBefore(elementos,document.body.firstElementChild);
}
function clickeaste(evt){
  let elem = evt.currentTarget;
  let texto = elem.innerHTML;
  ordenar(texto);
  let nuevaTabla = crearTablaHTML(arrayFinal);
  document.body.removeChild(document.body.firstElementChild);
  pintar (nuevaTabla);
}
function ordenar(texto){
  if(estado[texto]=="asc"){
    asc(texto);
    estado[text]="asc";
  }else{
    desc(texto);
    estado[text]="desc";
  }
}
function asc(texto){
 arrayFinal.sort((a,b)=>(a[texto]>b[texto])?1:-1);
}
function desc(texto){
  arrayFinal.sort((a,b)=>(a[texto]<b[texto])?1:-1);
}

const estado={
  "ine_code":"none",
  "ccaa":"none",
  "ia7d":"none",
  "ia14d":"none"
}

