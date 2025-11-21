'undefined' != typeof window &&
  (window.__CRAFTJS__ || (window.__CRAFTJS__ = {}),
  (window.__CRAFTJS__['@craftjs/layers'] = '0.2.7'));
import {
  useCollector as e,
  wrapConnectorHooks as t,
  useMethods as n,
  ROOT_NODE as r,
} from '@craftjs/utils';
import * as a from 'react';
import o, {
  createContext as i,
  useContext as l,
  useMemo as s,
  useState as d,
  useLayoutEffect as c,
  useRef as p,
  useEffect as h,
  useCallback as u,
} from 'react';
import {
  useEditor as m,
  ROOT_NODE as g,
  DerivedCoreEventHandlers as v,
  useEventHandler as f,
} from '@craftjs/core';
import { keyframes as y, styled as x } from 'styled-components';
import b from 'react-contenteditable';
const E = o.createContext({}),
  w = i({});
function $(t) {
  const { store: n } = l(w),
    r = e(n, t);
  return s(() => ({ store: n, ...r }), [n, r]);
}
function C(e) {
  const { id: n, depth: r, connectors: a } = l(E),
    { actions: o, ...i } = $((t) => n && t.layers[n] && e && e(t.layers[n])),
    { children: d } = m((e, t) => ({
      children: e.nodes[n] && t.node(n).descendants(),
    })),
    c = s(
      () => ({
        toggleLayer: () => o.toggleLayer(n),
        setExpandedState: (e) => o.setExpandedState(n, e),
      }),
      [o, n]
    ),
    p = s(
      () =>
        t({
          layer: (e) => a.layer(e, n),
          drag: (e) => a.drag(e, n),
          layerHeader: (e) => a.layerHeader(e, n),
        }),
      [a, n]
    );
  return { id: n, depth: r, children: d, actions: c, connectors: p, ...i };
}
const O = () => {
    const { id: e, depth: t, children: n, expanded: r } = C((e) => ({
        expanded: e.expanded,
      })),
      { data: a, shouldBeExpanded: i } = m((t, n) => {
        const r = n.getEvent('selected').first();
        return {
          data: t.nodes[e] && t.nodes[e].data,
          shouldBeExpanded: r && n.node(r).ancestors(!0).includes(e),
        };
      }),
      {
        actions: { registerLayer: l, toggleLayer: s },
        renderLayer: u,
        expandRootOnLoad: v,
      } = $((e) => ({
        renderLayer: e.options.renderLayer,
        expandRootOnLoad: e.options.expandRootOnLoad,
      })),
      [f, y] = d(!1);
    c(() => {
      l(e), y(!0);
    }, [l, e]);
    const x = p(r);
    x.current = r;
    const b = p(v && e === g);
    return (
      h(() => {
        !x.current && i && s(e);
      }, [s, e, i]),
      h(() => {
        b.current && s(e);
      }, [s, e]),
      a && f
        ? o.createElement(
            'div',
            { className: `craft-layer-node ${e}` },
            o.createElement(
              u,
              {},
              n && r
                ? n.map((e) =>
                    o.createElement(S, { key: e, id: e, depth: t + 1 })
                  )
                : null
            )
          )
        : null
    );
  },
  L = i(null),
  S = ({ id: e, depth: n }) => {
    const r = l(L),
      { store: a } = l(w);
    p(a).current = a;
    const i = s(() => r.createConnectorsUsage(), [r]),
      d = s(() => t(i.connectors), [i]);
    h(
      () => (
        i.register(),
        () => {
          i.cleanup();
        }
      ),
      [i]
    );
    const { exists: c } = m((t) => ({ exists: !!t.nodes[e] }));
    return c
      ? o.createElement(
          E.Provider,
          { value: { id: e, depth: n, connectors: d } },
          o.createElement(O, null)
        )
      : null;
  },
  P = (e) => ({
    setLayerEvent: (t, n) => {
      if (null !== n && !e.layers[n]) return;
      const r = e.events[t];
      r && n !== r && (e.layers[r].event[t] = !1),
        n
          ? ((e.layers[n].event[t] = !0), (e.events[t] = n))
          : (e.events[t] = null);
    },
    registerLayer: (t) => {
      e.layers[t] ||
        (e.layers[t] = {
          dom: null,
          headingDom: null,
          expanded: !1,
          id: t,
          event: { selected: !1, hovered: !1 },
        });
    },
    setDOM: (t, n) => {
      e.layers[t] = {
        ...e.layers[t],
        ...(n.dom ? { dom: n.dom } : {}),
        ...(n.headingDom ? { headingDom: n.headingDom } : {}),
      };
    },
    toggleLayer: (t) => {
      e.layers[t].expanded = !e.layers[t].expanded;
    },
    setExpandedState: (t, n) => {
      e.layers[t].expanded = n;
    },
    setIndicator: (t) => {
      e.events.indicator = t;
    },
  });
