function N(){const h=new WebSocket(`ws://${location.host}`);h.onopen=()=>setInterval(()=>h.send("ping"),5000),h.onmessage=(B)=>{if(B.data!=="Well received")console.log(B.data);if(B.data==="reload")location.reload()}}var H=getComputedStyle(document.documentElement);class L{h;B;static _ui=new WeakMap;_cellSize;static colorBackground=H.getPropertyValue("--neutral-white");static colorBackgroundHighlight=H.getPropertyValue("--brand-uno-background");static colorSelected=H.getPropertyValue("--brand-uno-hover");static colorText=H.getPropertyValue("--brand-uno");static colorTextLight=H.getPropertyValue("--brand-uno-light");static colorBorder=H.getPropertyValue("--sudoku-border");static colorBorderBold=H.getPropertyValue("--brand-uno");static font=H.getPropertyValue("--font-family-primary");constructor(h,B){this._canvas=h;this._ctx=B;this._cellSize=Math.round(Math.min(h.width,h.height)/9)}static get(h){if(console.log(L._ui),console.log(L._ui.has(h)),console.log(L._ui.get(h)),console.log(L._ui.get(h)),L._ui.has(h))return L._ui.get(h);const B=h.getContext("2d");if(B===null)return!1;const M=new L(h,B);return L._ui.set(h,M),M}get width(){return this._canvas.width}get height(){return this._canvas.height}get cellSize(){return this._cellSize}clearCanvas(){return this._ctx.fillStyle=L.colorBackground,this._ctx.fillRect(0,0,this.width,this.height),this}drawCell(h,B,M=this._cellSize,A=L.colorBorder,q){const F=h*M,K=B*M;if(q)this._ctx.fillStyle=q,this._ctx.fillRect(F+1,K+1,M-2,M-2);return this._ctx.strokeStyle=A,this._ctx.strokeRect(F,K,M,M),this}drawRow(){}drawColumn(){}drawGroup(h,B,M){this.drawCell(h,B,this._cellSize*3,L.colorBorderBold,M);for(let A=0;A<3;A++)for(let q=0;q<3;q++)this.drawCell(h*3+A,B*3+q,this._cellSize,L.colorBorder);return this}drawCellValue(){}drawCellDomain(){}drawEmptyGrid(){this.clearCanvas();for(let h=0;h<3;h++)for(let B=0;B<3;B++)this.drawGroup(h,B);return this}colorizeSelectedStuff(){}drawVictory(){this.clearCanvas()}}var O=function(h){const B=document.getElementById(h),M=L.get(B),A=[],q=[];if(B===null)return console.error("Cannot get the given Canvas 2D rendering context"),!1;if(!M)return!1;for(let F=0;F<9;F++){A.push([]),q.push([]);for(let K=0;K<9;K++)A[F].push([1,2,3,4,5,6,7,8,9]),q[F].push(null)}return{canvas:B,ui:M,cellDomains:A,cellValues:q}},P=function(h){const{canvas:B,ui:M,cellDomains:A,cellValues:q}=h;function F(){M.drawEmptyGrid()}N(),F()};document.addEventListener("DOMContentLoaded",(h)=>{const B=O("sudokuCanvas");if(B)P(B);console.log("Sudoku UI variables:","\n\n","- colorBackground :",L.colorBackground,"\n","- colorBackgroundHighlight :",L.colorBackgroundHighlight,"\n","- colorSelected :",L.colorSelected,"\n","- colorText :",L.colorText,"\n","- colorTextLight :",L.colorTextLight,"\n","- colorBorder :",L.colorBorder,"\n","- colorBorderBold :",L.colorBorderBold,"\n","- font :",L.font)});
