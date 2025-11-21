'use strict';
'undefined' != typeof window &&
  (window.__CRAFTJS__ || (window.__CRAFTJS__ = {}),
  (window.__CRAFTJS__['@craftjs/layers'] = '0.2.7')),
  Object.defineProperty(exports, '__esModule', { value: !0 });
var e = require('@craftjs/utils'),
  t = require('react'),
  n = require('@craftjs/core'),
  r = require('styled-components'),
  a = require('react-contenteditable');
function o(e) {
  return e && 'object' == typeof e && 'default' in e ? e : { default: e };
}
function i(e) {
  if (e && e.__esModule) return e;
  var t = Object.create(null);
  return (
    e &&
      Object.keys(e).forEach(function (n) {
        if ('default' !== n) {
          var r = Object.getOwnPropertyDescriptor(e, n);
          Object.defineProperty(
            t,
            n,
            r.get
              ? r
              : {
                  enumerable: !0,
                  get: function () {
                    return e[n];
                  },
                }
          );
        }
      }),
    (t.default = e),
    Object.freeze(t)
  );
}
var l = o(t),
  s = i(t),
  d = o(a);
const c = l.default.createContext({}),
  u = t.createContext({});
function p(n) {
  const { store: r } = t.useContext(u),
    a = e.useCollector(r, n);
  return t.useMemo(() => ({ store: r, ...a }), [r, a]);
}
function h(r) {
  const { id: a, depth: o, connectors: i } = t.useContext(c),
    { actions: l, ...s } = p((e) => a && e.layers[a] && r && r(e.layers[a])),
    { children: d } = n.useEditor((e, t) => ({
      children: e.nodes[a] && t.node(a).descendants(),
    })),
    u = t.useMemo(
      () => ({
        toggleLayer: () => l.toggleLayer(a),
        setExpandedState: (e) => l.setExpandedState(a, e),
      }),
      [l, a]
    ),
    h = t.useMemo(
      () =>
        e.wrapConnectorHooks({
          layer: (e) => i.layer(e, a),
          drag: (e) => i.drag(e, a),
          layerHeader: (e) => i.layerHeader(e, a),
        }),
      [i, a]
    );
  return { id: a, depth: o, children: d, actions: u, connectors: h, ...s };
}
const f = () => {
    const { id: e, depth: r, children: a, expanded: o } = h((e) => ({
        expanded: e.expanded,
      })),
      { data: i, shouldBeExpanded: s } = n.useEditor((t, n) => {
        const r = n.getEvent('selected').first();
        return {
          data: t.nodes[e] && t.nodes[e].data,
          shouldBeExpanded: r && n.node(r).ancestors(!0).includes(e),
        };
      }),
      {
        actions: { registerLayer: d, toggleLayer: c },
        renderLayer: u,
        expandRootOnLoad: f,
      } = p((e) => ({
        renderLayer: e.options.renderLayer,
        expandRootOnLoad: e.options.expandRootOnLoad,
      })),
      [m, v] = t.useState(!1);
    t.useLayoutEffect(() => {
      d(e), v(!0);
    }, [d, e]);
    const y = t.useRef(o);
    y.current = o;
    const x = t.useRef(f && e === n.ROOT_NODE);
    return (
      t.useEffect(() => {
        !y.current && s && c(e);
      }, [c, e, s]),
      t.useEffect(() => {
        x.current && c(e);
      }, [c, e]),
      i && m
        ? l.default.createElement(
            'div',
            { className: `craft-layer-node ${e}` },
            l.default.createElement(
              u,
              {},
              a && o
                ? a.map((e) =>
                    l.default.createElement(g, { key: e, id: e, depth: r + 1 })
                  )
                : null
            )
          )
        : null
    );
  },
  m = t.createContext(null),
  g = ({ id: r, depth: a }) => {
    const o = t.useContext(m),
      { store: i } = t.useContext(u);
    t.useRef(i).current = i;
    const s = t.useMemo(() => o.createConnectorsUsage(), [o]),
      d = t.useMemo(() => e.wrapConnectorHooks(s.connectors), [s]);
    t.useEffect(
      () => (
        s.register(),
        () => {
          s.cleanup();
        }
      ),
      [s]
    );
    const { exists: p } = n.useEditor((e) => ({ exists: !!e.nodes[r] }));
    return p
      ? l.default.createElement(
          c.Provider,
          { value: { id: r, depth: a, connectors: d } },
          l.default.createElement(f, null)
        )
      : null;
  },
  v = (e) => ({
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
function y(e, t, n) {
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
function x(e, t) {
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
function b(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = null != arguments[t] ? arguments[t] : {};
    t % 2
      ? x(Object(n), !0).forEach(function (t) {
          y(e, t, n[t]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
      : x(Object(n)).forEach(function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
        });
  }
  return e;
}
class E extends n.DerivedCoreEventHandlers {
  constructor() {
    super(...arguments),
      y(this, 'autoScrollInterval', null),
      y(this, 'AUTO_SCROLL_THRESHOLD', 50),
      y(this, 'AUTO_SCROLL_SPEED', 5);
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
            const { indicator: o, currentCanvasHovered: i } = E.events;
            if (i && o) {
              const n = this.getLayer(i.id).headingDom.getBoundingClientRect();
              if (r.clientY > n.top + 20 && r.clientY < n.bottom - 20) {
                const n = i.data.nodes[i.data.nodes.length - 1];
                if (!n)
                  return void (E.events.indicator = b(
                    b({}, o),
                    {},
                    {
                      placement: b(
                        b({}, o.placement),
                        {},
                        { index: 0, where: 'before', parent: i }
                      ),
                      onCanvas: !0,
                    }
                  ));
                (E.events.indicator = b(
                  b({}, o),
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
                  t.actions.setIndicator(E.events.indicator);
              }
            }
          }),
          s = this.addCraftEventListener(n, 'dragenter', (n) => {
            n.craft.stopPropagation(), n.preventDefault();
            const a = E.draggedElement;
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
                ((E.events.currentCanvasHovered = null),
                e.query.node(r.id).isCanvas() && r.data.parent)
              ) {
                const t = e.query.node(r.data.parent).get();
                e.query.node(t.id).isCanvas() &&
                  ((E.events.currentCanvasHovered = r),
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
              (E.events.indicator = b(b({}, o), {}, { onCanvas: !1 })),
                t.actions.setIndicator(E.events.indicator);
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
            e.craft.stopPropagation(), (E.draggedElement = r);
          }),
          o = this.addCraftEventListener(n, 'dragend', (n) => {
            n.craft.stopPropagation(), this.stopAutoScroll();
            const r = E.events;
            if (r.indicator && !r.indicator.error) {
              const { placement: t } = r.indicator,
                { parent: n, index: a, where: o } = t,
                { id: i } = n;
              e.actions.move(E.draggedElement, i, a + ('after' === o ? 1 : 0));
            }
            (E.draggedElement = null),
              (E.events.indicator = null),
              t.actions.setIndicator(null);
          });
        return () => {
          n.removeAttribute('draggable'), a(), o();
        };
      },
    };
  }
}
y(E, 'draggedElement', void 0),
  y(E, 'events', { indicator: null, currentCanvasHovered: null });
const w = r.keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`,
  C = r.styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  box-shadow: ${(e) =>
    e.$error
      ? '0 0 8px rgba(239, 68, 68, 0.6)'
      : '0 0 8px rgba(59, 130, 246, 0.6)'};
  animation: ${w} 1.5s ease-in-out infinite;
`,
  $ = ({ children: e }) => {
    const { layers: r, events: a } = p((e) => e),
      { query: o } = n.useEditor((e) => ({ enabled: e.options.enabled })),
      { indicator: i } = o.getOptions(),
      s = t.useMemo(() => {
        const { indicator: e } = a;
        if (e) {
          const {
              placement: { where: t, parent: n, currentNode: a },
              error: o,
            } = e,
            l = a ? a.id : n.id;
          let s;
          const d = o ? i.error : i.success;
          if (e.onCanvas && null != r[n.id].dom) {
            const e = r[n.id].dom.getBoundingClientRect(),
              t = r[n.id].headingDom.getBoundingClientRect();
            return {
              top: t.top,
              left: e.left,
              width: e.width,
              height: t.height,
              background: 'transparent',
              borderWidth: '1px',
              borderColor: d,
            };
          }
          {
            if (!r[l]) return;
            const e = r[l].headingDom.getBoundingClientRect(),
              n = r[l].dom.getBoundingClientRect();
            return (
              (s = 'after' !== t && a ? n.top : n.top + n.height),
              {
                top: s,
                left: e.left,
                width: n.width + n.left - e.left,
                height: 4,
                borderWidth: 0,
                background: d,
              }
            );
          }
        }
      }, [a, i.error, i.success, r]);
    return l.default.createElement(
      'div',
      null,
      a.indicator
        ? l.default.createElement(C, { $error: !!a.indicator.error, style: s })
        : null,
      e
    );
  },
  O = ({ children: e }) => {
    const { store: r } = p(),
      a = n.useEventHandler(),
      o = t.useMemo(() => a.derive(E, { layerStore: r }), [a, r]);
    return l.default.createElement(
      m.Provider,
      { value: o },
      l.default.createElement($, null),
      e
    );
  },
  L = () => {
    const { id: e } = h(),
      { displayName: r, actions: a } = n.useEditor((t) => ({
        displayName:
          t.nodes[e] && t.nodes[e].data.custom.displayName
            ? t.nodes[e].data.custom.displayName
            : t.nodes[e].data.displayName,
        hidden: t.nodes[e] && t.nodes[e].data.hidden,
      })),
      [o, i] = t.useState(!1),
      s = t.useRef(null),
      c = t.useCallback((e) => {
        s.current && !s.current.contains(e.target) && i(!1);
      }, []);
    return (
      t.useEffect(
        () => () => {
          window.removeEventListener('click', c);
        },
        [c]
      ),
      l.default.createElement(d.default, {
        html: r,
        disabled: !o,
        ref: (e) => {
          e &&
            ((s.current = e.el.current),
            window.removeEventListener('click', c),
            window.addEventListener('click', c));
        },
        onChange: (t) => {
          a.setCustom(e, (e) => (e.displayName = t.target.value));
        },
        tagName: 'h2',
        onDoubleClick: () => {
          o || i(!0);
        },
      })
    );
  };
var S;
function H() {
  return (
    (H = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}.hasOwnProperty.call(n, r) && (e[r] = n[r]));
          }
          return e;
        }),
    H.apply(null, arguments)
  );
}
var P,
  M,
  j = function (e) {
    return s.createElement(
      'svg',
      H({ xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 10 6' }, e),
      S ||
        (S = s.createElement('path', {
          d:
            'M9.99 1.01A1 1 0 0 0 8.283.303L5 3.586 1.717.303A1 1 0 1 0 .303 1.717l3.99 3.98a1 1 0 0 0 1.414 0l3.99-3.98a.997.997 0 0 0 .293-.707Z',
        }))
    );
  };
function _() {
  return (
    (_ = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}.hasOwnProperty.call(n, r) && (e[r] = n[r]));
          }
          return e;
        }),
    _.apply(null, arguments)
  );
}
var D,
  R,
  k,
  T,
  A,
  N,
  I = function (e) {
    return s.createElement(
      'svg',
      _(
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          width: 16,
          height: 16,
        },
        e
      ),
      P || (P = s.createElement('path', { fill: 'none', d: 'M0 0h24v24H0z' })),
      M ||
        (M = s.createElement('path', {
          d:
            'M1.181 12C2.121 6.88 6.608 3 12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
        }))
    );
  };