function H(e, t, n) {
  return (
    (t = (function (e) {
      var t = (function (e) {
        if ('object' != typeof e || !e) return e;
        var t = e[Symbol.toPrimitive];
        if (void 0 !== t) {
          var n = t.call(e, 'string');
          if ('object' != typeof n) return n;
          throw new TypeError('@@toPrimitive must return a primitive value.');
        }
        return String(e);
      })(e);
      return 'symbol' == typeof t ? t : t + '';
    })(t)) in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = n),
    e
  );
}
function _(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function D(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = null != arguments[t] ? arguments[t] : {};
    t % 2
      ? _(Object(n), !0).forEach(function (t) {
          H(e, t, n[t]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
      : _(Object(n)).forEach(function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
        });
  }
  return e;
}
class j extends v {
  constructor() {
    super(...arguments),
      H(this, 'autoScrollInterval', null),
      H(this, 'AUTO_SCROLL_THRESHOLD', 50),
      H(this, 'AUTO_SCROLL_SPEED', 5);
  }
  getLayer(e) {
    return this.options.layerStore.getState().layers[e];
  }
  handleAutoScroll(e, t) {
    if (!t) return;
    const n = t.getBoundingClientRect(),
      r = e.clientY - n.top,
      a = n.bottom - e.clientY;
    if (
      (this.autoScrollInterval &&
        (cancelAnimationFrame(this.autoScrollInterval),
        (this.autoScrollInterval = null)),
      r < this.AUTO_SCROLL_THRESHOLD && t.scrollTop > 0)
    ) {
      const e = Math.max(1, (this.AUTO_SCROLL_THRESHOLD - r) / 10),
        n = () => {
          (t.scrollTop -= e),
            t.scrollTop > 0 &&
              (this.autoScrollInterval = requestAnimationFrame(n));
        };
      this.autoScrollInterval = requestAnimationFrame(n);
    } else if (
      a < this.AUTO_SCROLL_THRESHOLD &&
      t.scrollTop < t.scrollHeight - t.clientHeight
    ) {
      const e = Math.max(1, (this.AUTO_SCROLL_THRESHOLD - a) / 10),
        n = () => {
          (t.scrollTop += e),
            t.scrollTop < t.scrollHeight - t.clientHeight &&
              (this.autoScrollInterval = requestAnimationFrame(n));
        };
      this.autoScrollInterval = requestAnimationFrame(n);
    }
  }
  stopAutoScroll() {
    this.autoScrollInterval &&
      (cancelAnimationFrame(this.autoScrollInterval),
      (this.autoScrollInterval = null));
  }
  handlers() {
    const e = this.derived.options.store,
      { layerStore: t } = this.options;
    return {
      layer: (n, r) => {
        t.actions.setDOM(r, { dom: n });
        const a = this.inherit((e) => {
            e.select(n, r), e.hover(n, r), e.drag(n, r);
          }),
          o = this.addCraftEventListener(n, 'mouseover', (e) => {
            e.craft.stopPropagation(), t.actions.setLayerEvent('hovered', r);
          });
        let i = null;
        this.derived.options.removeHoverOnMouseleave &&
          (i = this.addCraftEventListener(n, 'mouseleave', (e) => {
            e.craft.stopPropagation(), t.actions.setLayerEvent('hovered', null);
          }));
        const l = this.addCraftEventListener(n, 'dragover', (r) => {
            r.craft.stopPropagation(), r.preventDefault();
            const a = n.closest('.craft-layers-container');
            this.handleAutoScroll(r, a);
            const { indicator: o, currentCanvasHovered: i } = j.events;
            if (i && o) {
              const n = this.getLayer(i.id).headingDom.getBoundingClientRect();
              if (r.clientY > n.top + 20 && r.clientY < n.bottom - 20) {
                const n = i.data.nodes[i.data.nodes.length - 1];
                if (!n)
                  return void (j.events.indicator = D(
                    D({}, o),
                    {},
                    {
                      placement: D(
                        D({}, o.placement),
                        {},
                        { index: 0, where: 'before', parent: i }
                      ),
                      onCanvas: !0,
                    }
                  ));
                (j.events.indicator = D(
                  D({}, o),
                  {},
                  {
                    placement: {
                      currentNode: e.query.node(n).get(),
                      index: i.data.nodes.length,
                      where: 'after',
                      parent: i,
                    },
                    onCanvas: !0,
                  }
                )),
                  t.actions.setIndicator(j.events.indicator);
              }
            }
          }),
          s = this.addCraftEventListener(n, 'dragenter', (n) => {
            n.craft.stopPropagation(), n.preventDefault();
            const a = j.draggedElement;
            if (!a) return;
            const o = e.query.getDropPlaceholder(
              a,
              r,
              { x: n.clientX, y: n.clientY },
              (e) => {
                const t = this.getLayer(e.id);
                return t && t.dom;
              }
            );
            if (o) {
              const {
                  placement: { parent: r },
                } = o,
                a = this.getLayer(r.id).headingDom.getBoundingClientRect();
              if (
                ((j.events.currentCanvasHovered = null),
                e.query.node(r.id).isCanvas() && r.data.parent)
              ) {
                const t = e.query.node(r.data.parent).get();
                e.query.node(t.id).isCanvas() &&
                  ((j.events.currentCanvasHovered = r),
                  ((n.clientY > a.bottom - 20 &&
                    !this.getLayer(r.id).expanded) ||
                    n.clientY < a.top + 20) &&
                    ((o.placement.parent = t),
                    (o.placement.currentNode = r),
                    (o.placement.index = t.data.nodes
                      ? t.data.nodes.indexOf(r.id)
                      : 0),
                    n.clientY > a.bottom - 20 && !this.getLayer(r.id).expanded
                      ? (o.placement.where = 'after')
                      : n.clientY < a.top + 20 &&
                        (o.placement.where = 'before')));
              }
              (j.events.indicator = D(D({}, o), {}, { onCanvas: !1 })),
                t.actions.setIndicator(j.events.indicator);
            }
          });
        return () => {
          a(), o(), l(), s(), i && i();
        };
      },
      layerHeader: (e, n) => {
        t.actions.setDOM(n, { headingDom: e });
      },
      drag: (n, r) => {
        n.setAttribute('draggable', 'true');
        const a = this.addCraftEventListener(n, 'dragstart', (e) => {
            e.craft.stopPropagation(), (j.draggedElement = r);
          }),
          o = this.addCraftEventListener(n, 'dragend', (n) => {
            n.craft.stopPropagation(), this.stopAutoScroll();
            const r = j.events;
            if (r.indicator && !r.indicator.error) {
              const { placement: t } = r.indicator,
                { parent: n, index: a, where: o } = t,
                { id: i } = n;
              e.actions.move(j.draggedElement, i, a + ('after' === o ? 1 : 0));
            }
            (j.draggedElement = null),
              (j.events.indicator = null),
              t.actions.setIndicator(null);
          });
        return () => {
          n.removeAttribute('draggable'), a(), o();
        };
      },
    };
  }
}
H(j, 'draggedElement', void 0),
  H(j, 'events', { indicator: null, currentCanvasHovered: null });
const M = y`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`,
  R = x.div`
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  box-shadow: ${(e) =>
    e.$error
      ? '0 0 8px rgba(239, 68, 68, 0.6)'
      : '0 0 8px rgba(59, 130, 246, 0.6)'};
  animation: ${M} 1.5s ease-in-out infinite;
`,
  A = ({ children: e }) => {
    const { layers: t, events: n } = $((e) => e),
      { query: r } = m((e) => ({ enabled: e.options.enabled })),
      { indicator: a } = r.getOptions(),
      i = s(() => {
        const { indicator: e } = n;
        if (e) {
          const {
              placement: { where: n, parent: r, currentNode: o },
              error: i,
            } = e,
            l = o ? o.id : r.id;
          let s;
          const d = i ? a.error : a.success;
          if (e.onCanvas && null != t[r.id].dom) {
            const e = t[r.id].dom.getBoundingClientRect(),
              n = t[r.id].headingDom.getBoundingClientRect();
            return {
              top: n.top,
              left: e.left,
              width: e.width,
              height: n.height,
              background: 'transparent',
              borderWidth: '1px',
              borderColor: d,
            };
          }
          {
            if (!t[l]) return;
            const e = t[l].headingDom.getBoundingClientRect(),
              r = t[l].dom.getBoundingClientRect();
            return (
              (s = 'after' !== n && o ? r.top : r.top + r.height),
              {
                top: s,
                left: e.left,
                width: r.width + r.left - e.left,
                height: 4,
                borderWidth: 0,
                background: d,
              }
            );
          }
        }
      }, [n, a.error, a.success, t]);
    return o.createElement(
      'div',
      null,
      n.indicator
        ? o.createElement(R, { $error: !!n.indicator.error, style: i })
        : null,
      e
    );
  },
  T = ({ children: e }) => {
    const { store: t } = $(),
      n = f(),
      r = s(() => n.derive(j, { layerStore: t }), [n, t]);
    return o.createElement(
      L.Provider,
      { value: r },
      o.createElement(A, null),
      e
    );
  },
  k = () => {
    const { id: e } = C(),
      { displayName: t, actions: n } = m((t) => ({
        displayName:
          t.nodes[e] && t.nodes[e].data.custom.displayName
            ? t.nodes[e].data.custom.displayName
            : t.nodes[e].data.displayName,
        hidden: t.nodes[e] && t.nodes[e].data.hidden,
      })),
      [r, a] = d(!1),
      i = p(null),
      l = u((e) => {
        i.current && !i.current.contains(e.target) && a(!1);
      }, []);
    return (
      h(
        () => () => {
          window.removeEventListener('click', l);
        },
        [l]
      ),
      o.createElement(b, {
        html: t,
        disabled: !r,
        ref: (e) => {
          e &&
            ((i.current = e.el.current),
            window.removeEventListener('click', l),
            window.addEventListener('click', l));
        },
        onChange: (t) => {
          n.setCustom(e, (e) => (e.displayName = t.target.value));
        },
        tagName: 'h2',
        onDoubleClick: () => {
          r || a(!0);
        },
      })
    );
  };
var N;
function I() {
  return (
    (I = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}.hasOwnProperty.call(n, r) && (e[r] = n[r]));
          }
          return e;
        }),
    I.apply(null, arguments)
  );
}
var B,
  z,
  q = function (e) {
    return a.createElement(
      'svg',
      I({ xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 10 6' }, e),
      N ||
        (N = a.createElement('path', {
          d:
            'M9.99 1.01A1 1 0 0 0 8.283.303L5 3.586 1.717.303A1 1 0 1 0 .303 1.717l3.99 3.98a1 1 0 0 0 1.414 0l3.99-3.98a.997.997 0 0 0 .293-.707Z',
        }))
    );
  };
function F() {
  return (
    (F = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}.hasOwnProperty.call(n, r) && (e[r] = n[r]));
          }
          return e;
        }),
    F.apply(null, arguments)
  );
}
var U,
  Y,
  J,
  V,
  Z,
  W,
  X = function (e) {
    return a.createElement(
      'svg',
      F(
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          width: 16,
          height: 16,
        },
        e
      ),
      B || (B = a.createElement('path', { fill: 'none', d: 'M0 0h24v24H0z' })),
      z ||
        (z = a.createElement('path', {
          d:
            'M1.181 12C2.121 6.88 6.608 3 12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
        }))
    );
  };
