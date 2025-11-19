"use strict";"undefined"!=typeof window&&(window.__CRAFTJS__||(window.__CRAFTJS__={}),window.__CRAFTJS__["@craftjs/layers"]="0.2.7"),Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@craftjs/utils"),t=require("react"),n=require("@craftjs/core"),r=require("styled-components"),a=require("react-contenteditable");function o(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function d(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach(function(n){if("default"!==n){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})}}),t.default=e,Object.freeze(t)}var i=o(t),s=d(t),l=o(a);const c=i.default.createContext({}),u=t.createContext({});function p(n){const{store:r}=t.useContext(u),a=e.useCollector(r,n);return t.useMemo(()=>({store:r,...a}),[r,a])}function f(r){const{id:a,depth:o,connectors:d}=t.useContext(c),{actions:i,...s}=p(e=>a&&e.layers[a]&&r&&r(e.layers[a])),{children:l}=n.useEditor((e,t)=>({children:e.nodes[a]&&t.node(a).descendants()})),u=t.useMemo(()=>({toggleLayer:()=>i.toggleLayer(a),setExpandedState:e=>i.setExpandedState(a,e)}),[i,a]),f=t.useMemo(()=>e.wrapConnectorHooks({layer:e=>d.layer(e,a),drag:e=>d.drag(e,a),layerHeader:e=>d.layerHeader(e,a)}),[d,a]);return{id:a,depth:o,children:l,actions:u,connectors:f,...s}}const h=()=>{const{id:e,depth:r,children:a,expanded:o}=f(e=>({expanded:e.expanded})),{data:d,shouldBeExpanded:s}=n.useEditor((t,n)=>{const r=n.getEvent("selected").first();return{data:t.nodes[e]&&t.nodes[e].data,shouldBeExpanded:r&&n.node(r).ancestors(!0).includes(e)}}),{actions:{registerLayer:l,toggleLayer:c},renderLayer:u,expandRootOnLoad:h}=p(e=>({renderLayer:e.options.renderLayer,expandRootOnLoad:e.options.expandRootOnLoad})),[g,v]=t.useState(!1);t.useLayoutEffect(()=>{l(e),v(!0)},[l,e]);const y=t.useRef(o);y.current=o;const x=t.useRef(h&&e===n.ROOT_NODE);return t.useEffect(()=>{!y.current&&s&&c(e)},[c,e,s]),t.useEffect(()=>{x.current&&c(e)},[c,e]),d&&g?i.default.createElement("div",{className:`craft-layer-node ${e}`},i.default.createElement(u,{},a&&o?a.map(e=>i.default.createElement(m,{key:e,id:e,depth:r+1})):null)):null},g=t.createContext(null),m=({id:r,depth:a})=>{const o=t.useContext(g),{store:d}=t.useContext(u);t.useRef(d).current=d;const s=t.useMemo(()=>o.createConnectorsUsage(),[o]),l=t.useMemo(()=>e.wrapConnectorHooks(s.connectors),[s]);t.useEffect(()=>(s.register(),()=>{s.cleanup()}),[s]);const{exists:p}=n.useEditor(e=>({exists:!!e.nodes[r]}));return p?i.default.createElement(c.Provider,{value:{id:r,depth:a,connectors:l}},i.default.createElement(h,null)):null},v=e=>({setLayerEvent:(t,n)=>{if(null!==n&&!e.layers[n])return;const r=e.events[t];r&&n!==r&&(e.layers[r].event[t]=!1),n?(e.layers[n].event[t]=!0,e.events[t]=n):e.events[t]=null},registerLayer:t=>{e.layers[t]||(e.layers[t]={dom:null,headingDom:null,expanded:!1,id:t,event:{selected:!1,hovered:!1}})},setDOM:(t,n)=>{e.layers[t]={...e.layers[t],...n.dom?{dom:n.dom}:{},...n.headingDom?{headingDom:n.headingDom}:{}}},toggleLayer:t=>{e.layers[t].expanded=!e.layers[t].expanded},setExpandedState:(t,n)=>{e.layers[t].expanded=n},setIndicator:t=>{e.events.indicator=t}});function y(e,t,n){return(t=function(e){var t=function(e){if("object"!=typeof e||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,"string");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function x(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?x(Object(n),!0).forEach(function(t){y(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):x(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}class E extends n.DerivedCoreEventHandlers{getLayer(e){return this.options.layerStore.getState().layers[e]}handlers(){const e=this.derived.options.store,{layerStore:t}=this.options;return{layer:(n,r)=>{t.actions.setDOM(r,{dom:n});const a=this.inherit(e=>{e.select(n,r),e.hover(n,r),e.drag(n,r)}),o=this.addCraftEventListener(n,"mouseover",e=>{e.craft.stopPropagation(),t.actions.setLayerEvent("hovered",r)});let d=null;this.derived.options.removeHoverOnMouseleave&&(d=this.addCraftEventListener(n,"mouseleave",e=>{e.craft.stopPropagation(),t.actions.setLayerEvent("hovered",null)}));const i=this.addCraftEventListener(n,"dragover",n=>{n.craft.stopPropagation(),n.preventDefault();const{indicator:r,currentCanvasHovered:a}=E.events;if(a&&r){const o=this.getLayer(a.id).headingDom.getBoundingClientRect();if(n.clientY>o.top+10&&n.clientY<o.bottom-10){const n=a.data.nodes[a.data.nodes.length-1];if(!n)return void(E.events.indicator=b(b({},r),{},{placement:b(b({},r.placement),{},{index:0,where:"before",parent:a}),onCanvas:!0}));E.events.indicator=b(b({},r),{},{placement:{currentNode:e.query.node(n).get(),index:a.data.nodes.length,where:"after",parent:a},onCanvas:!0}),t.actions.setIndicator(E.events.indicator)}}}),s=this.addCraftEventListener(n,"dragenter",n=>{n.craft.stopPropagation(),n.preventDefault();const a=E.draggedElement;if(!a)return;const o=e.query.getDropPlaceholder(a,r,{x:n.clientX,y:n.clientY},e=>{const t=this.getLayer(e.id);return t&&t.dom});if(o){const{placement:{parent:r}}=o,a=this.getLayer(r.id).headingDom.getBoundingClientRect();if(E.events.currentCanvasHovered=null,e.query.node(r.id).isCanvas()&&r.data.parent){const t=e.query.node(r.data.parent).get();e.query.node(t.id).isCanvas()&&(E.events.currentCanvasHovered=r,(n.clientY>a.bottom-10&&!this.getLayer(r.id).expanded||n.clientY<a.top+10)&&(o.placement.parent=t,o.placement.currentNode=r,o.placement.index=t.data.nodes?t.data.nodes.indexOf(r.id):0,n.clientY>a.bottom-10&&!this.getLayer(r.id).expanded?o.placement.where="after":n.clientY<a.top+10&&(o.placement.where="before")))}E.events.indicator=b(b({},o),{},{onCanvas:!1}),t.actions.setIndicator(E.events.indicator)}});return()=>{a(),o(),i(),s(),d&&d()}},layerHeader:(e,n)=>{t.actions.setDOM(n,{headingDom:e})},drag:(n,r)=>{n.setAttribute("draggable","true");const a=this.addCraftEventListener(n,"dragstart",e=>{e.craft.stopPropagation(),E.draggedElement=r}),o=this.addCraftEventListener(n,"dragend",n=>{n.craft.stopPropagation();const r=E.events;if(r.indicator&&!r.indicator.error){const{placement:t}=r.indicator,{parent:n,index:a,where:o}=t,{id:d}=n;e.actions.move(E.draggedElement,d,a+("after"===o?1:0))}E.draggedElement=null,E.events.indicator=null,t.actions.setIndicator(null)});return()=>{n.removeAttribute("draggable"),a(),o()}}}}}y(E,"draggedElement",void 0),y(E,"events",{indicator:null,currentCanvasHovered:null});const w=({children:r})=>{const{layers:a,events:o}=p(e=>e),{query:d}=n.useEditor(e=>({enabled:e.options.enabled})),{indicator:s}=d.getOptions(),l=t.useMemo(()=>{const{indicator:e}=o;if(e){const{placement:{where:t,parent:n,currentNode:r},error:o}=e,d=r?r.id:n.id;let i;const l=o?s.error:s.success;if(e.onCanvas&&null!=a[n.id].dom){const e=a[n.id].dom.getBoundingClientRect(),t=a[n.id].headingDom.getBoundingClientRect();return{top:t.top,left:e.left,width:e.width,height:t.height,background:"transparent",borderWidth:"1px",borderColor:l}}{if(!a[d])return;const e=a[d].headingDom.getBoundingClientRect(),n=a[d].dom.getBoundingClientRect();return i="after"!==t&&r?n.top:n.top+n.height,{top:i,left:e.left,width:n.width+n.left-e.left,height:2,borderWidth:0,background:l}}}},[o,s.error,s.success,a]);return i.default.createElement("div",null,o.indicator?i.default.createElement(e.RenderIndicator,{style:l}):null,r)},C=({children:e})=>{const{store:r}=p(),a=n.useEventHandler(),o=t.useMemo(()=>a.derive(E,{layerStore:r}),[a,r]);return i.default.createElement(g.Provider,{value:o},i.default.createElement(w,null),e)},$=()=>{const{id:e}=f(),{displayName:r,actions:a}=n.useEditor(t=>({displayName:t.nodes[e]&&t.nodes[e].data.custom.displayName?t.nodes[e].data.custom.displayName:t.nodes[e].data.displayName,hidden:t.nodes[e]&&t.nodes[e].data.hidden})),[o,d]=t.useState(!1),s=t.useRef(null),c=t.useCallback(e=>{s.current&&!s.current.contains(e.target)&&d(!1)},[]);return t.useEffect(()=>()=>{window.removeEventListener("click",c)},[c]),i.default.createElement(l.default,{html:r,disabled:!o,ref:e=>{e&&(s.current=e.el.current,window.removeEventListener("click",c),window.addEventListener("click",c))},onChange:t=>{a.setCustom(e,e=>e.displayName=t.target.value)},tagName:"h2",onDoubleClick:()=>{o||d(!0)}})};var O;function L(){return L=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},L.apply(null,arguments)}var P,j,D=function(e){return s.createElement("svg",L({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 10 6"},e),O||(O=s.createElement("path",{d:"M9.99 1.01A1 1 0 0 0 8.283.303L5 3.586 1.717.303A1 1 0 1 0 .303 1.717l3.99 3.98a1 1 0 0 0 1.414 0l3.99-3.98a.997.997 0 0 0 .293-.707Z"})))};function S(){return S=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},S.apply(null,arguments)}var M,H,_=function(e){return s.createElement("svg",S({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:16,height:16},e),P||(P=s.createElement("path",{fill:"none",d:"M0 0h24v24H0z"})),j||(j=s.createElement("path",{d:"M1.181 12C2.121 6.88 6.608 3 12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"})))};function k(){return k=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},k.apply(null,arguments)}var N=function(e){return s.createElement("svg",k({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 18 18"},e),M||(M=s.createElement("path",{className:"linked_svg__a",d:"M16.5 9h-1a.5.5 0 0 0-.5.5V15H3V3h5.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5Z"})),H||(H=s.createElement("path",{className:"linked_svg__a",d:"M16.75 1h-5.373a.4.4 0 0 0-.377.4.392.392 0 0 0 .117.28l1.893 1.895-3.52 3.521a.5.5 0 0 0 0 .707l.706.708a.5.5 0 0 0 .708 0l3.521-3.521 1.893 1.892A.39.39 0 0 0 16.6 7a.4.4 0 0 0 .4-.377V1.25a.25.25 0 0 0-.25-.25Z"})))};const R={bgBase:"transparent",bgHover:"#f1f1f1",bgSelected:"#2680eb",bgCanvas:"rgba(255, 255, 255, 0.02)",textPrimary:"inherit",textSelected:"#fff",iconPrimary:"#808184",iconSelected:"#fff",borderColor:"#00000012",shadowColor:"#00000014"},B={bgBase:"transparent",bgHover:"#2a2a2a",bgSelected:"#2680eb",bgCanvas:"rgba(255, 255, 255, 0.05)",textPrimary:"#e0e0e0",textSelected:"#fff",iconPrimary:"#b0b0b0",iconSelected:"#fff",borderColor:"#ffffff12",shadowColor:"#00000040"},q=e=>"dark"===e?B:R,T=t.createContext(null),z=({theme:e,themeMode:n,children:r})=>{const a=t.useMemo(()=>({theme:e||q(n)}),[e,n]);return i.default.createElement(T.Provider,{value:a},r)},A=()=>{const e=t.useContext(T);return e?e.theme:q("light")},Y=r.styled.div`
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
`,I=r.styled.a`
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
`,F=r.styled.a`
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
`,J=r.styled.div`
  margin-left: -22px;
  margin-right: 10px;

  svg {
    width: 12px;
    height: 12px;
  }
`,V=()=>{const e=A(),{id:t,depth:r,expanded:a,children:o,connectors:{drag:d,layerHeader:s},actions:{toggleLayer:l}}=f(e=>({expanded:e.expanded})),{hidden:c,actions:u,selected:p,topLevel:h}=n.useEditor((e,n)=>{const r=n.getEvent("selected").first()===t;return{hidden:e.nodes[t]&&e.nodes[t].data.hidden,selected:r,topLevel:n.node(t).isTopLevelCanvas()}});return i.default.createElement(Y,{$selected:p,ref:e=>{d(e)},$depth:r,$theme:e},i.default.createElement(F,{$selected:p,$isHidden:c,$theme:e,onClick:()=>u.setHidden(t,!c)},i.default.createElement(_,null)),i.default.createElement("div",{className:"inner"},i.default.createElement("div",{ref:e=>{s(e)}},h?i.default.createElement(J,null,i.default.createElement(N,null)):null,i.default.createElement("div",{className:"layer-name s"},i.default.createElement($,null)),i.default.createElement("div",null,o&&o.length?i.default.createElement(I,{$expanded:a,onMouseDown:()=>l()},i.default.createElement(D,null)):null))))},Z=r.styled.div`
  background: ${e=>e.$hovered?e.$theme.bgHover:e.$theme.bgBase};
  display: block;
  padding-bottom: ${e=>e.$hasCanvases&&e.$expanded?5:0}px;
`,W=r.styled.div`
  margin: 0 0 0 ${e=>e.$hasCanvases?35:0}px;
  background: ${e=>e.$hasCanvases?e.$theme.bgCanvas:"transparent"};
  position: relative;

  ${e=>e.$hasCanvases?`\n\n  box-shadow: 0px 0px 44px -1px ${e.$theme.shadowColor};\n  border-radius: 10px;\n  margin-right: 5px;\n  margin-bottom:5px;\n  margin-top:5px;\n  > * { overflow:hidden; }\n    &:before {\n      position:absolute;\n      left:-19px;\n      width: 2px;\n      height:100%;\n      content: " ";\n      background:${e.$theme.borderColor};\n    }\n  `:""}
`,U=({children:e})=>{const t=A(),{id:r,expanded:a,hovered:o,connectors:{layer:d}}=f(e=>({hovered:e.event.hovered,expanded:e.expanded})),{hasChildCanvases:s}=n.useEditor((e,t)=>({hasChildCanvases:t.node(r).isParentOfTopLevelNodes()}));return i.default.createElement(Z,{ref:e=>{d(e)},$expanded:a,$hasCanvases:s,$hovered:o,$theme:t},i.default.createElement(V,null),e?i.default.createElement(W,{$hasCanvases:s,$theme:t,className:"craft-layer-children"},e):null)},X=({children:t,options:n})=>{const r=e.useMethods(v,{layers:{},events:{selected:null,dragged:null,hovered:null},options:{renderLayer:U,...n}});return i.default.createElement(u.Provider,{value:{store:r}},i.default.createElement(z,{theme:n.theme,themeMode:n.themeMode},i.default.createElement(C,null,t)))};exports.DefaultLayer=U,exports.DefaultLayerHeader=V,exports.EditableLayerName=$,exports.Layers=({...t})=>i.default.createElement(X,{options:t},i.default.createElement(m,{id:e.ROOT_NODE,depth:0})),exports.darkTheme=B,exports.getTheme=q,exports.lightTheme=R,exports.useLayer=f;
//# sourceMappingURL=index.js.map
