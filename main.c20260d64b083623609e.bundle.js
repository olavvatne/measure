(()=>{"use strict";var e,t={524:(e,t,n)=>{var a=n(379),o=n.n(a),r=n(424);o()(r.Z,{insert:"head",singleton:!1}),r.Z.locals;var i=n(709),s=n(169),l=n(903),d=n(526),c=n.n(d),u=n(470),p=n(787),m=n(900);o()(m.Z,{insert:"head",singleton:!1}),m.Z.locals;const g={name:"dimensionViewable",props:{color:String},events:{},render(e,t){const n=e.getRect();return t.createElement("div",{key:"dimension-viewer",className:e.props.color+"moveable-dimension",style:{position:"absolute",left:n.width/2+"px",top:`${n.height+20}px`,background:"#4af",borderRadius:"2px",padding:"2px 4px",color:"white",fontSize:"13px",whiteSpace:"nowrap",fontWeight:"bold",willChange:"transform",transform:"translate(-50%, 0px)"}},Math.round(n.offsetWidth)," x ",Math.round(n.offsetHeight))}},f={name:"LabelLeftViewable",props:{color:String,displayName:String,valueLeft:Number},events:{},render(e,t){const n=e.getRect(),{pos2:a}=e.state,o=`translate(${a[0]}px, ${a[1]}px) rotate(${n.rotation}deg)  translate(${-n.offsetWidth-30}px, -50px)`;return t.createElement("div",{key:"label-viewer-left",className:"moveable-label-left",style:{position:"absolute",left:"0px",top:"0px",background:e.props.color,borderRadius:"2px",padding:"2px 4px",color:"white",fontSize:"13px",whiteSpace:"nowrap",fontWeight:"bold",willChange:"transform",transform:o,transformOrigin:"0px 0px"}},t.createElement("label",{style:{display:"block"}},"Start ",e.props.displayName),t.createElement("input",{key:e.props.valueLeft,className:"moveable-input",type:"tel",pattern:"^-?[0-9]\\d*\\.?\\d*$",style:{display:"block",margin:"auto",width:"30px",background:"transparent",color:"white"},defaultValue:e.props.valueLeft,onBlur:e.props.onValueLeft}))}},h={name:"LabelRightViewable",props:{color:String,displayName:String,valueRight:Number},events:{},render(e,t){const n=e.getRect(),{pos2:a}=e.state,o=`translate(${a[0]}px, ${a[1]}px) rotate(${n.rotation}deg)  translate(-30px, -50px)`;return t.createElement("div",{key:"label-right-viewer",className:"moveable-label-right",style:{position:"absolute",left:"0px",top:"0px",background:e.props.color,borderRadius:"2px",padding:"2px 4px",color:"white",fontSize:"13px",whiteSpace:"nowrap",fontWeight:"bold",willChange:"transform",transform:o,transformOrigin:"0px 0px"}},t.createElement("label",{style:{display:"block"}},"End ",e.props.displayName),t.createElement("input",{key:e.props.valueRight,className:"moveable-input",type:"tel",pattern:"^-?[0-9]\\d*\\.?\\d*$",style:{display:"block",margin:"auto",width:"30px",background:"transparent",color:"white"},defaultValue:e.props.valueRight,onBlur:e.props.onValueRight}))}},b={name:"EdgeClickable",props:{color:String,onEdge:Function,name:String,fluidEdge:Number,valueLeft:Number,valueRight:Number},events:{},render(e,t){const n=e.getRect(),{pos2:a}=e.state,o=Math.max(30,.05*n.offsetWidth),r=function(e,t,n,a,o){return null===e?null:(e-a)/(o-a)*(n-2*t)+t}(e.props.fluidEdge,o,n.offsetWidth,e.props.valueLeft,e.props.valueRight),i=e.props.fluidEdge,s=`translate(${a[0]}px, ${a[1]}px) rotate(${n.rotation}deg)  translate(${-n.offsetWidth}px, 00px)`;return t.createElement("div",{key:"edge-clickable-viewer",onClick:function(t){const a=Math.max(30,.05*n.offsetWidth),o=function(e,t,n,a,o){return(e-t)/(n-2*t)*(o-a)+a}(t.nativeEvent.offsetX,a,n.offsetWidth,e.props.valueLeft,e.props.valueRight);e.props.onEdge({value:o,name:e.props.name})},className:"moveable-edge-clickable",style:{position:"absolute",left:"0px",top:"0px",color:"white",fontSize:"13px",whiteSpace:"nowrap",fontWeight:"bold",willChange:"transform",transform:s,transformOrigin:"0px 0px"}},t.createElement("div",{style:{width:n.offsetWidth,height:n.offsetHeight}},t.createElement("div",{style:{position:"absolute",pointerEvents:"none",borderLeft:"2px dotted "+e.props.color,borderRight:"2px dotted "+e.props.color,width:n.offsetWidth-2*o,height:n.offsetHeight,left:o}}),null!==r?t.createElement("div",{className:"edge-line",style:{width:"1px",height:n.offsetHeight,left:r,position:"relative"}},t.createElement("label",{style:{position:"relative",left:-30,top:"-80px"}},i?i.toFixed(3):null)):null))}};function w({imageId:e,name:t,color:n,displayName:a,disabled:o,measureValues:r,value:s,setValue:l,setMeasureValues:d}){const[c]=i.useState((()=>new p.Z)),m=i.useRef(null),w=i.useRef(null);if(i.useEffect((()=>{if(w.current){var e=c.createFrame(m.current);r&&r.rotation&&(w.current.moveable.rotation=r.rotation,e.properties.transform.rotate=r.rotation+"deg",w.current.moveable.request("rotatable",{rotate:r.rotation},!0)),r&&r.offsetHeight&&r.offsetWidth&&w.current.moveable.request("resizable",{offsetWidth:r.offsetWidth,offsetHeight:r.offsetHeight},!0),r&&r.x&&r.y&&w.current.moveable.request("draggable",{x:r.x,y:r.y},!0),w.current.moveable.updateRect(),w.current.moveable.updateTarget()}}),[m]),!r||0===Object.keys(r).length)return null;const v=r,x=`rotate(${v.rotation||0}deg)`;return i.createElement("div",{className:"fluid-area"},i.createElement("div",{className:"target",ref:m,style:{transform:x,top:r.y,left:r.x,width:v.offsetWidth+"px",height:v.offsetHeight+"px"}}),i.createElement(u.ZP,{className:t+" "+n,key:e+t,ref:w,target:m,ables:[g,f,h,b],props:{dimensionViewable:!0,LabelLeftViewable:!0,LabelRightViewable:!0,EdgeClickable:!0,name:t,fluidEdge:s,displayName:a,valueLeft:r.minValue,valueRight:r.maxValue,color:n,onValueRight:e=>{e.target.validity.valid&&d({...r,maxValue:parseFloat(e.target.value)})},onValueLeft:e=>{e.target.validity.valid&&d({...r,minValue:parseFloat(e.target.value)})},onEdge:e=>{l(e.value)}},renderDirections:["n","s","w","e"],origin:!1,draggable:!o,resizable:!o,rotatable:!o,onDragStart:e=>{c.onDragStart(e)},onDrag:e=>{c.onDrag(e)},onDragEnd:e=>{const t=c.map.get(e.target),n=(r.x||0)+parseFloat(t.properties.transform.translate.value[0].replace("px","")),a=(r.y||0)+parseFloat(t.properties.transform.translate.value[1].replace("px",""));d({...r,x:n,y:a})},onResizeStart:c.onResizeStart,onResize:c.onResize,onResizeEnd:e=>{const t=c.map.get(e.target),n=(r.x||0)+parseFloat(t.properties.transform.translate.value[0].replace("px","")),a=(r.y||0)+parseFloat(t.properties.transform.translate.value[1].replace("px",""));d({...r,y:a,x:n,offsetHeight:e.lastEvent.offsetHeight,offsetWidth:e.lastEvent.offsetWidth})},onRotateStart:c.onRotateStart,onRotate:c.onRotate,onRotateEnd:e=>{r.rotation?Math.abs(r.rotation-e.lastEvent.rotate)>.001&&d({...wmeasureValues,rotation:e.lastEvent.rotate}):d({...r,rotation:e.lastEvent.rotate})}}))}w.propTypes={name:c().string,imageId:c().string,color:c().string,displayName:c().string,measureValues:c().object,disabled:c().bool,value:c().number,setValue:c().func,setMeasureValues:c().func},w.defaultProps={imageId:"",name:"og",color:"red",displayName:"O/G",measureValues:{minValue:5,minValue:10,rotation:0,x:20,y:20,offsetWidth:200,offsetHeight:200},disabled:!1,value:null,setValue:()=>{},setMeasureValues:()=>{}};const v={version:1,images:{},currentMeasurer:{og:null,ow:null},historicMeasurer:{og:{0:{fromDate:0,offsetWidth:200,offsetHeight:100,x:20,y:100,minValue:1,maxValue:18,minLocation:null,maxLocation:null}},ow:{0:{fromDate:0,x:320,y:100,offsetWidth:200,offsetHeight:100,minValue:1,maxValue:18,minLocation:null,maxLocation:null}}},view:{scale:1,pointX:0,pointY:0},table:{pageIndex:0,pageSize:20}},x=(0,i.createContext)(v),{Provider:y}=x,E=({children:e})=>{const[t,n]=(0,i.useReducer)(((e,t)=>{let n=null;switch(t.type){case"ViewChangeAction":return n={...e,view:t.data},n;case"HydrateAction":return n=t.data,n;case"TableChangeAction":return n={...e,table:{...e.table,...t.data}},n;case"ImagesChangeAction":return n={...e,images:t.data},n;case"SetCurrentMeasurerAction":{const a=t.data.dateUnix,o=Object.keys(e.historicMeasurer),r={};for(let t=0;t<o.length;t++){const n=Object.values(e.historicMeasurer[o[t]]).reduce((function(e,t){const n=a-e.fromDate,o=a-t.fromDate;return o<0?e:n>o?t:e}));r[o[t]]=n}return n={...e,currentMeasurer:r},n}case"NewMeasureValuesAction":{const n=Object.keys(t.data);let a={...e};for(let o=0;o<n.length;o++){const r=n[o],i=t.data[r],s=e.currentMeasurer[r],l=i.dateUnix,d=i.values;if(!s||!d)continue;let c=new Set([...Object.keys(d),...Object.keys(s)]);c.delete("fromDate"),c.delete("value"),c.delete("id");const u=[...c];let p=!0;for(let e=0;e<u.length;e++)if(d[u[e]]!==s[u[e]]){p=!1;break}const m={...a.images,[i.id]:{...a.images[i.id],values:{...a.images[i.id].values,[i.name]:i.recordedValues[i.name]}}};a=p?{...a,images:m}:{...a,historicMeasurer:{...a.historicMeasurer,[i.name]:{...a.historicMeasurer[i.name],[l+""]:{...d,fromDate:l}}},images:m}}return a}default:throw new Error}}),v);return i.createElement(y,{value:{state:t,dispatch:n}},e)};function k({imageMode:e,children:t}){const n=(0,i.useContext)(x),{dispatch:a,state:o}=n,r=(0,i.useRef)(),[s,l]=(0,i.useState)({panning:!1,start:{x:0,y:0}});function d(e,t,n){r.current.style.transform=`translate(${e}px, ${t}px)  scale(${n})`}return(0,i.useEffect)((()=>{let{pointX:e,pointY:t,scale:n}=o.view;d(e,t,n)})),i.createElement("div",{id:"zoom",ref:r,onWheel:function(t){if(!e)return;let{pointX:n,pointY:r,scale:i}=o.view;var s=(t.clientX-n)/i,l=(t.clientY-r)/i;(t.wheelDelta?t.wheelDelta:-t.deltaY)>0?i*=1.2:i/=1.2,n=t.clientX-s*i,r=t.clientY-l*i,d(n,r,i),a({type:"ViewChangeAction",data:{scale:i,pointX:n,pointY:r}})},onMouseDown:function(t){if(!e)return;t.preventDefault();let{pointX:n,pointY:a}=o.view;const r={x:t.clientX-n,y:t.clientY-a};l({...s,start:r,panning:!0})},onMouseUp:function(t){e&&(t.preventDefault(),l({...s,panning:!1}))},onMouseMove:function(t){if(!e)return;t.preventDefault();let{pointX:n,pointY:r,scale:i}=o.view,{panning:l,start:c}=s;l&&(n=t.clientX-c.x,r=t.clientY-c.y,d(n,r,i),a({type:"ViewChangeAction",data:{scale:i,pointX:n,pointY:r}}))}},t)}function S(e,t,n){(0,i.useEffect)((()=>{function n(n){n.key===e&&t()}return window.addEventListener("keyup",n),()=>window.removeEventListener("keyup",n)}),n)}var M=n(110);function R(){let{guid:e}=(0,M.UO)();const t=(0,i.useContext)(x),{dispatch:n,state:a}=t;let o=(0,M.k6)();const r=a.images[e]||{},[s,d]=(0,i.useState)(!1),[c,u]=(0,i.useState)({og:r.values.og,ow:r.values.ow}),[p,m]=(0,i.useState)({og:a?.currentMeasurer.og,ow:a?.currentMeasurer.ow});function g(e){const t=p,a=c,i=r,s={dateUnix:i.date,name:"og",values:t.og,id:i.id,recordedValues:a},l={dateUnix:i.date,name:"ow",values:t.ow,id:i.id,recordedValues:a};(s.dateUnix||l.dateUnix)&&n({type:"NewMeasureValuesAction",data:{og:s,ow:l}}),o.push(e)}function f(){r.nextId&&g("/image/"+r.nextId)}function h(){r.prevId&&g("/image/"+r.prevId)}(0,i.useEffect)((()=>{if(!window.imageApi.getImage)return;const e=r.date;n({type:"SetCurrentMeasurerAction",data:{dateUnix:e}}),window.imageApi.getImage(r.path).then((e=>{const t=URL.createObjectURL(new Blob([e.buffer],{type:"image/png"})),n=document.getElementById("image-container");n.style.transform="rotate(90deg) translatex(-50%)",n.src=t,window.firstWidth||(window.firstWidth=window.innerWidth),n.style.width=window.firstWidth+"px",n.onload=()=>{URL.revokeObjectURL(t)}}))}),[r?.path]),(0,i.useEffect)((()=>{m({og:a?.currentMeasurer.og,ow:a?.currentMeasurer.ow})}),[r.id,JSON.stringify(a.currentMeasurer)]),(0,i.useEffect)((()=>{u({og:r.values.og,ow:r.values.ow})}),[r.id,JSON.stringify(a.images[e])]),S("q",(()=>{d(!s)}),[s]),S("ArrowRight",(()=>{f()}),[r.id,r,p,c]),S("ArrowLeft",(function(){h()}),[r.id,r,p,c]);const b=s?"primary-button":"secondary-button";return i.createElement("div",{className:"image-container"},i.createElement("div",{className:"top-bar"},i.createElement("button",{className:"",onClick:function(){g("/")}},i.createElement(l.NoV,{size:16})),i.createElement("button",{className:" "+b,onClick:e=>d(!s)},i.createElement(l.W1M,{size:16})),i.createElement("div",{className:"controls"},r.prevId?i.createElement("button",{className:"controls-prev ",onClick:h},i.createElement(l.Y4O,{size:16})):null,r.nextId?i.createElement("button",{className:"controls-next ",onClick:f},i.createElement(l.LZ3,{size:16})):null)),i.createElement(k,{imageMode:s},i.createElement(w,{key:JSON.stringify(p.og)+JSON.stringify(c.og||null)+r.id+"og",imageId:r.id,name:"og",displayName:"O/G",color:"red",position:"left",disabled:s,value:c.og,setValue:e=>u({og:e,ow:c.ow}),measureValues:p.og,setMeasureValues:e=>m({og:e,ow:p.ow})}),i.createElement(w,{key:JSON.stringify(p.ow)+JSON.stringify(c.ow||null)+r.id+"ow",imageId:r.id,name:"ow",displayName:"O/W",color:"blue",position:"right",disabled:s,value:c.ow,setValue:e=>u({ow:e,og:c.og}),measureValues:p.ow,setMeasureValues:e=>m({ow:e,og:p.og})}),i.createElement("img",{id:"image-container"})))}var C=n(894);async function N(e){const t=(new TextEncoder).encode(e),n=await window.crypto.subtle.digest("SHA-1",t);return Array.from(new Uint8Array(n)).map((e=>e.toString(16).padStart(2,"0"))).join("")}function O(){return/electron/i.test(navigator.userAgent)}var A=n(386),V=n(564);o()(V.Z,{insert:"head",singleton:!1}),V.Z.locals;var I=n(615),D=n.n(I);class z{constructor(e){this.maxDiffSeconds=e}match(e,t){const n=[];if(!e||!t)return n;let a=0,o={};for(let r=0;r<e.length;r++){const i=e[r];let s=!1;if(i){for(let l=a;l<t.length;l++){const d=t[l];if(!d)continue;if(i===d){n.push({from:r,to:l}),s=!0,a=l+1;break}const c=A.unix(i).diff(A.unix(d),"seconds");if(c<this.maxDiffSeconds&&c>0){let u=Number.MAX_SAFE_INTEGER;if(l+1<t.length){const e=t[l+1];u=A.unix(i).diff(A.unix(e),"seconds")}if(Math.abs(u)<Math.abs(c))continue;let p=Number.MAX_SAFE_INTEGER;if(o.index&&!o.hadMatch){const t=e[o.index];p=A.unix(t).diff(A.unix(d),"seconds")}Math.abs(p)<Math.abs(c)?n.push({from:o.index,to:l,comment:"within 5 minutes"}):n.push({from:r,to:l,comment:"within 5 minutes"}),a=l+1,s=!0;break}r===e.length-1&&Math.abs(c)<this.maxDiffSeconds&&n.push({from:r,to:l,comment:"within 5 minutes"})}o={index:r,hadMatch:s}}}return n}}function W(e){var t=([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,(e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16)))+".csv",n=new Blob([e],{type:"text/csv;charset=utf-8;"}),a=document.createElement("a");if(void 0!==a.download){var o=URL.createObjectURL(n);a.setAttribute("href",o),a.setAttribute("download",t),a.style.visibility="hidden",document.body.appendChild(a),a.click(),document.body.removeChild(a)}}function j(){return O()?window.matchMedia("(prefers-color-scheme: dark)").matches:"dark"==document.documentElement.getAttribute("data-theme")}function L({onTableChange:e,tableInstance:t}){const{canPreviousPage:n,canNextPage:a,pageOptions:o,pageCount:r,gotoPage:s,page:l,nextPage:d,previousPage:c,setPageSize:u,state:{pageIndex:p,pageSize:m}}=t;function g(t){e({pageIndex:t}),s(t)}return i.createElement("div",{className:"table-pagination"},i.createElement("button",{onClick:()=>g(0),disabled:!n},"<<")," ",i.createElement("button",{onClick:function(){e({pageIndex:p-1}),c()},disabled:!n},"<")," ",i.createElement("button",{onClick:function(){e({pageIndex:p+1}),d()},disabled:!a},">")," ",i.createElement("button",{onClick:()=>g(r-1),disabled:!a},">>"),i.createElement("span",null,"Page"," ",i.createElement("strong",null,p+1," of ",o.length)," "),i.createElement("select",{value:m,onChange:t=>{const n=Number(t.target.value);e({pageSize:n,pageIndex:Math.floor(l[0].index/n)}),u(n)}},[10,20,30,40,50].map((e=>i.createElement("option",{key:e,value:e},"Show ",e)))))}function H(){return(H=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function P({onRowClick:e,tableInstance:t}){const{getTableProps:n,getTableBodyProps:a,headerGroups:o,prepareRow:r,page:s}=t;return i.createElement("table",H({},n(),{className:"overview-table"}),i.createElement("thead",null,o.map((e=>i.createElement("tr",e.getHeaderGroupProps(),e.headers.map((e=>i.createElement("th",e.getHeaderProps(),i.createElement("span",e.getSortByToggleProps(),e.render("Header"),e.isSorted?e.isSortedDesc?" 🔽 ":" 🔼 ":""),i.createElement("div",H({},e.getResizerProps(),{className:"resizer "+(e.isResizing?"isResizing":"")}))))))))),i.createElement("tbody",a(),s.map((t=>(r(t),i.createElement("tr",H({},t.getRowProps(),{onClick:n=>e(t),className:void 0!==t.original.fromDate?"measure-row":null}),t.cells.map((e=>i.createElement("td",e.getCellProps(),e.render("Cell"))))))))))}function T(){const e=(0,i.useContext)(x),{dispatch:t,state:n}=e,[a,o]=(0,i.useState)(!1),[r,s]=(0,i.useState)(j());let d=(0,M.k6)();const c=(0,i.useMemo)((()=>P.columnConfig),[]),u=i.useMemo((()=>{let e=Object.values(n.historicMeasurer.og),t=Object.values(n.historicMeasurer.ow);return e=e.filter((e=>e.fromDate>0)).map((e=>(e.id="og",e))),t=t.filter((e=>e.fromDate>0)).map((e=>(e.id="ow",e))),console.log(e),[...e,...t,...Object.values(n.images)]}),[n.images]),p=(0,C.useTable)({columns:c,data:u,initialState:{pageIndex:n.table.pageIndex,pageSize:n.table.pageSize,sortBy:[{id:"Date",desc:!1}]}},C.useSortBy,C.useBlockLayout,C.useResizeColumns,C.usePagination);return i.createElement("div",null,i.createElement("div",{style:{padding:"5px"}},i.createElement("button",{onClick:()=>async function(){o(!0),window.imageApi.openDialog().then((async e=>{var n={};console.log(e);for(let t=0;t<e.length;t++){const a=await N(e[t].path),o=t>=e.length-1?null:await N(e[t+1].path),r=t<=0?null:await N(e[t-1].path);n[a]={id:a,path:e[t].path,date:A(e[t].date).unix(),values:{},nextId:o,prevId:r}}o(!1),t({type:"ImagesChangeAction",data:n})})).catch((()=>{o(!1)}))}()},i.createElement(l.XBm,{size:16})),i.createElement("button",{onClick:async function(){let e=!1;e=O()?await window.darkMode.toggle():j(),function(e){O()?window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.setAttribute("data-theme","light"):e?(console.log("hello"),document.documentElement.setAttribute("data-theme","dark")):(console.log("hello2"),document.documentElement.setAttribute("data-theme","light"))}(!e),s(e)}},r?i.createElement(l.kLh,{size:16}):i.createElement(l.NWY,{size:16})),i.createElement("button",{onClick:function(){document.getElementById("export-dropdown").classList.toggle("show")},disabled:!Object.keys(n.images).length>0},i.createElement(l.Rdq,{size:16})),i.createElement("div",{id:"export-dropdown",className:"dropdown-content"},i.createElement("a",{onClick:()=>function(e){const t=Object.values(e).sort(((e,t)=>e.date<t.date)).map((e=>{var t=A.unix(e.date);return{date:t.format("MM/DD/YY"),time:t.format("HH:mm:ss"),unix:e.date,og:e.values.og||"",ow:e.values.ow||""}}));W(D().unparse(t))}(n.images)},"Export to csv"),i.createElement("a",{onClick:()=>async function(e){const[t]=await window.showOpenFilePicker({types:[{description:"csv",accept:{"csv/*":[".csv"]}}],excludeAcceptAllOption:!0,multiple:!1}),n=await t.getFile(),a=Object.values(e).filter((e=>Object.keys(e.values).length>0)).sort(((e,t)=>e.date<t.date)),o=new z;D().parse(n,{complete:function(e){if(e.data.length>0){const t=e.data.map((e=>2==e.length?A(e[0]+" "+e[1],"MM/DD/YY HH:mm:ss").unix():null)),n=a.map((e=>e.date));console.log(t),console.log(n);const r=o.match(t,n);for(let t=0;t<r.length;t++){const{from:n,to:o,comment:i}=r[t],s=a[o],l=[s.values.og,s.values.ow];i&&l.push.comment,e.data[n].push(...l)}console.log(e),console.log(r),W(D().unparse(e.data))}}})}(n.images)},"Match and export to csv")),i.createElement("button",{onClick:()=>window.fileApi.storeJson(function(e){return JSON.stringify(e)}(n))},i.createElement(l._8t,{size:16})),i.createElement("button",{onClick:async function(){const e=function(e){return JSON.parse(e)}(await window.fileApi.loadJson());t({type:"HydrateAction",data:e})}},i.createElement(l.rG2,{size:16}))),a?i.createElement("div",{className:"center-spinner loader"}):null,u.length>0?i.createElement(P,{tableInstance:p,onRowClick:function(e){e.values.path&&d.push("/image/"+e.values.id)}}):null,u.length>0?i.createElement(L,{tableInstance:p,onTableChange:e=>t({type:"TableChangeAction",data:e})}):null)}L.propTypes={onTableChange:c().func.isRequired,tableInstance:c().object.isRequired},P.propTypes={onRowClick:c().func.isRequired,tableInstance:c().object.isRequired},P.columnConfig=[{Header:"Date",width:180,minWidth:180,accessor:e=>{const t=e.date||e.fromDate;return A.unix(t).format("YYYY-MM-DD HH:mm:ss")}},{Header:"O/G",accessor:e=>e.values?.og?e.values.og.toFixed(3):void 0,width:60},{Header:"O/W",accessor:e=>e.values?.ow?e.values.ow.toFixed(3):void 0,width:60},{Header:"Limits",accessor:e=>e.fromDate?`Min: ${e.minValue} Max: ${e.maxValue}`:""},{Header:"Shape",accessor:e=>e.fromDate?`W: ${e.offsetWidth.toFixed(2)} H: ${e.offsetHeight.toFixed(2)} X: ${e.x.toFixed(2)} Y: ${e.y.toFixed(2)} R: ${(e.rotation||0).toFixed(2)}`:""},{Header:"Path",accessor:"path",width:80},{Header:"Id",accessor:"id",width:50}];var F=n(707);class ${constructor(){this.images={}}async openDialog(){this.images={};const e=await window.showDirectoryPicker(),t=[];for await(const[n,a]of e.entries()){if("file"!=a.kind||!n.toLowerCase().includes("jpg")&&!n.toLowerCase().includes("jpeg"))continue;const e=await a.getFile();this.images[e.name]=e,t.push({path:e.name,date:e.lastModified})}return t}async getImage(e){const t=this.images[e],n=await t.arrayBuffer();return new Uint8Array(n)}}class Y{constructor(){this.images={}}async storeJson(e){const t=await window.showSaveFilePicker({types:[{description:"json",accept:{"json/*":[".json"]}}],excludeAcceptAllOption:!0});if(!t)return;const n=await t.createWritable();await n.write(e),await n.close()}async loadJson(){const[e]=await window.showOpenFilePicker({types:[{description:"json",accept:{"json/*":[".json"]}}],excludeAcceptAllOption:!0,multiple:!1});if(!e)return;const t=await e.getFile(),n=await t.text();return await window.imageApi.openDialog(),n}}function U(){return console.log(O()),O()||(window.imageApi=new $,window.fileApi=new Y),i.createElement(E,null,i.createElement(F.UT,null,i.createElement("div",null,i.createElement(M.AW,{exact:!0,path:"/"},i.createElement(T,null)),i.createElement(M.AW,{path:"/image/:guid"},i.createElement(R,null)))))}!function(){var e="light";if(!window.matchMedia)return!1;window.matchMedia("(prefers-color-scheme: dark)").matches&&(e="dark"),"dark"==e?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.setAttribute("data-theme","light")}(),s.render(i.createElement(U,null),document.getElementById("app-container"))},900:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(922),o=n.n(a)()((function(e){return e[1]}));o.push([e.id,".red .moveable-control {\n    background: red !important;\n}\n\n.red .moveable-line {\n    background: red !important;\n}\n\n.blue .moveable-control {\n    background: blue !important;\n}\n\n.blue .moveable-line {\n    background: blue !important;\n}\n\n.target {\n    position: absolute;\n    width: 250px;\n    height: 100px;\n    /* top: 150px; */\n    line-height: 100px;\n    text-align: center;\n    color: #333;\n    font-weight: bold;\n    border: 1px solid #333;\n    box-sizing: border-box;\n  }\n\n.edge-line {\n    background: yellow;\n}\n\n.measure-row {\n    background-color: var(--measure-row-background) !important;\n}",""]);const r=o},564:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(922),o=n.n(a)()((function(e){return e[1]}));o.push([e.id,".overview-table td {\n    overflow-x: hidden;\n    text-overflow: ellipsis;\n    padding: 2px;\n}\n\n\n.overview-table .resizer {\n    display: inline-block;\n    width: 10px;\n    height: 100%;\n    position: absolute;\n    right: 0;\n    top: 0;\n    transform: translateX(50%);\n    z-index: 1;\n}\n\n.overview-table .isResizing {\n    background: var(--text-bright);  \n}",""]);const r=o},424:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(922),o=n.n(a)()((function(e){return e[1]}));o.push([e.id,':root {\n  --transparent-contrast: rgba(0, 0, 0, 0.2);\n  --measure-row-background: #db5959;\n}\n\n/* WATER CUSTOMIZATION */\n[data-theme="dark"] {\n  --background-body: #202124;\n  --background-alt: #292a2d;\n  --background: #454545;\n  --transparent-contrast: rgba(255, 255, 255, 0.2);\n  --measure-row-background: #a52a2a;\n  --selection: #1c76c5;\n  --text-main: #dbdbdb;\n  --text-bright: #fff;\n  --text-muted: #a9b1ba;\n  --links: #41adff;\n  --focus: #0096bfab;\n  --border: #526980;\n  --code: #ffbe85;\n  --animation-duration: 0.1s;\n  --button-base: #0c151c;\n  --button-hover: #040a0f;\n  --scrollbar-thumb: var(--button-hover);\n  --scrollbar-thumb-hover: color-mod(var(--scrollbar-thumb) lightness(-30%));\n  --form-placeholder: #a9a9a9;\n  --form-text: #fff;\n  --variable: #d941e2;\n  --highlight: #efdb43;\n  --select-arrow: svg-load(\'./assets/select-arrow.svg\', fill: #efefef);\n}\n\n[data-theme="light"] {\n  --background-body: #fff;\n  --background: #efefef;\n  --background-alt: #f7f7f7;\n  --selection: #9e9e9e;\n  --text-main: #363636;\n  --text-bright: #000;\n  --text-muted: #70777f;\n  --links: #0076d1;\n  --focus: #0096bfab;\n  --border: #dbdbdb;\n  --code: #000;\n  --animation-duration: 0.1s;\n  --button-base: #d0cfcf;\n  --button-hover: #9b9b9b;\n  --scrollbar-thumb: color-mod(var(--button-hover) lightness(+6%));\n  --scrollbar-thumb-hover: var(--button-hover);\n  --form-placeholder: #949494;\n  --form-text: #1d1d1d;\n  --variable: #39a33c;\n  --highlight: #ff0;\n  --select-arrow: svg-load(\'./assets/select-arrow.svg\', fill: #161f27);\n}\n\nbutton {\n  border-radius: 0px;\n  padding-left: 10px;\n  padding-right: 12px;\n  padding-right: 12px;\n  padding-top: 10px;\n  padding-bottom: 10px;\n  \n}\n\nselect {\n  border-radius: 0;\n  display: inline-block;\n}\ntd {\n  white-space: nowrap;\n}\n\ntr {\n  padding-top: 5px;\n  padding-bottom: 5px;\n}\n\n/* SITE CUSTOMIZATITON */\nhtml, body {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\n  width: 100%;\n  height: 100%;\n  margin: 0px;\n  padding: 0;\n  max-width: none !important;\n}\n\n#app-container {\n  width: 100%;\n  height: 100%;\n  overflow: auto;\n}\n\n#app-container > div {\n  width: 100%;\n  min-height: 100%;\n}\n\n#zoom {\n  width: 100%;\n  height: 100%;\n  transform-origin: 0px 0px;\n  transform: scale(1) translate(0px, 0px);\n  cursor: grab;\n}\n\ndiv#zoom > img {\n  height: auto;\n}\n\n.top-bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-end;\n  position: fixed;\n  width: 100%;\n  top: 0;\n  z-index: 1000;\n}\n\n.top-bar button {\n  margin: 5px;\n  padding-right: 12px;\n  padding-left: 12px;\n  padding-top: 5px;\n}\n\n.top-bar .controls {\n  min-width: 100px;\n  display: flex;\n}\n\n.top-bar .controls .controls-next {\n  margin-left: auto;\n  padding-right: 12px;\n  padding-left: 12px;\n  padding-top: 5px;\n}\n.top-bar .controls .controls-prev {\n  margin-right: auto;\n  padding-right: 12px;\n  padding-left: 12px;\n  padding-top: 5px;\n}\n\n.image-container {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  overflow: hidden;\n}\n\n.table-pagination {\n  border-top: 1px solid var(--border);\n  position: fixed;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  padding: 5px;\n  background-color: var(--background-body);\n}\n\n\n\n.primary-button {\n  background-color: #3CB371;\n}\n\n/* SPINNER */\n.loader,\n.loader:after {\n  border-radius: 50%;\n  width: 10em;\n  height: 10em;\n}\n.loader {\n  margin: auto;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  text-indent: -9999em;\n  border-top: 1.1em solid var(--transparent-contrast);\n  border-right: 1.1em solid var(--transparent-contrast);\n  border-bottom: 1.1em solid var(--transparent-contrast);\n  border-left: 1.1em solid var(--text-bright);\n  -webkit-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-animation: load8 1.1s infinite linear;\n  animation: load8 1.1s infinite linear;\n}\n@-webkit-keyframes load8 {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n@keyframes load8 {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n\n/*Custom dropdown*/\n/* The container <div> - needed to position the dropdown content */\n.dropdown {\n  position: relative;\n  display: inline-block;\n}\n\n/* Dropdown Content (Hidden by Default) */\n.dropdown-content {\n  display: none;\n  position: absolute;\n  background-color: #f1f1f1;\n  min-width: 160px;\n  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\n  z-index: 1;\n}\n\n/* Links inside the dropdown */\n.dropdown-content a {\n  color: black;\n  padding: 12px 16px;\n  text-decoration: none;\n  display: block;\n}\n\n/* Change color of dropdown links on hover */\n.dropdown-content a:hover {background-color: #ddd}\n\n/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */\n.show {display:block;}',""]);const r=o}},n={};function a(e){var o=n[e];if(void 0!==o)return o.exports;var r=n[e]={id:e,exports:{}};return t[e].call(r.exports,r,r.exports,a),r.exports}a.m=t,e=[],a.O=(t,n,o,r)=>{if(!n){var i=1/0;for(c=0;c<e.length;c++){for(var[n,o,r]=e[c],s=!0,l=0;l<n.length;l++)(!1&r||i>=r)&&Object.keys(a.O).every((e=>a.O[e](n[l])))?n.splice(l--,1):(s=!1,r<i&&(i=r));if(s){e.splice(c--,1);var d=o();void 0!==d&&(t=d)}}return t}r=r||0;for(var c=e.length;c>0&&e[c-1][2]>r;c--)e[c]=e[c-1];e[c]=[n,o,r]},a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={179:0};a.O.j=t=>0===e[t];var t=(t,n)=>{var o,r,[i,s,l]=n,d=0;if(i.some((t=>0!==e[t]))){for(o in s)a.o(s,o)&&(a.m[o]=s[o]);if(l)var c=l(a)}for(t&&t(n);d<i.length;d++)r=i[d],a.o(e,r)&&e[r]&&e[r][0](),e[i[d]]=0;return a.O(c)},n=self.webpackChunkmeasure=self.webpackChunkmeasure||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var o=a.O(void 0,[8],(()=>a(524)));o=a.O(o)})();