function G() {
  return (
    (G = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}.hasOwnProperty.call(n, r) && (e[r] = n[r]));
          }
          return e;
        }),
    G.apply(null, arguments)
  );
}
var K,
  Q,
  ee = function (e) {
    return a.createElement(
      'svg',
      G(
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: 16,
          height: 16,
          fill: 'currentColor',
        },
        e
      ),
      U || (U = a.createElement('circle', { cx: 6, cy: 4, r: 1.5 })),
      Y || (Y = a.createElement('circle', { cx: 10, cy: 4, r: 1.5 })),
      J || (J = a.createElement('circle', { cx: 6, cy: 8, r: 1.5 })),
      V || (V = a.createElement('circle', { cx: 10, cy: 8, r: 1.5 })),
      Z || (Z = a.createElement('circle', { cx: 6, cy: 12, r: 1.5 })),
      W || (W = a.createElement('circle', { cx: 10, cy: 12, r: 1.5 }))
    );
  };
function te() {
  return (
    (te = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}.hasOwnProperty.call(n, r) && (e[r] = n[r]));
          }
          return e;
        }),
    te.apply(null, arguments)
  );
}
var ne = function (e) {
  return a.createElement(
    'svg',
    te({ xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 18 18' }, e),
    K ||
      (K = a.createElement('path', {
        className: 'linked_svg__a',
        d:
          'M16.5 9h-1a.5.5 0 0 0-.5.5V15H3V3h5.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5Z',
      })),
    Q ||
      (Q = a.createElement('path', {
        className: 'linked_svg__a',
        d:
          'M16.75 1h-5.373a.4.4 0 0 0-.377.4.392.392 0 0 0 .117.28l1.893 1.895-3.52 3.521a.5.5 0 0 0 0 .707l.706.708a.5.5 0 0 0 .708 0l3.521-3.521 1.893 1.892A.39.39 0 0 0 16.6 7a.4.4 0 0 0 .4-.377V1.25a.25.25 0 0 0-.25-.25Z',
      }))
  );
};
const re = {
    bgBase: 'transparent',
    bgHover: '#f1f1f1',
    bgSelected: '#2680eb',
    bgCanvas: 'rgba(255, 255, 255, 0.02)',
    textPrimary: 'inherit',
    textSelected: '#fff',
    iconPrimary: '#808184',
    iconSelected: '#fff',
    borderColor: '#00000012',
    shadowColor: '#00000014',
  },
  ae = {
    bgBase: 'transparent',
    bgHover: '#2a2a2a',
    bgSelected: '#2680eb',
    bgCanvas: 'rgba(255, 255, 255, 0.05)',
    textPrimary: '#e0e0e0',
    textSelected: '#fff',
    iconPrimary: '#b0b0b0',
    iconSelected: '#fff',
    borderColor: '#ffffff12',
    shadowColor: '#00000040',
  },
  oe = (e) => ('dark' === e ? ae : re),
  ie = i(null),
  le = ({ theme: e, themeMode: t, children: n }) => {
    const r = s(() => ({ theme: e || oe(t) }), [e, t]);
    return o.createElement(ie.Provider, { value: r }, n);
  },
  se = () => {
    const e = l(ie);
    return e ? e.theme : oe('light');
  },
  de = x.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  background: ${(e) => (e.$selected ? e.$theme.bgSelected : 'transparent')};
  color: ${(e) => (e.$selected ? e.$theme.textSelected : e.$theme.textPrimary)};
  svg {
    fill: ${(e) =>
      e.$selected ? e.$theme.iconSelected : e.$theme.iconPrimary};
    margin-top: 2px;
  }
  .inner {
    flex: 1;
    > div {
      padding: 0px;
      flex: 1;
      display: flex;
      margin-left: ${(e) => Math.min(8 * e.$depth, 40)}px;
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
`,
  ce = x.a`
  width: 8px;
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  transform: rotate(${(e) => (e.$expanded ? 180 : 0)}deg);
  opacity: 0.7;
  cursor: pointer;
`,
  pe = x.a`
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
    opacity: ${(e) => (e.$isHidden ? 0.2 : 1)};
  }
  &:after {
    content: ' ';
    width: 2px;
    height: ${(e) => (e.$isHidden ? 100 : 0)}%;
    position: absolute;
    left: 2px;
    top: 3px;
    background: ${(e) =>
      e.$selected ? e.$theme.iconSelected : e.$theme.iconPrimary};
    transform: rotate(-45deg);
    transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    transform-origin: 0% 0%;
    opacity: ${(e) => (e.$isHidden ? 0.4 : 1)};
  }
`,
  he = x.div`
  margin-left: -22px;
  margin-right: 10px;

  svg {
    width: 12px;
    height: 12px;
  }
`,
  ue = x.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  opacity: 0.4;
  transition: opacity 0.2s ease;
  margin-right: 4px;
  flex-shrink: 0;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    cursor: grabbing;
    opacity: 1;
  }

  svg {
    width: 14px;
    height: 14px;
    pointer-events: none;
  }
`,
  me = x.div`
  display: flex;
  gap: 2px;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
`,
  ge = x.button`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: ${(e) => (e.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(e) => (e.$disabled ? 0.3 : 0.6)};
  transition: opacity 0.2s ease;
  padding: 0;
  border-radius: 3px;

  &:hover {
    opacity: ${(e) => (e.$disabled ? 0.3 : 1)};
    background: ${(e) => (e.$disabled ? 'transparent' : e.$theme.bgHover)};
  }

  svg {
    width: 12px;
    height: 12px;
    pointer-events: none;
  }
`,
  ve = () => {
    const e = se(),
      {
        id: t,
        depth: n,
        expanded: r,
        children: a,
        connectors: { drag: i, layerHeader: l },
        actions: { toggleLayer: s },
      } = C((e) => ({ expanded: e.expanded })),
      {
        hidden: d,
        actions: c,
        selected: p,
        topLevel: h,
        parent: u,
        currentIndex: g,
        canMoveUp: v,
        canMoveDown: f,
      } = m((e, n) => {
        const r = n.getEvent('selected').first() === t,
          a = e.nodes[t],
          o = a?.data?.parent ? e.nodes[a.data.parent] : null,
          i = o?.data?.nodes || [],
          l = i.indexOf(t);
        return {
          hidden: a && a.data.hidden,
          selected: r,
          topLevel: n.node(t).isTopLevelCanvas(),
          parent: o,
          currentIndex: l,
          canMoveUp: l > 0,
          canMoveDown: l < i.length - 1 && -1 !== l,
        };
      }),
      [y, x] = o.useState(!1);
    return o.createElement(
      de,
      {
        $selected: p,
        $depth: n,
        $theme: e,
        onMouseEnter: () => x(!0),
        onMouseLeave: () => x(!1),
      },
      o.createElement(
        ue,
        {
          ref: (e) => {
            i(e);
          },
          $theme: e,
        },
        o.createElement(ee, null)
      ),
      o.createElement(
        pe,
        {
          $selected: p,
          $isHidden: d,
          $theme: e,
          onClick: () => c.setHidden(t, !d),
        },
        o.createElement(X, null)
      ),
      o.createElement(
        'div',
        { className: 'inner' },
        o.createElement(
          'div',
          {
            ref: (e) => {
              l(e);
            },
          },
          h ? o.createElement(he, null, o.createElement(ne, null)) : null,
          o.createElement(
            'div',
            { className: 'layer-name s' },
            o.createElement(k, null)
          ),
          o.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
            !h &&
              y &&
              o.createElement(
                me,
                { $theme: e, style: { opacity: y ? 1 : 0 } },
                o.createElement(
                  ge,
                  {
                    $theme: e,
                    $disabled: !v,
                    onClick: (e) => {
                      e.stopPropagation(), v && u && c.move(t, u.id, g - 1);
                    },
                    title: 'Move up',
                  },
                  o.createElement(
                    'svg',
                    { viewBox: '0 0 16 16', fill: 'currentColor' },
                    o.createElement('path', { d: 'M8 3l-5 5h10z' })
                  )
                ),
                o.createElement(
                  ge,
                  {
                    $theme: e,
                    $disabled: !f,
                    onClick: (e) => {
                      e.stopPropagation(), f && u && c.move(t, u.id, g + 2);
                    },
                    title: 'Move down',
                  },
                  o.createElement(
                    'svg',
                    { viewBox: '0 0 16 16', fill: 'currentColor' },
                    o.createElement('path', { d: 'M8 13l5-5H3z' })
                  )
                )
              ),
            a && a.length
              ? o.createElement(
                  ce,
                  { $expanded: r, onMouseDown: () => s() },
                  o.createElement(q, null)
                )
              : null
          )
        )
      )
    );
  },
  fe = x.div`
  background: ${(e) => (e.$hovered ? e.$theme.bgHover : e.$theme.bgBase)};
  display: block;
  padding-bottom: ${(e) => (e.$hasCanvases && e.$expanded ? 5 : 0)}px;
`,
  ye = x.div`
  margin: 0 0 0 ${(e) => (e.$hasCanvases ? 28 : 0)}px;
  background: ${(e) => (e.$hasCanvases ? e.$theme.bgCanvas : 'transparent')};
  position: relative;

  ${(e) =>
    e.$hasCanvases
      ? `\n\n  box-shadow: 0px 0px 44px -1px ${e.$theme.shadowColor};\n  border-radius: 10px;\n  margin-right: 5px;\n  margin-bottom:5px;\n  margin-top:5px;\n  > * { overflow:hidden; }\n    &:before {\n      position:absolute;\n      left:-19px;\n      width: 2px;\n      height:100%;\n      content: " ";\n      background:${e.$theme.borderColor};\n    }\n  `
      : ''}
`,
  xe = ({ children: e }) => {
    const t = se(),
      {
        id: n,
        expanded: r,
        hovered: a,
        connectors: { layer: i },
      } = C((e) => ({ hovered: e.event.hovered, expanded: e.expanded })),
      { hasChildCanvases: l } = m((e, t) => ({
        hasChildCanvases: t.node(n).isParentOfTopLevelNodes(),
      }));
    return o.createElement(
      fe,
      {
        ref: (e) => {
          i(e);
        },
        $expanded: r,
        $hasCanvases: l,
        $hovered: a,
        $theme: t,
      },
      o.createElement(ve, null),
      e
        ? o.createElement(
            ye,
            { $hasCanvases: l, $theme: t, className: 'craft-layer-children' },
            e
          )
        : null
    );
  },
  be = ({ children: e, options: t }) => {
    const r = n(P, {
      layers: {},
      events: { selected: null, dragged: null, hovered: null },
      options: { renderLayer: xe, ...t },
    });
    return o.createElement(
      w.Provider,
      { value: { store: r } },
      o.createElement(
        le,
        { theme: t.theme, themeMode: t.themeMode },
        o.createElement(T, null, e)
      )
    );
  },
  Ee = ({ ...e }) =>
    o.createElement(
      'div',
      {
        className: 'craft-layers-container',
        style: { height: '100%', overflow: 'auto' },
      },
      o.createElement(
        be,
        { options: e },
        o.createElement(S, { id: r, depth: 0 })
      )
    );
export {
  xe as DefaultLayer,
  ve as DefaultLayerHeader,
  k as EditableLayerName,
  Ee as Layers,
  ae as darkTheme,
  oe as getTheme,
  re as lightTheme,
  C as useLayer,
};
//# sourceMappingURL=index.js.map
