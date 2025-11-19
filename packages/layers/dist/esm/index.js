"undefined"!=typeof window&&(window.__CRAFTJS__||(window.__CRAFTJS__={}),window.__CRAFTJS__["@craftjs/layers"]="0.2.7");import{useCollector as e,wrapConnectorHooks as t,RenderIndicator as n,useMethods as r,ROOT_NODE as a}from"@craftjs/utils";import*as o from"react";import i,{createContext as d,useContext as s,useMemo as l,useState as c,useLayoutEffect as p,useRef as h,useEffect as m,useCallback as u}from"react";import{useEditor as g,ROOT_NODE as v,DerivedCoreEventHandlers as f,useEventHandler as y}from"@craftjs/core";import{styled as b}from"styled-components";import x from"react-contenteditable";const E=i.createContext({}),w=d({});function $(t){const{store:n}=s(w),r=e(n,t);return l(()=>({store:n,...r}),[n,r])}function C(e){const{id:n,depth:r,connectors:a}=s(E),{actions:o,...i}=$(t=>n&&t.layers[n]&&e&&e(t.layers[n])),{children:d}=g((e,t)=>({children:e.nodes[n]&&t.node(n).descendants()})),c=l(()=>({toggleLayer:()=>o.toggleLayer(n),setExpandedState:e=>o.setExpandedState(n,e)}),[o,n]),p=l(()=>t({layer:e=>a.layer(e,n),drag:e=>a.drag(e,n),layerHeader:e=>a.layerHeader(e,n)}),[a,n]);return{id:n,depth:r,children:d,actions:c,connectors:p,...i}}const O=()=>{const{id:e,depth:t,children:n,expanded:r}=C(e=>({expanded:e.expanded})),{data:a,shouldBeExpanded:o}=g((t,n)=>{const r=n.getEvent("selected").first();return{data:t.nodes[e]&&t.nodes[e].data,shouldBeExpanded:r&&n.node(r).ancestors(!0).includes(e)}}),{actions:{registerLayer:d,toggleLayer:s},renderLayer:l,expandRootOnLoad:u}=$(e=>({renderLayer:e.options.renderLayer,expandRootOnLoad:e.options.expandRootOnLoad})),[f,y]=c(!1);p(()=>{d(e),y(!0)},[d,e]);const b=h(r);b.current=r;const x=h(u&&e===v);return m(()=>{!b.current&&o&&s(e)},[s,e,o]),m(()=>{x.current&&s(e)},[s,e]),a&&f?i.createElement("div",{className:`craft-layer-node ${e}`},i.createElement(l,{},n&&r?n.map(e=>i.createElement(P,{key:e,id:e,depth:t+1})):null)):null},L=d(null),P=({id:e,depth:n})=>{const r=s(L),{store:a}=s(w);h(a).current=a;const o=l(()=>r.createConnectorsUsage(),[r]),d=l(()=>t(o.connectors),[o]);m(()=>(o.register(),()=>{o.cleanup()}),[o]);const{exists:c}=g(t=>({exists:!!t.nodes[e]}));return c?i.createElement(E.Provider,{value:{id:e,depth:n,connectors:d}},i.createElement(O,null)):null},j=e=>({setLayerEvent:(t,n)=>{if(null!==n&&!e.layers[n])return;const r=e.events[t];r&&n!==r&&(e.layers[r].event[t]=!1),n?(e.layers[n].event[t]=!0,e.events[t]=n):e.events[t]=null},registerLayer:t=>{e.layers[t]||(e.layers[t]={dom:null,headingDom:null,expanded:!1,id:t,event:{selected:!1,hovered:!1}})},setDOM:(t,n)=>{e.layers[t]={...e.layers[t],...n.dom?{dom:n.dom}:{},...n.headingDom?{headingDom:n.headingDom}:{}}},toggleLayer:t=>{e.layers[t].expanded=!e.layers[t].expanded},setExpandedState:(t,n)=>{e.layers[t].expanded=n},setIndicator:t=>{e.events.indicator=t}});function S(e,t,n){return(t=function(e){var t=function(e){if("object"!=typeof e||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,"string");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function D(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function H(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?D(Object(n),!0).forEach(function(t){S(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):D(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}class _ extends f{getLayer(e){return this.options.layerStore.getState().layers[e]}handlers(){const e=this.derived.options.store,{layerStore:t}=this.options;return{layer:(n,r)=>{t.actions.setDOM(r,{dom:n});const a=this.inherit(e=>{e.select(n,r),e.hover(n,r),e.drag(n,r)}),o=this.addCraftEventListener(n,"mouseover",e=>{e.craft.stopPropagation(),t.actions.setLayerEvent("hovered",r)});let i=null;this.derived.options.removeHoverOnMouseleave&&(i=this.addCraftEventListener(n,"mouseleave",e=>{e.craft.stopPropagation(),t.actions.setLayerEvent("hovered",null)}));const d=this.addCraftEventListener(n,"dragover",n=>{n.craft.stopPropagation(),n.preventDefault();const{indicator:r,currentCanvasHovered:a}=_.events;if(a&&r){const o=this.getLayer(a.id).headingDom.getBoundingClientRect();if(n.clientY>o.top+10&&n.clientY<o.bottom-10){const n=a.data.nodes[a.data.nodes.length-1];if(!n)return void(_.events.indicator=H(H({},r),{},{placement:H(H({},r.placement),{},{index:0,where:"before",parent:a}),onCanvas:!0}));_.events.indicator=H(H({},r),{},{placement:{currentNode:e.query.node(n).get(),index:a.data.nodes.length,where:"after",parent:a},onCanvas:!0}),t.actions.setIndicator(_.events.indicator)}}}),s=this.addCraftEventListener(n,"dragenter",n=>{n.craft.stopPropagation(),n.preventDefault();const a=_.draggedElement;if(!a)return;const o=e.query.getDropPlaceholder(a,r,{x:n.clientX,y:n.clientY},e=>{const t=this.getLayer(e.id);return t&&t.dom});if(o){const{placement:{parent:r}}=o,a=this.getLayer(r.id).headingDom.getBoundingClientRect();if(_.events.currentCanvasHovered=null,e.query.node(r.id).isCanvas()&&r.data.parent){const t=e.query.node(r.data.parent).get();e.query.node(t.id).isCanvas()&&(_.events.currentCanvasHovered=r,(n.clientY>a.bottom-10&&!this.getLayer(r.id).expanded||n.clientY<a.top+10)&&(o.placement.parent=t,o.placement.currentNode=r,o.placement.index=t.data.nodes?t.data.nodes.indexOf(r.id):0,n.clientY>a.bottom-10&&!this.getLayer(r.id).expanded?o.placement.where="after":n.clientY<a.top+10&&(o.placement.where="before")))}_.events.indicator=H(H({},o),{},{onCanvas:!1}),t.actions.setIndicator(_.events.indicator)}});return()=>{a(),o(),d(),s(),i&&i()}},layerHeader:(e,n)=>{t.actions.setDOM(n,{headingDom:e})},drag:(n,r)=>{n.setAttribute("draggable","true");const a=this.addCraftEventListener(n,"dragstart",e=>{e.craft.stopPropagation(),_.draggedElement=r}),o=this.addCraftEventListener(n,"dragend",n=>{n.craft.stopPropagation();const r=_.events;if(r.indicator&&!r.indicator.error){const{placement:t}=r.indicator,{parent:n,index:a,where:o}=t,{id:i}=n;e.actions.move(_.draggedElement,i,a+("after"===o?1:0))}_.draggedElement=null,_.events.indicator=null,t.actions.setIndicator(null)});return()=>{n.removeAttribute("draggable"),a(),o()}}}}}S(_,"draggedElement",void 0),S(_,"events",{indicator:null,currentCanvasHovered:null});const k=({children:e})=>{const{layers:t,events:r}=$(e=>e),{query:a}=g(e=>({enabled:e.options.enabled})),{indicator:o}=a.getOptions(),d=l(()=>{const{indicator:e}=r;if(e){const{placement:{where:n,parent:r,currentNode:a},error:i}=e,d=a?a.id:r.id;let s;const l=i?o.error:o.success;if(e.onCanvas&&null!=t[r.id].dom){const e=t[r.id].dom.getBoundingClientRect(),n=t[r.id].headingDom.getBoundingClientRect();return{top:n.top,left:e.left,width:e.width,height:n.height,background:"transparent",borderWidth:"1px",borderColor:l}}{if(!t[d])return;const e=t[d].headingDom.getBoundingClientRect(),r=t[d].dom.getBoundingClientRect();return s="after"!==n&&a?r.top:r.top+r.height,{top:s,left:e.left,width:r.width+r.left-e.left,height:2,borderWidth:0,background:l}}}},[r,o.error,o.success,t]);return i.createElement("div",null,r.indicator?i.createElement(n,{style:d}):null,e)},N=({children:e})=>{const{store:t}=$(),n=y(),r=l(()=>n.derive(_,{layerStore:t}),[n,t]);return i.createElement(L.Provider,{value:r},i.createElement(k,null),e)},B=()=>{const{id:e}=C(),{displayName:t,actions:n}=g(t=>({displayName:t.nodes[e]&&t.nodes[e].data.custom.displayName?t.nodes[e].data.custom.displayName:t.nodes[e].data.displayName,hidden:t.nodes[e]&&t.nodes[e].data.hidden})),[r,a]=c(!1),o=h(null),d=u(e=>{o.current&&!o.current.contains(e.target)&&a(!1)},[]);return m(()=>()=>{window.removeEventListener("click",d)},[d]),i.createElement(x,{html:t,disabled:!r,ref:e=>{e&&(o.current=e.el.current,window.removeEventListener("click",d),window.addEventListener("click",d))},onChange:t=>{n.setCustom(e,e=>e.displayName=t.target.value)},tagName:"h2",onDoubleClick:()=>{r||a(!0)}})};var M;function R(){return R=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},R.apply(null,arguments)}var z,A,T=function(e){return o.createElement("svg",R({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 10 6"},e),M||(M=o.createElement("path",{d:"M9.99 1.01A1 1 0 0 0 8.283.303L5 3.586 1.717.303A1 1 0 1 0 .303 1.717l3.99 3.98a1 1 0 0 0 1.414 0l3.99-3.98a.997.997 0 0 0 .293-.707Z"})))};function Y(){return Y=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Y.apply(null,arguments)}var q,I,F=function(e){return o.createElement("svg",Y({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:16,height:16},e),z||(z=o.createElement("path",{fill:"none",d:"M0 0h24v24H0z"})),A||(A=o.createElement("path",{d:"M1.181 12C2.121 6.88 6.608 3 12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"})))};function J(){return J=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},J.apply(null,arguments)}var V=function(e){return o.createElement("svg",J({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 18 18"},e),q||(q=o.createElement("path",{className:"linked_svg__a",d:"M16.5 9h-1a.5.5 0 0 0-.5.5V15H3V3h5.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5Z"})),I||(I=o.createElement("path",{className:"linked_svg__a",d:"M16.75 1h-5.373a.4.4 0 0 0-.377.4.392.392 0 0 0 .117.28l1.893 1.895-3.52 3.521a.5.5 0 0 0 0 .707l.706.708a.5.5 0 0 0 .708 0l3.521-3.521 1.893 1.892A.39.39 0 0 0 16.6 7a.4.4 0 0 0 .4-.377V1.25a.25.25 0 0 0-.25-.25Z"})))};const Z={bgBase:"transparent",bgHover:"#f1f1f1",bgSelected:"#2680eb",bgCanvas:"rgba(255, 255, 255, 0.02)",textPrimary:"inherit",textSelected:"#fff",iconPrimary:"#808184",iconSelected:"#fff",borderColor:"#00000012",shadowColor:"#00000014"},W={bgBase:"transparent",bgHover:"#2a2a2a",bgSelected:"#2680eb",bgCanvas:"rgba(255, 255, 255, 0.05)",textPrimary:"#e0e0e0",textSelected:"#fff",iconPrimary:"#b0b0b0",iconSelected:"#fff",borderColor:"#ffffff12",shadowColor:"#00000040"},U=e=>"dark"===e?W:Z,X=d(null),G=({theme:e,themeMode:t,children:n})=>{const r=l(()=>({theme:e||U(t)}),[e,t]);return i.createElement(X.Provider,{value:r},n)},K=()=>{const e=s(X);return e?e.theme:U("light")},Q=b.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  background: ${e=>e.$selected?e.$theme.bgSelected:"transparent"};
  color: ${e=>e.$selected?e.$theme.textSelected:e.$theme.textPrimary};
  svg {
    fill: ${e=>e.$selected?e.$theme.iconSelected:e.$theme.iconPrimary};
    margin-top: 2px;
  }
  .inner {
    flex: 1;
    > div {
      padding: 0px;
      flex: 1;
      display: flex;
      margin-left: ${e=>10*e.$depth}px;
      align-items: center;
      div.layer-name {
        flex: 1;
        h2 {
          font-size: 15px;
          line-height: 26px;
        }
      }
    }
  }
`,ee=b.a`
  width: 8px;
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  transform: rotate(${e=>e.$expanded?180:0}deg);
  opacity: 0.7;
  cursor: pointer;
`,te=b.a`
  width: 14px;
  height: 14px;
  margin-right: 10px;
  position: relative;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: ${e=>e.$isHidden?.2:1};
  }
  &:after {
    content: ' ';
    width: 2px;
    height: ${e=>e.$isHidden?100:0}%;
    position: absolute;
    left: 2px;
    top: 3px;
    background: ${e=>e.$selected?e.$theme.iconSelected:e.$theme.iconPrimary};
    transform: rotate(-45deg);
    transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    transform-origin: 0% 0%;
    opacity: ${e=>e.$isHidden?.4:1};
  }
`,ne=b.div`
  margin-left: -22px;
  margin-right: 10px;

  svg {
    width: 12px;
    height: 12px;
  }
`,re=()=>{const e=K(),{id:t,depth:n,expanded:r,children:a,connectors:{drag:o,layerHeader:d},actions:{toggleLayer:s}}=C(e=>({expanded:e.expanded})),{hidden:l,actions:c,selected:p,topLevel:h}=g((e,n)=>{const r=n.getEvent("selected").first()===t;return{hidden:e.nodes[t]&&e.nodes[t].data.hidden,selected:r,topLevel:n.node(t).isTopLevelCanvas()}});return i.createElement(Q,{$selected:p,ref:e=>{o(e)},$depth:n,$theme:e},i.createElement(te,{$selected:p,$isHidden:l,$theme:e,onClick:()=>c.setHidden(t,!l)},i.createElement(F,null)),i.createElement("div",{className:"inner"},i.createElement("div",{ref:e=>{d(e)}},h?i.createElement(ne,null,i.createElement(V,null)):null,i.createElement("div",{className:"layer-name s"},i.createElement(B,null)),i.createElement("div",null,a&&a.length?i.createElement(ee,{$expanded:r,onMouseDown:()=>s()},i.createElement(T,null)):null))))},ae=b.div`
  background: ${e=>e.$hovered?e.$theme.bgHover:e.$theme.bgBase};
  display: block;
  padding-bottom: ${e=>e.$hasCanvases&&e.$expanded?5:0}px;
`,oe=b.div`
  margin: 0 0 0 ${e=>e.$hasCanvases?35:0}px;
  background: ${e=>e.$hasCanvases?e.$theme.bgCanvas:"transparent"};
  position: relative;

  ${e=>e.$hasCanvases?`\n\n  box-shadow: 0px 0px 44px -1px ${e.$theme.shadowColor};\n  border-radius: 10px;\n  margin-right: 5px;\n  margin-bottom:5px;\n  margin-top:5px;\n  > * { overflow:hidden; }\n    &:before {\n      position:absolute;\n      left:-19px;\n      width: 2px;\n      height:100%;\n      content: " ";\n      background:${e.$theme.borderColor};\n    }\n  `:""}
`,ie=({children:e})=>{const t=K(),{id:n,expanded:r,hovered:a,connectors:{layer:o}}=C(e=>({hovered:e.event.hovered,expanded:e.expanded})),{hasChildCanvases:d}=g((e,t)=>({hasChildCanvases:t.node(n).isParentOfTopLevelNodes()}));return i.createElement(ae,{ref:e=>{o(e)},$expanded:r,$hasCanvases:d,$hovered:a,$theme:t},i.createElement(re,null),e?i.createElement(oe,{$hasCanvases:d,$theme:t,className:"craft-layer-children"},e):null)},de=({children:e,options:t})=>{const n=r(j,{layers:{},events:{selected:null,dragged:null,hovered:null},options:{renderLayer:ie,...t}});return i.createElement(w.Provider,{value:{store:n}},i.createElement(G,{theme:t.theme,themeMode:t.themeMode},i.createElement(N,null,e)))},se=({...e})=>i.createElement(de,{options:e},i.createElement(P,{id:a,depth:0}));export{ie as DefaultLayer,re as DefaultLayerHeader,B as EditableLayerName,se as Layers,W as darkTheme,U as getTheme,Z as lightTheme,C as useLayer};
//# sourceMappingURL=index.js.map
