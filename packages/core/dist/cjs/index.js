'use strict';
'undefined' != typeof window &&
  (window.__CRAFTJS__ || (window.__CRAFTJS__ = {}),
  (window.__CRAFTJS__['@craftjs/core'] = '0.2.12')),
  Object.defineProperty(exports, '__esModule', { value: !0 });
var e = require('@craftjs/utils'),
  t = require('react'),
  n = require('tiny-invariant'),
  o = require('lodash/isFunction'),
  r = require('lodash/cloneDeep');
function s(e) {
  return e && 'object' == typeof e && 'default' in e ? e : { default: e };
}
function d(e) {
  if (e && e.__esModule) return e;
  var t = Object.create(null);
  return (
    e &&
      Object.keys(e).forEach(function (n) {
        if ('default' !== n) {
          var o = Object.getOwnPropertyDescriptor(e, n);
          Object.defineProperty(
            t,
            n,
            o.get
              ? o
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
var a = s(t),
  i = d(t),
  l = s(n),
  c = s(o),
  u = s(r);
const p = a.default.createContext(null),
  h = ({ id: e, related: t = !1, children: n }) =>
    a.default.createElement(p.Provider, { value: { id: e, related: t } }, n);
function f(e, t, n) {
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
function g(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t &&
      (o = o.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable;
      })),
      n.push.apply(n, o);
  }
  return n;
}
function E(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = null != arguments[t] ? arguments[t] : {};
    t % 2
      ? g(Object(n), !0).forEach(function (t) {
          f(e, t, n[t]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
      : g(Object(n)).forEach(function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
        });
  }
  return e;
}
function m(e, t) {
  if (null == e) return {};
  var n,
    o,
    r = (function (e, t) {
      if (null == e) return {};
      var n = {};
      for (var o in e)
        if ({}.hasOwnProperty.call(e, o)) {
          if (-1 !== t.indexOf(o)) continue;
          n[o] = e[o];
        }
      return n;
    })(e, t);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (o = 0; o < s.length; o++)
      -1 === t.indexOf((n = s[o])) &&
        {}.propertyIsEnumerable.call(e, n) &&
        (r[n] = e[n]);
  }
  return r;
}
const v = t.createContext(null),
  y = t.createContext(null),
  N = () => t.useContext(y);
function O(n) {
  const o = N(),
    r = t.useContext(v);
  l.default(r, e.ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT);
  const s = e.useCollector(r, n),
    d = t.useMemo(() => o && o.createConnectorsUsage(), [o]);
  t.useEffect(
    () => (
      d.register(),
      () => {
        d.cleanup();
      }
    ),
    [d]
  );
  const a = t.useMemo(() => d && e.wrapConnectorHooks(d.connectors), [d]);
  return E(E({}, s), {}, { connectors: a, inContext: !!r, store: r });
}
const R = ['actions', 'query', 'connectors'];
function b(n) {
  const o = t.useContext(p);
  l.default(o, e.ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT);
  const { id: r, related: s } = o,
    d = O((e) => r && e.nodes[r] && n && n(e.nodes[r])),
    { actions: a, connectors: i } = d,
    c = m(d, R),
    u = t.useMemo(
      () =>
        e.wrapConnectorHooks({
          connect: (e) => i.connect(e, r),
          drag: (e) => i.drag(e, r),
        }),
      [i, r]
    ),
    h = t.useMemo(
      () => ({
        setProp: (e, t) => {
          t ? a.history.throttle(t).setProp(r, e) : a.setProp(r, e);
        },
        setCustom: (e, t) => {
          t ? a.history.throttle(t).setCustom(r, e) : a.setCustom(r, e);
        },
        setHidden: (e) => a.setHidden(r, e),
      }),
      [a, r]
    );
  return E(
    E({}, c),
    {},
    { id: r, related: s, inNodeContext: !!o, actions: h, connectors: u }
  );
}
const T = ['id', 'related', 'actions', 'inNodeContext', 'connectors'];
function _(t) {
  const n = b(t),
    { id: o, related: r, actions: s, inNodeContext: d, connectors: a } = n;
  return E(
    E({}, m(n, T)),
    {},
    {
      actions: s,
      id: o,
      related: r,
      setProp: (t, n) => (
        e.deprecationWarning('useNode().setProp()', {
          suggest: 'useNode().actions.setProp()',
        }),
        s.setProp(t, n)
      ),
      inNodeContext: d,
      connectors: a,
    }
  );
}
const D = ({ render: e }) => {
    const {
      connectors: { connect: t, drag: n },
    } = _();
    return 'string' == typeof e.type ? t(n(a.default.cloneElement(e))) : e;
  },
  C = () => {
    const { type: e, props: n, nodes: o, hydrationTimestamp: r } = b((e) => ({
      type: e.data.type,
      props: e.data.props,
      nodes: e.data.nodes,
      hydrationTimestamp: e._hydrationTimestamp,
    }));
    return t.useMemo(() => {
      let t = n.children;
      o &&
        o.length > 0 &&
        (t = a.default.createElement(
          a.default.Fragment,
          null,
          o.map((e) => a.default.createElement(S, { id: e, key: e }))
        ));
      const r = a.default.createElement(e, n, t);
      return 'string' == typeof e
        ? a.default.createElement(D, { render: r })
        : r;
    }, [e, n, r, o]);
  },
  x = ({ render: e }) => {
    const { hidden: t } = b((e) => ({ hidden: e.data.hidden })),
      { onRender: n } = O((e) => ({ onRender: e.options.onRender }));
    return t
      ? null
      : a.default.createElement(n, {
          render: e || a.default.createElement(C, null),
        });
  },
  S = ({ id: e, render: t }) =>
    a.default.createElement(
      h,
      { id: e },
      a.default.createElement(x, { render: t })
    ),
  I = { is: 'div', canvas: !1, custom: {}, hidden: !1 },
  w = { is: 'type', canvas: 'isCanvas' };
function k({ id: n, children: o, ...r }) {
  const { is: s } = { ...I, ...r },
    { query: d, actions: i } = O(),
    { id: c, inNodeContext: u } = b(),
    [p] = t.useState(() => {
      l.default(!!n, e.ERROR_TOP_LEVEL_ELEMENT_NO_ID);
      const t = d.node(c).get();
      if (u) {
        const e = t.data.linkedNodes[n]
          ? d.node(t.data.linkedNodes[n]).get()
          : null;
        if (e && e.data.type === s) return e.id;
        const l = a.default.createElement(k, r, o),
          u = d.parseReactElement(l).toNodeTree();
        return i.history.ignore().addLinkedNodeFromTree(u, c, n), u.rootNodeId;
      }
      return null;
    });
  return p ? a.default.createElement(S, { id: p }) : null;
}
const L = () =>
  e.deprecationWarning('<Canvas />', { suggest: '<Element canvas={true} />' });
function Canvas({ ...e }) {
  return (
    t.useEffect(() => L(), []), a.default.createElement(k, { ...e, canvas: !0 })
  );
}
const P = () => {
  const { timestamp: t } = O((t) => ({
    timestamp: t.nodes[e.ROOT_NODE] && t.nodes[e.ROOT_NODE]._hydrationTimestamp,
  }));
  return t ? a.default.createElement(S, { id: e.ROOT_NODE, key: t }) : null;
};
var M;
(exports.NodeSelectorType = void 0),
  ((M = exports.NodeSelectorType || (exports.NodeSelectorType = {}))[
    (M.Any = 0)
  ] = 'Any'),
  (M[(M.Id = 1)] = 'Id'),
  (M[(M.Obj = 2)] = 'Obj');
const j = (e) => {
  const {
    addLinkedNodeFromTree: t,
    setDOM: n,
    setNodeEvent: o,
    replaceNodes: r,
    reset: s,
    ...d
  } = e;
  return d;
};
function A(e) {
  const { connectors: n, actions: o, query: r, store: s, ...d } = O(e),
    a = j(o);
  return {
    connectors: n,
    actions: t.useMemo(
      () => ({
        ...a,
        history: {
          ...a.history,
          ignore: (...e) => j(a.history.ignore(...e)),
          throttle: (...e) => j(a.history.throttle(...e)),
        },
      }),
      [a]
    ),
    query: r,
    store: s,
    ...d,
  };
}
const q = (e) =>
    Object.fromEntries
      ? Object.fromEntries(e)
      : e.reduce((e, t) => {
          let [n, o] = t;
          return E(E({}, e), {}, { [n]: o });
        }, {}),
  H = (t, n, o) => {
    const r = Array.isArray(n) ? n : [n],
      s = E({ existOnly: !1, idOnly: !1 }, o || {}),
      d = r
        .filter((e) => !!e)
        .map((e) =>
          'string' == typeof e
            ? { node: t[e], exists: !!t[e] }
            : 'object' != typeof e || s.idOnly
            ? { node: null, exists: !1 }
            : { node: e, exists: !!t[e.id] }
        );
    return (
      s.existOnly &&
        l.default(
          0 === d.filter((e) => !e.exists).length,
          e.ERROR_INVALID_NODEID
        ),
      d
    );
  },
  F = ['history'],
  V = (t, n) => {
    const o = (n, o, s) => {
        const d = (o, r) => {
          const s = n.nodes[o];
          'string' != typeof s.data.type &&
            l.default(
              t.options.resolver[s.data.name],
              e.ERROR_NOT_IN_RESOLVER.replace(
                '%node_type%',
                ''.concat(s.data.type.name)
              )
            ),
            (t.nodes[o] = E(
              E({}, s),
              {},
              { data: E(E({}, s.data), {}, { parent: r }) }
            )),
            s.data.nodes.length > 0 &&
              (delete t.nodes[o].data.props.children,
              s.data.nodes.forEach((e) => d(e, s.id))),
            Object.values(s.data.linkedNodes).forEach((e) => d(e, s.id));
        };
        if ((d(n.rootNodeId, o), !o && n.rootNodeId === e.ROOT_NODE)) return;
        const a = r(o);
        if ('child' === s.type) {
          const e = s.index;
          return void (null != e
            ? a.data.nodes.splice(e, 0, n.rootNodeId)
            : a.data.nodes.push(n.rootNodeId));
        }
        a.data.linkedNodes[s.id] = n.rootNodeId;
      },
      r = (n) => {
        l.default(n, e.ERROR_NOPARENT);
        const o = t.nodes[n];
        return l.default(o, e.ERROR_INVALID_NODEID), o;
      },
      s = (e) => {
        const n = t.nodes[e],
          o = t.nodes[n.data.parent];
        if (
          (n.data.nodes && [...n.data.nodes].forEach((e) => s(e)),
          n.data.linkedNodes &&
            Object.values(n.data.linkedNodes).map((e) => s(e)),
          o.data.nodes.includes(e))
        ) {
          const t = o.data.nodes;
          t.splice(t.indexOf(e), 1);
        } else {
          const e = Object.keys(o.data.linkedNodes).find(
            (e) => o.data.linkedNodes[e] === e
          );
          e && delete o.data.linkedNodes[e];
        }
        ((e, t) => {
          Object.keys(e.events).forEach((n) => {
            const o = e.events[n];
            o &&
              o.has &&
              o.has(t) &&
              (e.events[n] = new Set(Array.from(o).filter((e) => t !== e)));
          });
        })(t, e),
          delete t.nodes[e];
      };
    return {
      addLinkedNodeFromTree(e, t, n) {
        const d = r(t).data.linkedNodes[n];
        d && s(d), o(e, t, { type: 'linked', id: n });
      },
      add(t, n, r) {
        let s = [t];
        Array.isArray(t) &&
          (e.deprecationWarning('actions.add(node: Node[])', {
            suggest: 'actions.add(node: Node)',
          }),
          (s = t)),
          s.forEach((e) => {
            o({ nodes: { [e.id]: e }, rootNodeId: e.id }, n, {
              type: 'child',
              index: r,
            });
          });
      },
      addNodeTree(e, t, n) {
        o(e, t, { type: 'child', index: n });
      },
      delete(o) {
        H(t.nodes, o, { existOnly: !0, idOnly: !0 }).forEach((t) => {
          let { node: o } = t;
          l.default(
            !n.node(o.id).isTopLevelNode(),
            e.ERROR_DELETE_TOP_LEVEL_NODE
          ),
            s(o.id);
        });
      },
      deserialize(t) {
        const o = 'string' == typeof t ? JSON.parse(t) : t,
          r = Object.keys(o).map((t) => {
            let r = t;
            return (
              t === e.DEPRECATED_ROOT_NODE && (r = e.ROOT_NODE),
              [r, n.parseSerializedNode(o[t]).toNode((e) => (e.id = r))]
            );
          });
        this.replaceNodes(q(r));
      },
      move(e, o, r) {
        const s = H(t.nodes, e, { existOnly: !0 }),
          d = t.nodes[o],
          a = new Set();
        s.forEach((e, s) => {
          let { node: i } = e;
          const l = i.id,
            c = i.data.parent;
          n.node(o).isDroppable([l], (e) => {
            throw new Error(e);
          }),
            t.options.onBeforeMoveEnd(i, d, t.nodes[c]);
          const u = t.nodes[c].data.nodes;
          a.add(u);
          const p = u.indexOf(l);
          (u[p] = '$$'),
            d.data.nodes.splice(r + s, 0, l),
            (t.nodes[l].data.parent = o);
        }),
          a.forEach((e) => {
            const t = e.length;
            [...e].reverse().forEach((n, o) => {
              '$$' === n && e.splice(t - 1 - o, 1);
            });
          });
      },
      replaceNodes(e) {
        this.clearEvents(), (t.nodes = e);
      },
      clearEvents() {
        this.setNodeEvent('selected', null),
          this.setNodeEvent('hovered', null),
          this.setNodeEvent('dragged', null),
          this.setIndicator(null);
      },
      reset() {
        this.clearEvents(), this.replaceNodes({});
      },
      setOptions(e) {
        e(t.options);
      },
      setNodeEvent(e, n) {
        if (
          (t.events[e].forEach((n) => {
            t.nodes[n] && (t.nodes[n].events[e] = !1);
          }),
          (t.events[e] = new Set()),
          !n)
        )
          return;
        const o = H(t.nodes, n, { idOnly: !0, existOnly: !0 }),
          r = new Set(
            o.map((e) => {
              let { node: t } = e;
              return t.id;
            })
          );
        r.forEach((n) => {
          t.nodes[n].events[e] = !0;
        }),
          (t.events[e] = r);
      },
      setCustom(e, n) {
        H(t.nodes, e, { idOnly: !0, existOnly: !0 }).forEach((e) => {
          let { node: o } = e;
          return n(t.nodes[o.id].data.custom);
        });
      },
      setDOM(e, n) {
        t.nodes[e] && (t.nodes[e].dom = n);
      },
      setIndicator(e) {
        (e &&
          (!e.placement.parent.dom ||
            (e.placement.currentNode && !e.placement.currentNode.dom))) ||
          (t.indicator = e);
      },
      setSnapGuides(e) {
        t.snapGuides = e || [];
      },
      setHidden(e, n) {
        t.nodes[e].data.hidden = n;
      },
      setProp(e, n) {
        H(t.nodes, e, { idOnly: !0, existOnly: !0 }).forEach((e) => {
          let { node: o } = e;
          return n(t.nodes[o.id].data.props);
        });
      },
      selectNode(e) {
        if (e) {
          const n = H(t.nodes, e, { idOnly: !0, existOnly: !0 });
          this.setNodeEvent(
            'selected',
            n.map((e) => {
              let { node: t } = e;
              return t.id;
            })
          );
        } else this.setNodeEvent('selected', null);
        this.setNodeEvent('hovered', null);
      },
    };
  };
let z = null;
const B = (t, n) => {
    if ('string' == typeof n) return n;
    const o = ((e, t) => {
      const n = ((e) => {
        if (z && z.resolver === e) return z.reversed;
        z = { resolver: e, reversed: new Map() };
        for (const [t, n] of Object.entries(e)) z.reversed.set(n, t);
        return z.reversed;
      })(e).get(t);
      return void 0 !== n ? n : null;
    })(t, n);
    var r;
    return (
      l.default(
        o,
        e.ERROR_NOT_IN_RESOLVER.replace(
          '%node_type%',
          (r = n).name || r.displayName
        )
      ),
      o
    );
  },
  G = (e, t) => ('string' == typeof e ? e : { resolvedName: B(t, e) }),
  W = (e, n) => {
    let { type: o, isCanvas: r, props: s } = e;
    return (
      (s = Object.keys(s).reduce((e, o) => {
        const r = s[o];
        return (
          null == r ||
            'function' == typeof r ||
            (e[o] =
              'children' === o && 'string' != typeof r
                ? t.Children.map(r, (e) => ('string' == typeof e ? e : W(e, n)))
                : 'function' == typeof r.type
                ? W(r, n)
                : r),
          e
        );
      }, {})),
      { type: G(o, n), isCanvas: !!r, props: s }
    );
  },
  $ = (e, t) => {
    const { type: n, props: o, isCanvas: r, name: s, ...d } = e;
    return { ...W({ type: n, isCanvas: r, props: o }, t), ...d };
  };
function U(t, n) {
  l.default('string' == typeof n, e.ERROR_INVALID_NODE_ID);
  const o = t.nodes[n],
    r = (e) => U(t, e);
  return {
    isCanvas: () => !!o.data.isCanvas,
    isRoot: () => o.id === e.ROOT_NODE,
    isLinkedNode: () =>
      o.data.parent && r(o.data.parent).linkedNodes().includes(o.id),
    isTopLevelNode() {
      return this.isRoot() || this.isLinkedNode();
    },
    isDeletable() {
      return !this.isTopLevelNode();
    },
    isParentOfTopLevelNodes: () =>
      o.data.linkedNodes && Object.keys(o.data.linkedNodes).length > 0,
    isParentOfTopLevelCanvas() {
      return (
        e.deprecationWarning('query.node(id).isParentOfTopLevelCanvas', {
          suggest: 'query.node(id).isParentOfTopLevelNodes',
        }),
        this.isParentOfTopLevelNodes()
      );
    },
    isSelected: () => t.events.selected.has(n),
    isHovered: () => t.events.hovered.has(n),
    isDragged: () => t.events.dragged.has(n),
    get: () => o,
    ancestors() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return (function n(o) {
        let r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
          s =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        const d = t.nodes[o];
        return d
          ? (r.push(o),
            d.data.parent
              ? ((e || (!e && 0 === s)) && (r = n(d.data.parent, r, s + 1)), r)
              : r)
          : r;
      })(o.data.parent);
    },
    descendants() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
        o = arguments.length > 1 ? arguments[1] : void 0;
      return (function n(s) {
        let d =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
          a =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        return (e || (!e && 0 === a)) && t.nodes[s]
          ? ('childNodes' !== o &&
              r(s)
                .linkedNodes()
                .forEach((e) => {
                  d.push(e), (d = n(e, d, a + 1));
                }),
            'linkedNodes' !== o &&
              r(s)
                .childNodes()
                .forEach((e) => {
                  d.push(e), (d = n(e, d, a + 1));
                }),
            d)
          : d;
      })(n);
    },
    linkedNodes: () => Object.values(o.data.linkedNodes || {}),
    childNodes: () => o.data.nodes || [],
    isDraggable(n) {
      try {
        const n = o;
        return (
          l.default(!this.isTopLevelNode(), e.ERROR_MOVE_TOP_LEVEL_NODE),
          l.default(
            U(t, n.data.parent).isCanvas(),
            e.ERROR_MOVE_NONCANVAS_CHILD
          ),
          l.default(n.rules.canDrag(n, r), e.ERROR_CANNOT_DRAG),
          !0
        );
      } catch (e) {
        return n && n(e), !1;
      }
    },
    isDroppable(n, s) {
      const d = H(t.nodes, n),
        a = o;
      try {
        l.default(this.isCanvas(), e.ERROR_MOVE_TO_NONCANVAS_PARENT),
          l.default(
            a.rules.canMoveIn(
              d.map((e) => e.node),
              a,
              r
            ),
            e.ERROR_MOVE_INCOMING_PARENT
          );
        const n = {};
        return (
          d.forEach((o) => {
            let { node: s, exists: d } = o;
            if (
              (l.default(s.rules.canDrop(a, s, r), e.ERROR_MOVE_CANNOT_DROP),
              !d)
            )
              return;
            l.default(!r(s.id).isTopLevelNode(), e.ERROR_MOVE_TOP_LEVEL_NODE);
            const i = r(s.id).descendants(!0);
            l.default(
              !i.includes(a.id) && a.id !== s.id,
              e.ERROR_MOVE_TO_DESCENDANT
            );
            const c = s.data.parent && t.nodes[s.data.parent];
            l.default(c.data.isCanvas, e.ERROR_MOVE_NONCANVAS_CHILD),
              l.default(c || (!c && !t.nodes[s.id]), e.ERROR_DUPLICATE_NODEID),
              c.id !== a.id && (n[c.id] || (n[c.id] = []), n[c.id].push(s));
          }),
          Object.keys(n).forEach((o) => {
            const s = t.nodes[o];
            l.default(
              s.rules.canMoveOut(n[o], s, r),
              e.ERROR_MOVE_OUTGOING_PARENT
            );
          }),
          !0
        );
      } catch (e) {
        return s && s(e), !1;
      }
    },
    toSerializedNode: () => $(o.data, t.options.resolver),
    toNodeTree(e) {
      const t = [n, ...this.descendants(!0, e)].reduce(
        (e, t) => ((e[t] = r(t).get()), e),
        {}
      );
      return { rootNodeId: n, nodes: t };
    },
    decendants() {
      let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return (
        e.deprecationWarning('query.node(id).decendants', {
          suggest: 'query.node(id).descendants',
        }),
        this.descendants(t)
      );
    },
    isTopLevelCanvas() {
      return !this.isRoot() && !o.data.parent;
    },
  };
}
function J(e, t, n, o) {
  let r = { parent: e, index: 0, where: 'before' },
    s = 0,
    d = 0,
    a = 0,
    i = 0,
    l = 0,
    c = 0,
    u = 0;
  for (let e = 0, p = t.length; e < p; e++) {
    const p = t[e];
    if (
      ((a = p.left + p.outerWidth),
      (u = p.top + p.outerHeight),
      (l = p.left + p.outerWidth / 2),
      (c = p.top + p.outerHeight / 2),
      !((d && p.left > d) || (i && c >= i) || (s && a < s)))
    )
      if (((r.index = e), p.inFlow)) {
        if (o < c) {
          r.where = 'before';
          break;
        }
        r.where = 'after';
      } else
        o < u && (i = u),
          n < l
            ? ((d = l), (r.where = 'before'))
            : ((s = l), (r.where = 'after'));
  }
  return r;
}
const X = (e) => ('string' == typeof e ? e : e.name);
function Y(t, n) {
  let o = t.data.type;
  const r = {
    id: t.id || e.getRandomId(),
    _hydrationTimestamp: Date.now(),
    data: E(
      {
        type: o,
        name: X(o),
        displayName: X(o),
        props: {},
        custom: {},
        parent: null,
        isCanvas: !1,
        hidden: !1,
        nodes: [],
        linkedNodes: {},
      },
      t.data
    ),
    info: {},
    related: {},
    events: { selected: !1, dragged: !1, hovered: !1 },
    rules: {
      canDrag: () => !0,
      canDrop: () => !0,
      canMoveIn: () => !0,
      canMoveOut: () => !0,
    },
    dom: null,
  };
  if (r.data.type === k || r.data.type === Canvas) {
    const e = E(E({}, I), r.data.props);
    (r.data.props = Object.keys(r.data.props).reduce(
      (t, n) => (
        Object.keys(I).includes(n)
          ? (r.data[w[n] || n] = e[n])
          : (t[n] = r.data.props[n]),
        t
      ),
      {}
    )),
      (o = r.data.type),
      (r.data.name = X(o)),
      (r.data.displayName = X(o)),
      r.data.type === Canvas && ((r.data.isCanvas = !0), L());
  }
  n && n(r);
  const s = o.craft;
  if (s) {
    if (
      ((r.data.displayName = s.displayName || s.name || r.data.displayName),
      (r.data.props = E(E({}, s.props || s.defaultProps || {}), r.data.props)),
      (r.data.custom = E(E({}, s.custom || {}), r.data.custom)),
      null != s.isCanvas && (r.data.isCanvas = s.isCanvas),
      s.rules &&
        Object.keys(s.rules).forEach((e) => {
          ['canDrag', 'canDrop', 'canMoveIn', 'canMoveOut'].includes(e) &&
            (r.rules[e] = s.rules[e]);
        }),
      s.related)
    ) {
      const e = { id: r.id, related: !0 };
      Object.keys(s.related).forEach((t) => {
        r.related[t] = (n) =>
          a.default.createElement(
            h,
            e,
            a.default.createElement(s.related[t], n)
          );
      });
    }
    s.info && (r.info = s.info);
  }
  return r;
}
const K = (e, t, n) => {
    let { type: o, props: r } = e;
    const s = ((e, t) =>
      'object' == typeof e && e.resolvedName
        ? 'Canvas' === e.resolvedName
          ? Canvas
          : t[e.resolvedName]
        : 'string' == typeof e
        ? e
        : null)(o, t);
    if (!s) return;
    (r = Object.keys(r).reduce((e, n) => {
      const o = r[n];
      return (
        (e[n] =
          null == o
            ? null
            : 'object' == typeof o && o.resolvedName
            ? K(o, t)
            : 'children' === n && Array.isArray(o)
            ? o.map((e) => ('string' == typeof e ? e : K(e, t)))
            : o),
        e
      );
    }, {})),
      n && (r.key = n);
    const d = { ...a.default.createElement(s, { ...r }) };
    return { ...d, name: B(t, d.type) };
  },
  Q = (e, t) => {
    if (t.length < 1) return { [e.id]: e };
    const n = t.map(({ rootNodeId: e }) => e),
      o = { ...e, data: { ...e.data, nodes: n } };
    return t.reduce(
      (t, n) => {
        const o = n.nodes[n.rootNodeId];
        return {
          ...t,
          ...n.nodes,
          [o.id]: { ...o, data: { ...o.data, parent: e.id } },
        };
      },
      { [e.id]: o }
    );
  };
function Z(n) {
  const o = n && n.options,
    r = () => Z(n);
  return {
    getDropPlaceholder: (t, o, s, d = (e) => n.nodes[e.id].dom) => {
      const a = n.nodes[o],
        i = r().node(a.id).isCanvas() ? a : n.nodes[a.data.parent];
      if (!i) return;
      const l = i.data.nodes || [],
        c = J(
          i,
          l
            ? l.reduce((t, o) => {
                const r = d(n.nodes[o]);
                if (r) {
                  const n = { id: o, ...e.getDOMInfo(r) };
                  t.push(n);
                }
                return t;
              }, [])
            : [],
          s.x,
          s.y
        ),
        u = l.length && n.nodes[l[c.index]],
        p = { placement: { ...c, currentNode: u }, error: null };
      return (
        H(n.nodes, t).forEach(({ node: e, exists: t }) => {
          t &&
            r()
              .node(e.id)
              .isDraggable((e) => (p.error = e));
        }),
        r()
          .node(i.id)
          .isDroppable(t, (e) => (p.error = e)),
        p
      );
    },
    getOptions: () => o,
    getNodes: () => n.nodes,
    node: (e) => U(n, e),
    getSerializedNodes() {
      const e = Object.keys(n.nodes).map((e) => [
        e,
        this.node(e).toSerializedNode(),
      ]);
      return q(e);
    },
    getEvent: (e) =>
      (function (e, t) {
        const n = e.events[t];
        return {
          contains: (e) => n.has(e),
          isEmpty() {
            return 0 === this.all().length;
          },
          first() {
            return this.all()[0];
          },
          last() {
            const e = this.all();
            return e[e.length - 1];
          },
          all: () => Array.from(n),
          size() {
            return this.all().length;
          },
          at(e) {
            return this.all()[e];
          },
          raw: () => n,
        };
      })(n, e),
    serialize() {
      return JSON.stringify(this.getSerializedNodes());
    },
    parseReactElement: (e) => ({
      toNodeTree(o) {
        let s = (function (e, n) {
            let o = e;
            return (
              'string' == typeof o &&
                (o = a.default.createElement(t.Fragment, {}, o)),
              Y({ data: { type: o.type, props: { ...o.props } } }, (e) => {
                n && n(e, o);
              })
            );
          })(e, (e, t) => {
            const r = B(n.options.resolver, e.data.type);
            (e.data.displayName = e.data.displayName || r),
              (e.data.name = r),
              o && o(e, t);
          }),
          d = [];
        return (
          e.props &&
            e.props.children &&
            (d = a.default.Children.toArray(e.props.children).reduce(
              (e, t) => (
                a.default.isValidElement(t) &&
                  e.push(r().parseReactElement(t).toNodeTree(o)),
                e
              ),
              []
            )),
          ((e, t) => ({ rootNodeId: e.id, nodes: Q(e, t) }))(s, d)
        );
      },
    }),
    parseSerializedNode: (t) => ({
      toNode(o) {
        const s = ((t, n) => {
          const { type: o, props: r, ...s } = t;
          l.default(
            (void 0 !== o && 'string' == typeof o) ||
              (void 0 !== o && void 0 !== o.resolvedName),
            e.ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER.replace(
              '%displayName%',
              t.displayName
            ).replace('%availableComponents%', Object.keys(n).join(', '))
          );
          const { type: d, name: a, props: i } = K(t, n),
            {
              parent: c,
              custom: u,
              displayName: p,
              isCanvas: h,
              nodes: f,
              hidden: g,
            } = s;
          return {
            type: d,
            name: a,
            displayName: p || a,
            props: i,
            custom: u || {},
            isCanvas: !!h,
            hidden: !!g,
            parent: c,
            linkedNodes: s.linkedNodes || s._childCanvas || {},
            nodes: f || [],
          };
        })(t, n.options.resolver);
        l.default(s.type, e.ERROR_NOT_IN_RESOLVER);
        const d = 'string' == typeof o && o;
        return (
          d &&
            e.deprecationWarning('query.parseSerializedNode(...).toNode(id)', {
              suggest:
                'query.parseSerializedNode(...).toNode(node => node.id = id)',
            }),
          r()
            .parseFreshNode({ ...(d ? { id: d } : {}), data: s })
            .toNode(!d && o)
        );
      },
    }),
    parseFreshNode: (t) => ({
      toNode: (o) =>
        Y(t, (t) => {
          t.data.parent === e.DEPRECATED_ROOT_NODE &&
            (t.data.parent = e.ROOT_NODE);
          const r = B(n.options.resolver, t.data.type);
          l.default(null !== r, e.ERROR_NOT_IN_RESOLVER),
            (t.data.displayName = t.data.displayName || r),
            (t.data.name = r),
            o && o(t);
        }),
    }),
    createNode(t, n) {
      e.deprecationWarning(`query.createNode(${t})`, {
        suggest: `query.parseReactElement(${t}).toNodeTree()`,
      });
      const o = this.parseReactElement(t).toNodeTree(),
        r = o.nodes[o.rootNodeId];
      return n
        ? (n.id && (r.id = n.id),
          n.data && (r.data = { ...r.data, ...n.data }),
          r)
        : r;
    },
    getState: () => n,
  };
}
class ee extends e.EventHandlers {
  handlers() {
    return {
      connect: (e, t) => {},
      select: (e, t) => {},
      hover: (e, t) => {},
      drag: (e, t) => {},
      drop: (e, t) => {},
      create: (e, t, n) => {},
    };
  }
}
class te {
  constructor(e) {
    f(this, 'store', void 0),
      f(this, 'siblingDimensions', []),
      f(this, 'canvasBounds', null),
      (this.store = e);
  }
  setSiblings(t, n) {
    const o = this.store.query.node(t).get();
    o &&
      (o.dom && (this.canvasBounds = o.dom.getBoundingClientRect()),
      (this.siblingDimensions = o.data.nodes
        .filter((e) => !n.includes(e))
        .map((t) => {
          const n = this.store.query.node(t).get();
          return n && n.dom ? E({ id: t }, e.getDOMInfo(n.dom)) : null;
        })
        .filter(Boolean)));
  }
  calculate(e) {
    const t = [];
    let n = null,
      o = null;
    const r = e.left + e.width / 2,
      s = e.top + e.height / 2;
    for (const d of this.siblingDimensions) {
      const a = d.left + d.width / 2,
        i = d.top + d.height / 2;
      Math.abs(r - a) < te.SNAP_THRESHOLD &&
        ((n = a - e.width / 2),
        t.push({
          type: 'vertical',
          position: a,
          start: Math.min(e.top, d.top),
          end: Math.max(e.bottom, d.bottom),
        })),
        Math.abs(s - i) < te.SNAP_THRESHOLD &&
          ((o = i - e.height / 2),
          t.push({
            type: 'horizontal',
            position: i,
            start: Math.min(e.left, d.left),
            end: Math.max(e.right, d.right),
          }));
    }
    if (this.canvasBounds) {
      const d = this.canvasBounds.left + this.canvasBounds.width / 2,
        a = this.canvasBounds.top + this.canvasBounds.height / 2;
      Math.abs(r - d) < te.SNAP_THRESHOLD &&
        ((n = d - e.width / 2),
        t.push({
          type: 'vertical',
          position: d,
          start: this.canvasBounds.top,
          end: this.canvasBounds.bottom,
        })),
        Math.abs(s - a) < te.SNAP_THRESHOLD &&
          ((o = a - e.height / 2),
          t.push({
            type: 'horizontal',
            position: a,
            start: this.canvasBounds.left,
            end: this.canvasBounds.right,
          }));
    }
    return { guides: this.deduplicateGuides(t), snapX: n, snapY: o };
  }
  deduplicateGuides(e) {
    const t = new Map();
    for (const n of e) {
      const e = ''.concat(n.type, '-').concat(Math.round(n.position)),
        o = t.get(e);
      o
        ? ((o.start = Math.min(o.start, n.start)),
          (o.end = Math.max(o.end, n.end)))
        : t.set(e, n);
    }
    return Array.from(t.values());
  }
  clear() {
    (this.siblingDimensions = []), (this.canvasBounds = null);
  }
}
f(te, 'SNAP_THRESHOLD', 8);
const ne = (e) => {
  e.preventDefault();
};
class oe {
  constructor(e, t) {
    f(this, 'store', void 0),
      f(this, 'dragTarget', void 0),
      f(this, 'currentDropTargetId', void 0),
      f(this, 'currentDropTargetCanvasAncestorId', void 0),
      f(this, 'currentIndicator', null),
      f(this, 'currentTargetId', void 0),
      f(this, 'currentTargetChildDimensions', void 0),
      f(this, 'dragError', void 0),
      f(this, 'draggedNodes', void 0),
      f(this, 'onScrollListener', void 0),
      f(this, 'snapGuideCalculator', void 0),
      (this.store = e),
      (this.dragTarget = t),
      (this.currentDropTargetId = null),
      (this.currentDropTargetCanvasAncestorId = null),
      (this.currentTargetId = null),
      (this.currentTargetChildDimensions = null),
      (this.currentIndicator = null),
      (this.dragError = null),
      (this.draggedNodes = this.getDraggedNodes()),
      this.validateDraggedNodes(),
      (this.snapGuideCalculator = new te(e)),
      (this.onScrollListener = this.onScroll.bind(this)),
      window.addEventListener('scroll', this.onScrollListener, !0),
      window.addEventListener('dragover', ne, !1);
  }
  cleanup() {
    window.removeEventListener('scroll', this.onScrollListener, !0),
      window.removeEventListener('dragover', ne, !1),
      this.snapGuideCalculator.clear(),
      this.store.actions.setSnapGuides([]);
  }
  onScroll(t) {
    const n = t.target,
      o = this.store.query.node(e.ROOT_NODE).get();
    n instanceof Element &&
      o &&
      o.dom &&
      n.contains(o.dom) &&
      (this.currentTargetChildDimensions = null);
  }
  getDraggedNodes() {
    return H(
      this.store.query.getNodes(),
      'new' === this.dragTarget.type
        ? this.dragTarget.tree.nodes[this.dragTarget.tree.rootNodeId]
        : this.dragTarget.nodes
    );
  }
  validateDraggedNodes() {
    'new' !== this.dragTarget.type &&
      this.draggedNodes.forEach((e) => {
        let { node: t, exists: n } = e;
        n &&
          this.store.query.node(t.id).isDraggable((e) => {
            this.dragError = e;
          });
      });
  }
  isNearBorders(e, t, n) {
    const { top: o, bottom: r, left: s, right: d } = e;
    return (
      o + oe.BORDER_OFFSET > n ||
      r - oe.BORDER_OFFSET < n ||
      s + oe.BORDER_OFFSET > t ||
      d - oe.BORDER_OFFSET < t
    );
  }
  isDiff(e) {
    return (
      !this.currentIndicator ||
      this.currentIndicator.placement.parent.id !== e.parent.id ||
      this.currentIndicator.placement.index !== e.index ||
      this.currentIndicator.placement.where !== e.where
    );
  }
  getChildDimensions(t) {
    const n = this.currentTargetChildDimensions;
    return this.currentTargetId === t.id && n
      ? n
      : t.data.nodes.reduce((t, n) => {
          const o = this.store.query.node(n).get().dom;
          return o && t.push(E({ id: n }, e.getDOMInfo(o))), t;
        }, []);
  }
  getCanvasAncestor(e) {
    if (
      e === this.currentDropTargetId &&
      this.currentDropTargetCanvasAncestorId
    ) {
      const e = this.store.query
        .node(this.currentDropTargetCanvasAncestorId)
        .get();
      if (e) return e;
    }
    const t = (e) => {
      const n = this.store.query.node(e).get();
      return n && n.data.isCanvas ? n : n.data.parent ? t(n.data.parent) : null;
    };
    return t(e);
  }
  computeIndicator(t, n, o) {
    let r = this.getCanvasAncestor(t);
    if (!r) return;
    if (
      ((this.currentDropTargetId = t),
      (this.currentDropTargetCanvasAncestorId = r.id),
      r.data.parent &&
        this.isNearBorders(e.getDOMInfo(r.dom), n, o) &&
        !this.store.query.node(r.id).isLinkedNode() &&
        (r = this.store.query.node(r.data.parent).get()),
      !r)
    )
      return;
    (this.currentTargetChildDimensions = this.getChildDimensions(r)),
      (this.currentTargetId = r.id);
    const s = J(r, this.currentTargetChildDimensions, n, o);
    if (!this.isDiff(s)) return;
    let d = this.dragError;
    d ||
      this.store.query.node(r.id).isDroppable(
        this.draggedNodes.map((e) => e.node),
        (e) => {
          d = e;
        }
      );
    const a = r.data.nodes[s.index],
      i = a && this.store.query.node(a).get();
    this.currentIndicator = {
      placement: E(E({}, s), {}, { currentNode: i }),
      error: d,
    };
    const l = this.draggedNodes.map((e) => e.node.id);
    this.snapGuideCalculator.setSiblings(r.id, l);
    const c = this.snapGuideCalculator.calculate({
      left: n - 50,
      right: n + 50,
      top: o - 25,
      bottom: o + 25,
      width: 100,
      height: 50,
    });
    return this.store.actions.setSnapGuides(c.guides), this.currentIndicator;
  }
  getIndicator() {
    return this.currentIndicator;
  }
}
f(oe, 'BORDER_OFFSET', 10);
const re = function (e, t) {
  if (
    1 === t.length ||
    (arguments.length > 2 && void 0 !== arguments[2] && arguments[2])
  ) {
    const { width: n, height: o } = t[0].getBoundingClientRect(),
      r = t[0].cloneNode(!0);
    return (
      (r.style.position = 'absolute'),
      (r.style.left = '-100%'),
      (r.style.top = '-100%'),
      (r.style.width = ''.concat(n, 'px')),
      (r.style.height = ''.concat(o, 'px')),
      (r.style.pointerEvents = 'none'),
      r.classList.add('drag-shadow'),
      document.body.appendChild(r),
      e.dataTransfer.setDragImage(r, 0, 0),
      r
    );
  }
  const n = document.createElement('div');
  return (
    (n.style.position = 'absolute'),
    (n.style.left = '-100%'),
    (n.style.top = '-100%'),
    (n.style.width = '100%'),
    (n.style.height = '100%'),
    (n.style.pointerEvents = 'none'),
    n.classList.add('drag-shadow-container'),
    t.forEach((e) => {
      const {
          width: t,
          height: o,
          top: r,
          left: s,
        } = e.getBoundingClientRect(),
        d = e.cloneNode(!0);
      (d.style.position = 'absolute'),
        (d.style.left = ''.concat(s, 'px')),
        (d.style.top = ''.concat(r, 'px')),
        (d.style.width = ''.concat(t, 'px')),
        (d.style.height = ''.concat(o, 'px')),
        d.classList.add('drag-shadow'),
        n.appendChild(d);
    }),
    document.body.appendChild(n),
    e.dataTransfer.setDragImage(n, e.clientX, e.clientY),
    n
  );
};
class se extends ee {
  constructor() {
    super(...arguments),
      f(this, 'draggedElementShadow', void 0),
      f(this, 'dragTarget', void 0),
      f(this, 'positioner', null),
      f(this, 'currentSelectedElementIds', []);
  }
  onDisable() {
    this.options.store.actions.clearEvents();
  }
  handlers() {
    const e = this.options.store;
    return {
      connect: (t, n) => (
        e.actions.setDOM(n, t),
        this.reflect((e) => {
          e.select(t, n), e.hover(t, n), e.drop(t, n);
        })
      ),
      select: (t, n) => {
        const o = this.addCraftEventListener(t, 'mousedown', (t) => {
            t.craft.stopPropagation();
            let o = [];
            if (n) {
              const { query: r } = e,
                s = r.getEvent('selected').all();
              (this.options.isMultiSelectEnabled(t) || s.includes(n)) &&
                (o = s.filter((e) => {
                  const t = r.node(e).descendants(!0),
                    o = r.node(e).ancestors(!0);
                  return !t.includes(n) && !o.includes(n);
                })),
                o.includes(n) || o.push(n);
            }
            e.actions.setNodeEvent('selected', o);
          }),
          r = this.addCraftEventListener(t, 'click', (t) => {
            t.craft.stopPropagation();
            const { query: o } = e,
              r = o.getEvent('selected').all(),
              s = this.options.isMultiSelectEnabled(t),
              d = this.currentSelectedElementIds.includes(n);
            let a = [...r];
            s && d
              ? (a.splice(a.indexOf(n), 1),
                e.actions.setNodeEvent('selected', a))
              : !s &&
                r.length > 1 &&
                ((a = [n]), e.actions.setNodeEvent('selected', a)),
              (this.currentSelectedElementIds = a);
          });
        return () => {
          o(), r();
        };
      },
      hover: (t, n) => {
        const o = this.addCraftEventListener(t, 'mouseover', (t) => {
          t.craft.stopPropagation(), e.actions.setNodeEvent('hovered', n);
        });
        let r = null;
        return (
          this.options.removeHoverOnMouseleave &&
            (r = this.addCraftEventListener(t, 'mouseleave', (t) => {
              t.craft.stopPropagation(),
                e.actions.setNodeEvent('hovered', null);
            })),
          () => {
            o(), r && r();
          }
        );
      },
      drop: (t, n) => {
        const o = this.addCraftEventListener(t, 'dragover', (t) => {
            if (
              (t.craft.stopPropagation(), t.preventDefault(), !this.positioner)
            )
              return;
            const o = this.positioner.computeIndicator(n, t.clientX, t.clientY);
            o && e.actions.setIndicator(o);
          }),
          r = this.addCraftEventListener(t, 'dragenter', (e) => {
            e.craft.stopPropagation(), e.preventDefault();
          });
        return () => {
          r(), o();
        };
      },
      drag: (t, n) => {
        if (!e.query.node(n).isDraggable()) return () => {};
        t.setAttribute('draggable', 'true');
        const o = this.addCraftEventListener(t, 'dragstart', (t) => {
            t.craft.stopPropagation();
            const { query: o, actions: r } = e;
            let s = o.getEvent('selected').all();
            const d = this.options.isMultiSelectEnabled(t);
            this.currentSelectedElementIds.includes(n) ||
              ((s = d ? [...s, n] : [n]),
              e.actions.setNodeEvent('selected', s)),
              r.setNodeEvent('dragged', s);
            const a = s.map((e) => o.node(e).get().dom);
            (this.draggedElementShadow = re(t, a, se.forceSingleDragShadow)),
              (this.dragTarget = { type: 'existing', nodes: s }),
              (this.positioner = new oe(this.options.store, this.dragTarget));
          }),
          r = this.addCraftEventListener(t, 'dragend', (t) => {
            t.craft.stopPropagation(),
              this.dropElement((t, n) => {
                'new' !== t.type &&
                  e.actions.move(
                    t.nodes,
                    n.placement.parent.id,
                    n.placement.index + ('after' === n.placement.where ? 1 : 0)
                  );
              });
          });
        return () => {
          t.setAttribute('draggable', 'false'), o(), r();
        };
      },
      create: (t, n, o) => {
        t.setAttribute('draggable', 'true');
        const r = this.addCraftEventListener(t, 'dragstart', (t) => {
            let o;
            if ((t.craft.stopPropagation(), 'function' == typeof n)) {
              const t = n();
              o = a.default.isValidElement(t)
                ? e.query.parseReactElement(t).toNodeTree()
                : t;
            } else o = e.query.parseReactElement(n).toNodeTree();
            (this.draggedElementShadow = re(
              t,
              [t.currentTarget],
              se.forceSingleDragShadow
            )),
              (this.dragTarget = { type: 'new', tree: o }),
              (this.positioner = new oe(this.options.store, this.dragTarget));
          }),
          s = this.addCraftEventListener(t, 'dragend', (t) => {
            t.craft.stopPropagation(),
              this.dropElement((t, n) => {
                'existing' !== t.type &&
                  (e.actions.addNodeTree(
                    t.tree,
                    n.placement.parent.id,
                    n.placement.index + ('after' === n.placement.where ? 1 : 0)
                  ),
                  o && c.default(o.onCreate) && o.onCreate(t.tree));
              });
          });
        return () => {
          t.removeAttribute('draggable'), r(), s();
        };
      },
    };
  }
  dropElement(e) {
    const t = this.options.store;
    if (!this.positioner) return;
    const n = this.draggedElementShadow,
      o = this.positioner.getIndicator();
    this.dragTarget && o && !o.error && e(this.dragTarget, o),
      n && (n.parentNode.removeChild(n), (this.draggedElementShadow = null)),
      (this.dragTarget = null),
      t.actions.setIndicator(null),
      t.actions.setNodeEvent('dragged', null),
      this.positioner.cleanup(),
      (this.positioner = null);
  }
}
f(se, 'forceSingleDragShadow', e.isChromium() && e.isLinux());
const de = () => {
    const { indicator: n, indicatorOptions: o, enabled: r } = O((e) => ({
        indicator: e.indicator,
        indicatorOptions: e.options.indicator,
        enabled: e.options.enabled,
      })),
      s = N();
    if (
      (t.useEffect(() => {
        s && (r ? s.enable() : s.disable());
      }, [r, s]),
      !n)
    )
      return null;
    const d = (function (e, t, n) {
        let o =
            arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 2,
          r = 0,
          s = 0,
          d = 0,
          a = 0,
          i = e.where,
          l = 'line';
        return (
          n
            ? ((l = 'line'),
              n.inFlow
                ? ((d = n.outerWidth),
                  (a = o),
                  (r = 'before' === i ? n.top : n.bottom),
                  (s = n.left))
                : ((d = o),
                  (a = n.outerHeight),
                  (r = n.top),
                  (s = 'before' === i ? n.left : n.left + n.outerWidth)))
            : ((l = 'block'),
              t &&
                ((r = t.top + t.padding.top),
                (s = t.left + t.padding.left),
                (d =
                  t.outerWidth -
                  t.padding.right -
                  t.padding.left -
                  t.margin.left -
                  t.margin.right),
                (a =
                  t.outerHeight -
                  t.padding.top -
                  t.padding.bottom -
                  t.margin.top -
                  t.margin.bottom),
                (a = Math.max(a, 40)))),
          {
            top: ''.concat(r, 'px'),
            left: ''.concat(s, 'px'),
            width: ''.concat(d, 'px'),
            height: ''.concat(a, 'px'),
            mode: l,
          }
        );
      })(
        n.placement,
        e.getDOMInfo(n.placement.parent.dom),
        n.placement.currentNode && e.getDOMInfo(n.placement.currentNode.dom),
        o.thickness
      ),
      i = n.error ? o.error : o.success;
    return a.default.createElement(e.RenderIndicator, {
      className: o.className,
      style: {
        top: d.top,
        left: d.left,
        width: d.width,
        height: d.height,
        ...('block' === d.mode
          ? {
              backgroundColor: `${i}08`,
              border: `2px solid ${i}`,
              borderRadius: '6px',
              boxSizing: 'border-box',
              pointerEvents: 'none',
              boxShadow: `0 0 0 4px ${i}10, inset 0 0 20px ${i}15`,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }
          : { backgroundColor: i, borderWidth: 0 }),
        transition: o.transition || '0.2s ease-in',
        ...(o.style ?? {}),
      },
      parentDom: n.placement.parent.dom,
    });
  },
  ae = () => {
    const { snapGuides: e, enabled: t } = O((e) => ({
      snapGuides: e.snapGuides || [],
      enabled: e.options.enabled,
    }));
    return t && e && 0 !== e.length
      ? a.default.createElement(
          a.default.Fragment,
          null,
          e.map((e, t) => {
            const n = {
              position: 'fixed',
              backgroundColor: '#0096FF',
              pointerEvents: 'none',
              zIndex: 99999,
              ...('horizontal' === e.type
                ? {
                    left: e.start,
                    top: e.position - 0.5,
                    width: e.end - e.start,
                    height: 1,
                  }
                : {
                    left: e.position - 0.5,
                    top: e.start,
                    width: 1,
                    height: e.end - e.start,
                  }),
            };
            return a.default.createElement('div', {
              key: `snap-guide-${t}`,
              style: n,
            });
          })
        )
      : null;
  },
  ie = ({ children: e }) => {
    const n = t.useContext(v),
      o = t.useMemo(() => n.query.getOptions().handlers(n), [n]);
    return o
      ? a.default.createElement(
          y.Provider,
          { value: o },
          a.default.createElement(de, null),
          a.default.createElement(ae, null),
          e
        )
      : null;
  },
  le = {
    nodes: {},
    events: { dragged: new Set(), selected: new Set(), hovered: new Set() },
    indicator: null,
    snapGuides: [],
    options: {
      onNodesChange: () => null,
      onRender: ({ render: e }) => e,
      onBeforeMoveEnd: () => null,
      resolver: {},
      enabled: !0,
      indicator: { error: 'red', success: 'rgb(98, 196, 98)' },
      handlers: (e) =>
        new se({
          store: e,
          removeHoverOnMouseleave: !1,
          isMultiSelectEnabled: (e) => !!e.metaKey,
        }),
      normalizeNodes: () => {},
    },
  },
  ce = {
    methods: (e, t) =>
      E(
        E({}, V(e, t)),
        {},
        {
          setState(t) {
            const n = m(this, F);
            t(e, n);
          },
        }
      ),
    ignoreHistoryForActions: [
      'setDOM',
      'setNodeEvent',
      'selectNode',
      'clearEvents',
      'setOptions',
      'setIndicator',
      'setSnapGuides',
    ],
    normalizeHistory: (e) => {
      Object.keys(e.events).forEach((t) => {
        Array.from(e.events[t] || []).forEach((n) => {
          e.nodes[n] || e.events[t].delete(n);
        });
      }),
        Object.keys(e.nodes).forEach((t) => {
          const n = e.nodes[t];
          Object.keys(n.events).forEach((t) => {
            n.events[t] &&
              e.events[t] &&
              !e.events[t].has(n.id) &&
              (n.events[t] = !1);
          });
        });
    },
  },
  ue = (t, n) =>
    e.useMethods(ce, { ...le, options: { ...le.options, ...t } }, Z, n),
  pe = ['events', 'data'],
  he = ['nodes'],
  fe = ['nodes'],
  ge = ['_hydrationTimestamp', 'rules'],
  Ee = ['_hydrationTimestamp', 'rules'],
  me = (e) => {
    const {
        events: t,
        data: { nodes: n, linkedNodes: o },
      } = e,
      r = m(e, pe),
      s = Y(u.default(e));
    return {
      node: (e = E(
        E(E({}, s), r),
        {},
        { events: E(E({}, s.events), t), dom: e.dom || s.dom }
      )),
      childNodes: n,
      linkedNodes: o,
    };
  },
  ve = (e) => {
    const t = {},
      n = (e) => {
        const { node: o, childNodes: r, linkedNodes: s } = me(e);
        (t[o.id] = o),
          r &&
            r.forEach((e, r) => {
              const { node: s, childNodes: d, linkedNodes: a } = me(e);
              (s.data.parent = o.id),
                (t[s.id] = s),
                (o.data.nodes[r] = s.id),
                n(
                  E(
                    E({}, s),
                    {},
                    {
                      data: E(
                        E({}, s.data),
                        {},
                        { nodes: d || [], linkedNodes: a || {} }
                      ),
                    }
                  )
                );
            }),
          s &&
            Object.keys(s).forEach((e) => {
              const { node: r, childNodes: d, linkedNodes: a } = me(s[e]);
              (o.data.linkedNodes[e] = r.id),
                (r.data.parent = o.id),
                (t[r.id] = r),
                n(
                  E(
                    E({}, r),
                    {},
                    {
                      data: E(
                        E({}, r.data),
                        {},
                        { nodes: d || [], linkedNodes: a || {} }
                      ),
                    }
                  )
                );
            });
      };
    return n(e), t;
  };
Object.defineProperty(exports, 'ROOT_NODE', {
  enumerable: !0,
  get: function () {
    return e.ROOT_NODE;
  },
}),
  (exports.ActionMethodsWithConfig = ce),
  (exports.Canvas = Canvas),
  (exports.CoreEventHandlers = ee),
  (exports.DefaultEventHandlers = se),
  (exports.DerivedCoreEventHandlers = class extends e.DerivedEventHandlers {}),
  (exports.Editor = ({ children: t, ...n }) => {
    void 0 !== n.resolver &&
      l.default(
        'object' == typeof n.resolver &&
          !Array.isArray(n.resolver) &&
          null !== n.resolver,
        e.ERROR_RESOLVER_NOT_AN_OBJECT
      );
    const o = i.useRef(n),
      r = ue(o.current, (t, n, o, r, s) => {
        if (!o) return;
        const { patches: d, ...a } = o;
        for (let o = 0; o < d.length; o++) {
          const { path: i } = d[o],
            l = i.length > 2 && 'nodes' === i[0] && 'data' === i[2];
          if (
            ([e.HISTORY_ACTIONS.IGNORE, e.HISTORY_ACTIONS.THROTTLE].includes(
              a.type
            ) &&
              a.params &&
              (a.type = a.params[0]),
            ['setState', 'deserialize'].includes(a.type) || l)
          ) {
            s((e) => {
              t.options.normalizeNodes && t.options.normalizeNodes(e, n, a, r);
            });
            break;
          }
        }
      });
    return (
      i.useEffect(() => {
        r &&
          void 0 !== n.enabled &&
          r.query.getOptions().enabled !== n.enabled &&
          r.actions.setOptions((e) => {
            e.enabled = n.enabled;
          });
      }, [r, n.enabled]),
      i.useEffect(() => {
        r.subscribe(
          (e) => ({ json: r.query.serialize() }),
          () => {
            r.query.getOptions().onNodesChange(r.query);
          }
        );
      }, [r]),
      r
        ? i.createElement(
            v.Provider,
            { value: r },
            i.createElement(ie, null, t)
          )
        : null
    );
  }),
  (exports.Element = k),
  (exports.Events = ie),
  (exports.Frame = ({ children: n, json: o, data: r }) => {
    const { actions: s, query: d } = O();
    o &&
      e.deprecationWarning('<Frame json={...} />', {
        suggest: '<Frame data={...} />',
      });
    const i = t.useRef(!1);
    if (!i.current) {
      const t = r || o;
      if (t) s.history.ignore().deserialize(t);
      else if (n) {
        const t = a.default.Children.only(n),
          o = d
            .parseReactElement(t)
            .toNodeTree((n, o) => (o === t && (n.id = e.ROOT_NODE), n));
        s.history.ignore().addNodeTree(o);
      }
      i.current = !0;
    }
    return a.default.createElement(P, null);
  }),
  (exports.NodeElement = S),
  (exports.NodeHelpers = U),
  (exports.NodeProvider = h),
  (exports.Positioner = oe),
  (exports.QueryMethods = Z),
  (exports.RenderSnapGuides = ae),
  (exports.SnapGuideCalculator = te),
  (exports.connectEditor = function (e) {
    return (t) => (n) => {
      const o = e ? A(e) : A();
      return a.default.createElement(t, { ...o, ...n });
    };
  }),
  (exports.connectNode = function (e) {
    return function (t) {
      return (n) => {
        const o = _(e);
        return a.default.createElement(t, { ...o, ...n });
      };
    };
  }),
  (exports.createShadow = re),
  (exports.createTestNodes = ve),
  (exports.createTestState = function () {
    let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    const { nodes: t, events: n } = e;
    return E(
      E(E({}, le), e),
      {},
      { nodes: t ? ve(t) : {}, events: E(E({}, le.events), n || {}) }
    );
  }),
  (exports.defaultElementProps = I),
  (exports.deprecateCanvasComponent = L),
  (exports.editorInitialState = le),
  (exports.elementPropToNodeData = w),
  (exports.expectEditorState = (e, t) => {
    const { nodes: n } = t,
      o = m(t, he),
      { nodes: r } = e,
      s = m(e, fe);
    expect(s).toEqual(o);
    const d = Object.keys(n).reduce((e, t) => {
        const o = m(n[t], ge);
        return (e[t] = o), e;
      }, {}),
      a = Object.keys(r).reduce((e, t) => {
        const n = m(r[t], Ee);
        return (e[t] = n), e;
      }, {});
    expect(a).toEqual(d);
  }),
  (exports.serializeNode = $),
  (exports.useEditor = A),
  (exports.useEditorStore = ue),
  (exports.useEventHandler = N),
  (exports.useNode = _);
//# sourceMappingURL=index.js.map
