function w(){const h=new WebSocket(`ws://${location.host}`);h.onopen=()=>setInterval(()=>h.send("ping"),5000),h.onmessage=(q)=>{if(q.data!=="Well received")console.log(q.data);if(q.data==="reload")location.reload()}}var T=getComputedStyle(document.documentElement);class K{h;q;static _ui=new WeakMap;_cellSize;static colorBackground=T.getPropertyValue("--neutral-white");static colorBackgroundHighlight=T.getPropertyValue("--brand-uno-background");static colorSelected=T.getPropertyValue("--brand-uno-hover");static colorText=T.getPropertyValue("--brand-uno");static colorTextLight=T.getPropertyValue("--brand-uno-light");static colorBorder=T.getPropertyValue("--sudoku-border");static colorBorderBold=T.getPropertyValue("--brand-uno");static font=T.getPropertyValue("--font-family-primary");constructor(h,q){this._canvas=h;this._ctx=q;this._cellSize=Math.round(Math.min(h.width,h.height)/9)}static get(h){if(console.log(K._ui),console.log(K._ui.has(h)),console.log(K._ui.get(h)),console.log(K._ui.get(h)),K._ui.has(h))return K._ui.get(h);const q=h.getContext("2d");if(q===null)return!1;const B=new K(h,q);return K._ui.set(h,B),B}get width(){return this._canvas.width}get height(){return this._canvas.height}get cellSize(){return this._cellSize}clearCanvas(){return this._ctx.fillStyle=K.colorBackground,this._ctx.fillRect(0,0,this.width,this.height),this}drawCell(h,q,B=this._cellSize,Q=K.colorBorder,A){const R=h*B,$=q*B;if(A)this._ctx.fillStyle=A,this._ctx.fillRect(R+1,$+1,B-2,B-2);return this._ctx.strokeStyle=Q,this._ctx.strokeRect(R,$,B,B),this}drawRow(h,q){for(let B=0;B<9;B++)this.drawCell(B,h,this._cellSize,K.colorBorder,q);return this}drawColumn(h,q){for(let B=0;B<9;B++)this.drawCell(h,B,this._cellSize,K.colorBorder,q);return this}drawGroup(h,q,B){this.drawCell(h,q,this._cellSize*3,K.colorBorderBold,B);for(let Q=0;Q<3;Q++)for(let A=0;A<3;A++)this.drawCell(h*3+Q,q*3+A,this._cellSize,K.colorBorder);return this}drawCellValue(h,q,B){this._ctx.fillStyle=K.colorText,this._ctx.font=`600 48px ${K.font}`,this._ctx.textBaseline="middle",this._ctx.textAlign="center";const Q=h*this._cellSize+Math.floor(this._cellSize*0.5),A=q*this._cellSize+Math.floor(this._cellSize*0.575);return this._ctx.fillText(B.toString(),Q,A),this}drawCellDomain(h,q,B){this._ctx.fillStyle=K.colorTextLight,this._ctx.font=`400 14px ${K.font}`,this._ctx.textBaseline="top",this._ctx.textAlign="start";const Q=Math.max(this._cellSize-2,Math.floor(this._cellSize*0.8)),A=Math.floor(Q/3),R=Math.max(1,Math.floor(this._cellSize*0.1)),$=h*this._cellSize+R,b=q*this._cellSize+R;for(let Y=1;Y<=9;Y++){const O=B.includes(Y)?Y:null,P=(Y-1)%3,M=Math.floor((Y-1)/3),J=$+A*P,H=b+A*M;this._ctx.fillText(O!==null?O.toString():"",J,H)}return this}drawEmptyGrid(){this.clearCanvas();for(let h=0;h<3;h++)for(let q=0;q<3;q++)this.drawGroup(h,q);return this}colorizeSelectedStuff(){}drawVictory(){return this._ctx.fillStyle=K.colorSelected,this._ctx.fillRect(0,0,this.width,this.height),this}}function f(h){function q(A){A.stopPropagation();const{offsetX:R,offsetY:$}=A,b=Math.min(Math.floor(R/h.ui.cellSize),8),Y=Math.min(Math.floor($/h.ui.cellSize),8),O=h.getSelectedCell();document.onclick=()=>{if(O===null||O[0]!==b||O[1]!==Y)h.setSelectedCell([b,Y]),h.refreshGrid()}}function B(A){if(A.stopPropagation(),h.getSelectedCell()!==null)h.setSelectedCell(null),h.refreshGrid()}function Q(A){if(A.stopPropagation(),A.key>="1"&&A.key<="9"&&h.getSelectedCell()!==null)h.toggle(parseInt(A.key))}h.canvas.addEventListener("mousemove",q),h.canvas.addEventListener("mouseout",B),document.onkeyup=Q}var k=function(h){const q=document.getElementById(h),B=K.get(q),Q=[],A=[];if(q===null)return console.error("Cannot get the given Canvas 2D rendering context"),!1;if(!B)return!1;for(let R=0;R<9;R++){Q.push([]),A.push([]);for(let $=0;$<9;$++)Q[R].push([1,2,3,4,5,6,7,8,9]),A[R].push(null)}return{canvas:q,ui:B,cellDomains:Q,cellValues:A}},y=function(h){const{canvas:q,ui:B,cellDomains:Q,cellValues:A}=h;let R=null;const $=!0;function b(L,N){if(A[L][N]!==null)B.drawCellValue(L,N,A[L][N]);else B.drawCellDomain(L,N,Q[L][N])}function Y(){for(let L=0;L<9;L++)for(let N=0;N<9;N++)b(L,N)}function O(L,N,W){const X=Q[L][N],Z=X.indexOf(W);if(Z!==-1)X.splice(Z,1)}function P(L,N,W){const X=Q[L][N];if(!X.includes(W))X.push(W)}function M(L,N,W,X){const Z=X?O:P;for(let F=0;F<9;F++){if(F!==L)Z(F,N,W);if(F!==N)Z(L,F,W)}const V=Math.floor(L/3),g=Math.floor(N/3);for(let F=0;F<3;F++)for(let _=0;_<3;_++){const G=V*3+_,x=g*3+F;if(G!==L&&x!==N)Z(G,x,W)}}function J(L){const N=R[0],W=R[1];if(A[W][N]===null){if(Q[W][N].includes(L))A[W][N]=L,M(N,W,L,!0),H()}else if(A[W][N]===L){A[W][N]=null,M(N,W,L,!1);for(let X=0;X<9;X++)for(let Z=0;Z<9;Z++)if(A[X][Z]===L)M(Z,X,L,!0);H()}}function H(){B.drawEmptyGrid(),Y()}f({canvas:q,ui:B,refreshGrid:H,toggle:J,getSelectedCell:()=>R,setSelectedCell:(L)=>R=L}),w(),H()};document.addEventListener("DOMContentLoaded",(h)=>{const q=k("sudokuCanvas");if(q)y(q);console.log("Sudoku UI variables:","\n\n","- colorBackground :",K.colorBackground,"\n","- colorBackgroundHighlight :",K.colorBackgroundHighlight,"\n","- colorSelected :",K.colorSelected,"\n","- colorText :",K.colorText,"\n","- colorTextLight :",K.colorTextLight,"\n","- colorBorder :",K.colorBorder,"\n","- colorBorderBold :",K.colorBorderBold,"\n","- font :",K.font)});