function B() {
  return (
    (B = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}.hasOwnProperty.call(n, r) && (e[r] = n[r]));
          }
          return e;
        }),
    B.apply(null, arguments)
  );
}
var q,
  z,
  F = function (e) {
    return s.createElement(
      'svg',
      B(
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: 16,
          height: 16,
          fill: 'currentColor',
        },
        e
      ),
      D || (D = s.createElement('circle', { cx: 6, cy: 4, r: 1.5 })),
      R || (R = s.createElement('circle', { cx: 10, cy: 4, r: 1.5 })),
      k || (k = s.createElement('circle', { cx: 6, cy: 8, r: 1.5 })),
      T || (T = s.createElement('circle', { cx: 10, cy: 8, r: 1.5 })),
      A || (A = s.createElement('circle', { cx: 6, cy: 12, r: 1.5 })),
      N || (N = s.createElement('circle', { cx: 10, cy: 12, r: 1.5 }))
    );
  };
function U() {
  return (
    (U = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}.hasOwnProperty.call(n, r) && (e[r] = n[r]));
          }
          return e;
        }),
    U.apply(null, arguments)
  );
}
var Y = function (e) {
  return s.createElement(
    'svg',
    U({ xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 18 18' }, e),
    q ||
      (q = s.createElement('path', {
        className: 'linked_svg__a',
        d:
          'M16.5 9h-1a.5.5 0 0 0-.5.5V15H3V3h5.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5Z',
      })),
    z ||
      (z = s.createElement('path', {
        className: 'linked_svg__a',
        d:
          'M16.75 1h-5.373a.4.4 0 0 0-.377.4.392.392 0 0 0 .117.28l1.893 1.895-3.52 3.521a.5.5 0 0 0 0 .707l.706.708a.5.5 0 0 0 .708 0l3.521-3.521 1.893 1.892A.39.39 0 0 0 16.6 7a.4.4 0 0 0 .4-.377V1.25a.25.25 0 0 0-.25-.25Z',
      }))
  );
};
const J = {
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
  V = {
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
  Z = (e) => ('dark' === e ? V : J),
  W = t.createContext(null),
  X = ({ theme: e, themeMode: n, children: r }) => {
    const a = t.useMemo(() => ({ theme: e || Z(n) }), [e, n]);
    return l.default.createElement(W.Provider, { value: a }, r);
  },
  G = () => {
    const e = t.useContext(W);
    return e ? e.theme : Z('light');
  },
  K = r.styled.div`
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
  Q = r.styled.a`
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
  ee = r.styled.a`
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
  te = r.styled.div`
  margin-left: -22px;
  margin-right: 10px;

  svg {
    width: 12px;
    height: 12px;
  }
`,
  ne = r.styled.div`
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
  re = r.styled.div`
  display: flex;
  gap: 2px;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
`,
  ae = r.styled.button`
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
  oe = () => {
    const e = G(),
      {
        id: t,
        depth: r,
        expanded: a,
        children: o,
        connectors: { drag: i, layerHeader: s },
        actions: { toggleLayer: d },
      } = h((e) => ({ expanded: e.expanded })),
      {
        hidden: c,
        actions: u,
        selected: p,
        topLevel: f,
        parent: m,
        currentIndex: g,
        canMoveUp: v,
        canMoveDown: y,
      } = n.useEditor((e, n) => {
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
      [x, b] = l.default.useState(!1);
    return l.default.createElement(
      K,
      {
        $selected: p,
        $depth: r,
        $theme: e,
        onMouseEnter: () => b(!0),
        onMouseLeave: () => b(!1),
      },
      l.default.createElement(
        ne,
        {
          ref: (e) => {
            i(e);
          },
          $theme: e,
        },
        l.default.createElement(F, null)
      ),
      l.default.createElement(
        ee,
        {
          $selected: p,
          $isHidden: c,
          $theme: e,
          onClick: () => u.setHidden(t, !c),
        },
        l.default.createElement(I, null)
      ),
      l.default.createElement(
        'div',
        { className: 'inner' },
        l.default.createElement(
          'div',
          {
            ref: (e) => {
              s(e);
            },
          },
          f
            ? l.default.createElement(
                te,
                null,
                l.default.createElement(Y, null)
              )
            : null,
          l.default.createElement(
            'div',
            { className: 'layer-name s' },
            l.default.createElement(L, null)
          ),
          l.default.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
            !f &&
              x &&
              l.default.createElement(
                re,
                { $theme: e, style: { opacity: x ? 1 : 0 } },
                l.default.createElement(
                  ae,
                  {
                    $theme: e,
                    $disabled: !v,
                    onClick: (e) => {
                      e.stopPropagation(), v && m && u.move(t, m.id, g - 1);
                    },
                    title: 'Move up',
                  },
                  l.default.createElement(
                    'svg',
                    { viewBox: '0 0 16 16', fill: 'currentColor' },
                    l.default.createElement('path', { d: 'M8 3l-5 5h10z' })
                  )
                ),
                l.default.createElement(
                  ae,
                  {
                    $theme: e,
                    $disabled: !y,
                    onClick: (e) => {
                      e.stopPropagation(), y && m && u.move(t, m.id, g + 2);
                    },
                    title: 'Move down',
                  },
                  l.default.createElement(
                    'svg',
                    { viewBox: '0 0 16 16', fill: 'currentColor' },
                    l.default.createElement('path', { d: 'M8 13l5-5H3z' })
                  )
                )
              ),
            o && o.length
              ? l.default.createElement(
                  Q,
                  { $expanded: a, onMouseDown: () => d() },
                  l.default.createElement(j, null)
                )
              : null
          )
        )
      )
    );
  },
  ie = r.styled.div`
  background: ${(e) => (e.$hovered ? e.$theme.bgHover : e.$theme.bgBase)};
  display: block;
  padding-bottom: ${(e) => (e.$hasCanvases && e.$expanded ? 5 : 0)}px;
`,
  le = r.styled.div`
  margin: 0 0 0 ${(e) => (e.$hasCanvases ? 28 : 0)}px;
  background: ${(e) => (e.$hasCanvases ? e.$theme.bgCanvas : 'transparent')};
  position: relative;

  ${(e) =>
    e.$hasCanvases
      ? `\n\n  box-shadow: 0px 0px 44px -1px ${e.$theme.shadowColor};\n  border-radius: 10px;\n  margin-right: 5px;\n  margin-bottom:5px;\n  margin-top:5px;\n  > * { overflow:hidden; }\n    &:before {\n      position:absolute;\n      left:-19px;\n      width: 2px;\n      height:100%;\n      content: " ";\n      background:${e.$theme.borderColor};\n    }\n  `
      : ''}
`,
  se = ({ children: e }) => {
    const t = G(),
      {
        id: r,
        expanded: a,
        hovered: o,
        connectors: { layer: i },
      } = h((e) => ({ hovered: e.event.hovered, expanded: e.expanded })),
      { hasChildCanvases: s } = n.useEditor((e, t) => ({
        hasChildCanvases: t.node(r).isParentOfTopLevelNodes(),
      }));
    return l.default.createElement(
      ie,
      {
        ref: (e) => {
          i(e);
        },
        $expanded: a,
        $hasCanvases: s,
        $hovered: o,
        $theme: t,
      },
      l.default.createElement(oe, null),
      e
        ? l.default.createElement(
            le,
            { $hasCanvases: s, $theme: t, className: 'craft-layer-children' },
            e
          )
        : null
    );
  },
  de = ({ children: t, options: n }) => {
    const r = e.useMethods(v, {
      layers: {},
      events: { selected: null, dragged: null, hovered: null },
      options: { renderLayer: se, ...n },
    });
    return l.default.createElement(
      u.Provider,
      { value: { store: r } },
      l.default.createElement(
        X,
        { theme: n.theme, themeMode: n.themeMode },
        l.default.createElement(O, null, t)
      )
    );
  };
(exports.DefaultLayer = se),
  (exports.DefaultLayerHeader = oe),
  (exports.EditableLayerName = L),
  (exports.Layers = ({ ...t }) =>
    l.default.createElement(
      'div',
      {
        className: 'craft-layers-container',
        style: { height: '100%', overflow: 'auto' },
      },
      l.default.createElement(
        de,
        { options: t },
        l.default.createElement(g, { id: e.ROOT_NODE, depth: 0 })
      )
    )),
  (exports.darkTheme = V),
  (exports.getTheme = Z),
  (exports.lightTheme = J),
  (exports.useLayer = h);
//# sourceMappingURL=index.js.map
