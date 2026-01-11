'undefined' != typeof window &&
  (window.__CRAFTJS__ || (window.__CRAFTJS__ = {}),
  (window.__CRAFTJS__['@craftjs/core'] = '0.2.12'));
import {
  ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT as e,
  useCollector as t,
  wrapConnectorHooks as n,
  ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT as o,
  deprecationWarning as r,
  ERROR_TOP_LEVEL_ELEMENT_NO_ID as s,
  ROOT_NODE as d,
  ERROR_INVALID_NODEID as a,
  ERROR_DELETE_TOP_LEVEL_NODE as i,
  ERROR_NOPARENT as l,
  DEPRECATED_ROOT_NODE as c,
  ERROR_NOT_IN_RESOLVER as p,
  ERROR_INVALID_NODE_ID as u,
  ERROR_MOVE_TOP_LEVEL_NODE as h,
  ERROR_MOVE_NONCANVAS_CHILD as g,
  ERROR_CANNOT_DRAG as m,
  ERROR_MOVE_TO_NONCANVAS_PARENT as f,
  ERROR_MOVE_INCOMING_PARENT as v,
  ERROR_MOVE_CANNOT_DROP as y,
  ERROR_MOVE_TO_DESCENDANT as N,
  ERROR_DUPLICATE_NODEID as E,
  ERROR_MOVE_OUTGOING_PARENT as b,
  getRandomId as O,
  ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER as w,
  getDOMInfo as T,
  EventHandlers as C,
  DerivedEventHandlers as S,
  isChromium as D,
  isLinux as x,
  RenderIndicator as k,
  useMethods as I,
  ERROR_RESOLVER_NOT_AN_OBJECT as j,
  HISTORY_ACTIONS as P,
} from '@craftjs/utils';
export { ROOT_NODE } from '@craftjs/utils';
import * as L from 'react';
import R, {
  createContext as q,
  useContext as A,
  useMemo as M,
  useEffect as _,
  useState as F,
  useRef as B,
  Children as z,
  Fragment as H,
} from 'react';
import G from 'tiny-invariant';
import $ from 'lodash/isFunction';
import W from 'lodash/cloneDeep';
const J = R.createContext(null),
  X = ({ id: e, related: t = !1, children: n }) =>
    R.createElement(J.Provider, { value: { id: e, related: t } }, n);
function Y(e, t, n) {
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
function V(e, t) {
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
function K(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = null != arguments[t] ? arguments[t] : {};
    t % 2
      ? V(Object(n), !0).forEach(function (t) {
          Y(e, t, n[t]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
      : V(Object(n)).forEach(function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
        });
  }
  return e;
}
function U(e, t) {
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
const Q = q(null),
  Z = q(null),
  ee = () => A(Z);
function te(o) {
  const r = ee(),
    s = A(Q);
  G(s, e);
  const d = t(s, o),
    a = M(() => r && r.createConnectorsUsage(), [r]);
  _(
    () => (
      a.register(),
      () => {
        a.cleanup();
      }
    ),
    [a]
  );
  const i = M(() => a && n(a.connectors), [a]);
  return K(K({}, d), {}, { connectors: i, inContext: !!s, store: s });
}
const ne = ['actions', 'query', 'connectors'];
function oe(e) {
  const t = A(J);
  G(t, o);
  const { id: r, related: s } = t,
    d = te((t) => r && t.nodes[r] && e && e(t.nodes[r])),
    { actions: a, connectors: i } = d,
    l = U(d, ne),
    c = M(
      () => n({ connect: (e) => i.connect(e, r), drag: (e) => i.drag(e, r) }),
      [i, r]
    ),
    p = M(
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
  return K(
    K({}, l),
    {},
    { id: r, related: s, inNodeContext: !!t, actions: p, connectors: c }
  );
}
const re = ['id', 'related', 'actions', 'inNodeContext', 'connectors'];
function se(e) {
  const t = oe(e),
    { id: n, related: o, actions: s, inNodeContext: d, connectors: a } = t;
  return K(
    K({}, U(t, re)),
    {},
    {
      actions: s,
      id: n,
      related: o,
      setProp: (e, t) => (
        r('useNode().setProp()', { suggest: 'useNode().actions.setProp()' }),
        s.setProp(e, t)
      ),
      inNodeContext: d,
      connectors: a,
    }
  );
}
const de = ({ render: e }) => {
    const {
      connectors: { connect: t, drag: n },
    } = se();
    return 'string' == typeof e.type ? t(n(R.cloneElement(e))) : e;
  },
  ae = () => {
    const { type: e, props: t, nodes: n, hydrationTimestamp: o } = oe((e) => ({
      type: e.data.type,
      props: e.data.props,
      nodes: e.data.nodes,
      hydrationTimestamp: e._hydrationTimestamp,
    }));
    return M(() => {
      let o = t.children;
      n &&
        n.length > 0 &&
        (o = R.createElement(
          R.Fragment,
          null,
          n.map((e) => R.createElement(le, { id: e, key: e }))
        ));
      const r = R.createElement(e, t, o);
      return 'string' == typeof e ? R.createElement(de, { render: r }) : r;
    }, [e, t, o, n]);
  },
  ie = ({ render: e }) => {
    const { hidden: t } = oe((e) => ({ hidden: e.data.hidden })),
      { onRender: n } = te((e) => ({ onRender: e.options.onRender }));
    return t
      ? null
      : R.createElement(n, { render: e || R.createElement(ae, null) });
  },
  le = ({ id: e, render: t }) =>
    R.createElement(X, { id: e }, R.createElement(ie, { render: t })),
  ce = { is: 'div', canvas: !1, custom: {}, hidden: !1 },
  pe = { is: 'type', canvas: 'isCanvas' };
function ue({ id: e, children: t, ...n }) {
  const { is: o } = { ...ce, ...n },
    { query: r, actions: d } = te(),
    { id: a, inNodeContext: i } = oe(),
    [l] = F(() => {
      G(!!e, s);
      const l = r.node(a).get();
      if (i) {
        const s = l.data.linkedNodes[e]
          ? r.node(l.data.linkedNodes[e]).get()
          : null;
        if (s && s.data.type === o) return s.id;
        const i = R.createElement(ue, n, t),
          c = r.parseReactElement(i).toNodeTree();
        return d.history.ignore().addLinkedNodeFromTree(c, a, e), c.rootNodeId;
      }
      return null;
    });
  return l ? R.createElement(le, { id: l }) : null;
}
const he = () => r('<Canvas />', { suggest: '<Element canvas={true} />' });
function Canvas({ ...e }) {
  return _(() => he(), []), R.createElement(ue, { ...e, canvas: !0 });
}
const ge = () => {
    const { timestamp: e } = te((e) => ({
      timestamp: e.nodes[d] && e.nodes[d]._hydrationTimestamp,
    }));
    return e ? R.createElement(le, { id: d, key: e }) : null;
  },
  me = ({ children: e, json: t, data: n }) => {
    const { actions: o, query: s } = te();
    t && r('<Frame json={...} />', { suggest: '<Frame data={...} />' });
    const a = B(!1);
    if (!a.current) {
      const r = n || t;
      if (r) o.history.ignore().deserialize(r);
      else if (e) {
        const t = R.Children.only(e),
          n = s
            .parseReactElement(t)
            .toNodeTree((e, n) => (n === t && (e.id = d), e));
        o.history.ignore().addNodeTree(n);
      }
      a.current = !0;
    }
    return R.createElement(ge, null);
  };
var fe;
!(function (e) {
  (e[(e.Any = 0)] = 'Any'), (e[(e.Id = 1)] = 'Id'), (e[(e.Obj = 2)] = 'Obj');
})(fe || (fe = {}));
const ve = (e) => {
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
function ye(e) {
  const { connectors: t, actions: n, query: o, store: r, ...s } = te(e),
    d = ve(n);
  return {
    connectors: t,
    actions: M(
      () => ({
        ...d,
        history: {
          ...d.history,
          ignore: (...e) => ve(d.history.ignore(...e)),
          throttle: (...e) => ve(d.history.throttle(...e)),
        },
      }),
      [d]
    ),
    query: o,
    store: r,
    ...s,
  };
}
function Ne(e) {
  return (t) => (n) => {
    const o = e ? ye(e) : ye();
    return R.createElement(t, { ...o, ...n });
  };
}
function Ee(e) {
  return function (t) {
    return (n) => {
      const o = se(e);
      return R.createElement(t, { ...o, ...n });
    };
  };
}
const be = (e) =>
    Object.fromEntries
      ? Object.fromEntries(e)
      : e.reduce((e, t) => {
          let [n, o] = t;
          return K(K({}, e), {}, { [n]: o });
        }, {}),
  Oe = (e, t, n) => {
    const o = Array.isArray(t) ? t : [t],
      r = K({ existOnly: !1, idOnly: !1 }, n || {}),
      s = o
        .filter((e) => !!e)
        .map((t) =>
          'string' == typeof t
            ? { node: e[t], exists: !!e[t] }
            : 'object' != typeof t || r.idOnly
            ? { node: null, exists: !1 }
            : { node: t, exists: !!e[t.id] }
        );
    return r.existOnly && G(0 === s.filter((e) => !e.exists).length, a), s;
  },
  we = ['history'],
  Te = (e, t) => {
    const n = (t, n, r) => {
        const s = (n, o) => {
          const r = t.nodes[n];
          'string' != typeof r.data.type &&
            G(
              e.options.resolver[r.data.name],
              p.replace('%node_type%', ''.concat(r.data.type.name))
            ),
            (e.nodes[n] = K(
              K({}, r),
              {},
              { data: K(K({}, r.data), {}, { parent: o }) }
            )),
            r.data.nodes.length > 0 &&
              (delete e.nodes[n].data.props.children,
              r.data.nodes.forEach((e) => s(e, r.id))),
            Object.values(r.data.linkedNodes).forEach((e) => s(e, r.id));
        };
        if ((s(t.rootNodeId, n), !n && t.rootNodeId === d)) return;
        const a = o(n);
        if ('child' === r.type) {
          const e = r.index;
          return void (null != e
            ? a.data.nodes.splice(e, 0, t.rootNodeId)
            : a.data.nodes.push(t.rootNodeId));
        }
        a.data.linkedNodes[r.id] = t.rootNodeId;
      },
      o = (t) => {
        G(t, l);
        const n = e.nodes[t];
        return G(n, a), n;
      },
      s = (t) => {
        const n = e.nodes[t],
          o = e.nodes[n.data.parent];
        if (
          (n.data.nodes && [...n.data.nodes].forEach((e) => s(e)),
          n.data.linkedNodes &&
            Object.values(n.data.linkedNodes).map((e) => s(e)),
          o.data.nodes.includes(t))
        ) {
          const e = o.data.nodes;
          e.splice(e.indexOf(t), 1);
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
        })(e, t),
          delete e.nodes[t];
      };
    return {
      addLinkedNodeFromTree(e, t, r) {
        const d = o(t).data.linkedNodes[r];
        d && s(d), n(e, t, { type: 'linked', id: r });
      },
      add(e, t, o) {
        let s = [e];
        Array.isArray(e) &&
          (r('actions.add(node: Node[])', {
            suggest: 'actions.add(node: Node)',
          }),
          (s = e)),
          s.forEach((e) => {
            n({ nodes: { [e.id]: e }, rootNodeId: e.id }, t, {
              type: 'child',
              index: o,
            });
          });
      },
      addNodeTree(e, t, o) {
        n(e, t, { type: 'child', index: o });
      },
      delete(n) {
        Oe(e.nodes, n, { existOnly: !0, idOnly: !0 }).forEach((e) => {
          let { node: n } = e;
          G(!t.node(n.id).isTopLevelNode(), i), s(n.id);
        });
      },
      deserialize(e) {
        const n = 'string' == typeof e ? JSON.parse(e) : e,
          o = Object.keys(n).map((e) => {
            let o = e;
            return (
              e === c && (o = d),
              [o, t.parseSerializedNode(n[e]).toNode((e) => (e.id = o))]
            );
          });
        this.replaceNodes(be(o));
      },
      move(n, o, r) {
        const s = Oe(e.nodes, n, { existOnly: !0 }),
          d = e.nodes[o],
          a = new Set();
        s.forEach((n, s) => {
          let { node: i } = n;
          const l = i.id,
            c = i.data.parent;
          t.node(o).isDroppable([l], (e) => {
            throw new Error(e);
          }),
            e.options.onBeforeMoveEnd(i, d, e.nodes[c]);
          const p = e.nodes[c].data.nodes;
          a.add(p);
          const u = p.indexOf(l);
          (p[u] = '$$'),
            d.data.nodes.splice(r + s, 0, l),
            (e.nodes[l].data.parent = o);
        }),
          a.forEach((e) => {
            const t = e.length;
            [...e].reverse().forEach((n, o) => {
              '$$' === n && e.splice(t - 1 - o, 1);
            });
          });
      },
      replaceNodes(t) {
        this.clearEvents(), (e.nodes = t);
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
      setOptions(t) {
        t(e.options);
      },
      setNodeEvent(t, n) {
        if (
          (e.events[t].forEach((n) => {
            e.nodes[n] && (e.nodes[n].events[t] = !1);
          }),
          (e.events[t] = new Set()),
          !n)
        )
          return;
        const o = Oe(e.nodes, n, { idOnly: !0, existOnly: !0 }),
          r = new Set(
            o.map((e) => {
              let { node: t } = e;
              return t.id;
            })
          );
        r.forEach((n) => {
          e.nodes[n].events[t] = !0;
        }),
          (e.events[t] = r);
      },
      setCustom(t, n) {
        Oe(e.nodes, t, { idOnly: !0, existOnly: !0 }).forEach((t) => {
          let { node: o } = t;
          return n(e.nodes[o.id].data.custom);
        });
      },
      setDOM(t, n) {
        e.nodes[t] && (e.nodes[t].dom = n);
      },
      setIndicator(t) {
        (t &&
          (!t.placement.parent.dom ||
            (t.placement.currentNode && !t.placement.currentNode.dom))) ||
          (e.indicator = t);
      },
      setSnapGuides(t) {
        e.snapGuides = t || [];
      },
      setHidden(t, n) {
        e.nodes[t].data.hidden = n;
      },
      setProp(t, n) {
        Oe(e.nodes, t, { idOnly: !0, existOnly: !0 }).forEach((t) => {
          let { node: o } = t;
          return n(e.nodes[o.id].data.props);
        });
      },
      selectNode(t) {
        if (t) {
          const n = Oe(e.nodes, t, { idOnly: !0, existOnly: !0 });
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
let Ce = null;
const Se = (e, t) => {
    if ('string' == typeof t) return t;
    const n = ((e, t) => {
      const n = ((e) => {
        if (Ce && Ce.resolver === e) return Ce.reversed;
        Ce = { resolver: e, reversed: new Map() };
        for (const [t, n] of Object.entries(e)) Ce.reversed.set(n, t);
        return Ce.reversed;
      })(e).get(t);
      return void 0 !== n ? n : null;
    })(e, t);
    var o;
    return G(n, p.replace('%node_type%', (o = t).name || o.displayName)), n;
  },
  De = (e, t) => ('string' == typeof e ? e : { resolvedName: Se(t, e) }),
  xe = (e, t) => {
    let { type: n, isCanvas: o, props: r } = e;
    return (
      (r = Object.keys(r).reduce((e, n) => {
        const o = r[n];
        return (
          null == o ||
            'function' == typeof o ||
            (e[n] =
              'children' === n && 'string' != typeof o
                ? z.map(o, (e) => ('string' == typeof e ? e : xe(e, t)))
                : 'function' == typeof o.type
                ? xe(o, t)
                : o),
          e
        );
      }, {})),
      { type: De(n, t), isCanvas: !!o, props: r }
    );
  },
  ke = (e, t) => {
    const { type: n, props: o, isCanvas: r, name: s, ...d } = e;
    return { ...xe({ type: n, isCanvas: r, props: o }, t), ...d };
  };
function Ie(e, t) {
  G('string' == typeof t, u);
  const n = e.nodes[t],
    o = (t) => Ie(e, t);
  return {
    isCanvas: () => !!n.data.isCanvas,
    isRoot: () => n.id === d,
    isLinkedNode: () =>
      n.data.parent && o(n.data.parent).linkedNodes().includes(n.id),
    isTopLevelNode() {
      return this.isRoot() || this.isLinkedNode();
    },
    isDeletable() {
      return !this.isTopLevelNode();
    },
    isParentOfTopLevelNodes: () =>
      n.data.linkedNodes && Object.keys(n.data.linkedNodes).length > 0,
    isParentOfTopLevelCanvas() {
      return (
        r('query.node(id).isParentOfTopLevelCanvas', {
          suggest: 'query.node(id).isParentOfTopLevelNodes',
        }),
        this.isParentOfTopLevelNodes()
      );
    },
    isSelected: () => e.events.selected.has(t),
    isHovered: () => e.events.hovered.has(t),
    isDragged: () => e.events.dragged.has(t),
    get: () => n,
    ancestors() {
      let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return (function n(o) {
        let r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
          s =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        const d = e.nodes[o];
        return d
          ? (r.push(o),
            d.data.parent
              ? ((t || (!t && 0 === s)) && (r = n(d.data.parent, r, s + 1)), r)
              : r)
          : r;
      })(n.data.parent);
    },
    descendants() {
      let n = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
        r = arguments.length > 1 ? arguments[1] : void 0;
      return (function t(s) {
        let d =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
          a =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        return (n || (!n && 0 === a)) && e.nodes[s]
          ? ('childNodes' !== r &&
              o(s)
                .linkedNodes()
                .forEach((e) => {
                  d.push(e), (d = t(e, d, a + 1));
                }),
            'linkedNodes' !== r &&
              o(s)
                .childNodes()
                .forEach((e) => {
                  d.push(e), (d = t(e, d, a + 1));
                }),
            d)
          : d;
      })(t);
    },
    linkedNodes: () => Object.values(n.data.linkedNodes || {}),
    childNodes: () => n.data.nodes || [],
    isDraggable(t) {
      try {
        const t = n;
        return (
          G(!this.isTopLevelNode(), h),
          G(Ie(e, t.data.parent).isCanvas(), g),
          G(t.rules.canDrag(t, o), m),
          !0
        );
      } catch (e) {
        return t && t(e), !1;
      }
    },
    isDroppable(t, r) {
      const s = Oe(e.nodes, t),
        d = n;
      try {
        G(this.isCanvas(), f),
          G(
            d.rules.canMoveIn(
              s.map((e) => e.node),
              d,
              o
            ),
            v
          );
        const t = {};
        return (
          s.forEach((n) => {
            let { node: r, exists: s } = n;
            if ((G(r.rules.canDrop(d, r, o), y), !s)) return;
            G(!o(r.id).isTopLevelNode(), h);
            const a = o(r.id).descendants(!0);
            G(!a.includes(d.id) && d.id !== r.id, N);
            const i = r.data.parent && e.nodes[r.data.parent];
            G(i.data.isCanvas, g),
              G(i || (!i && !e.nodes[r.id]), E),
              i.id !== d.id && (t[i.id] || (t[i.id] = []), t[i.id].push(r));
          }),
          Object.keys(t).forEach((n) => {
            const r = e.nodes[n];
            G(r.rules.canMoveOut(t[n], r, o), b);
          }),
          !0
        );
      } catch (e) {
        return r && r(e), !1;
      }
    },
    toSerializedNode: () => ke(n.data, e.options.resolver),
    toNodeTree(e) {
      const n = [t, ...this.descendants(!0, e)].reduce(
        (e, t) => ((e[t] = o(t).get()), e),
        {}
      );
      return { rootNodeId: t, nodes: n };
    },
    decendants() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return (
        r('query.node(id).decendants', {
          suggest: 'query.node(id).descendants',
        }),
        this.descendants(e)
      );
    },
    isTopLevelCanvas() {
      return !this.isRoot() && !n.data.parent;
    },
  };
}
function je(e, t, n, o) {
  let r = { parent: e, index: 0, where: 'before' },
    s = 0,
    d = 0,
    a = 0,
    i = 0,
    l = 0,
    c = 0,
    p = 0;
  for (let e = 0, u = t.length; e < u; e++) {
    const u = t[e];
    if (
      ((a = u.left + u.outerWidth),
      (p = u.top + u.outerHeight),
      (l = u.left + u.outerWidth / 2),
      (c = u.top + u.outerHeight / 2),
      !((d && u.left > d) || (i && c >= i) || (s && a < s)))
    )
      if (((r.index = e), u.inFlow)) {
        if (o < c) {
          r.where = 'before';
          break;
        }
        r.where = 'after';
      } else
        o < p && (i = p),
          n < l
            ? ((d = l), (r.where = 'before'))
            : ((s = l), (r.where = 'after'));
  }
  return r;
}
const Pe = (e) => ('string' == typeof e ? e : e.name);
function Le(e, t) {
  let n = e.data.type;
  const o = {
    id: e.id || O(),
    _hydrationTimestamp: Date.now(),
    data: K(
      {
        type: n,
        name: Pe(n),
        displayName: Pe(n),
        props: {},
        custom: {},
        parent: null,
        isCanvas: !1,
        hidden: !1,
        nodes: [],
        linkedNodes: {},
      },
      e.data
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
  if (o.data.type === ue || o.data.type === Canvas) {
    const e = K(K({}, ce), o.data.props);
    (o.data.props = Object.keys(o.data.props).reduce(
      (t, n) => (
        Object.keys(ce).includes(n)
          ? (o.data[pe[n] || n] = e[n])
          : (t[n] = o.data.props[n]),
        t
      ),
      {}
    )),
      (n = o.data.type),
      (o.data.name = Pe(n)),
      (o.data.displayName = Pe(n)),
      o.data.type === Canvas && ((o.data.isCanvas = !0), he());
  }
  t && t(o);
  const r = n.craft;
  if (r) {
    if (
      ((o.data.displayName = r.displayName || r.name || o.data.displayName),
      (o.data.props = K(K({}, r.props || r.defaultProps || {}), o.data.props)),
      (o.data.custom = K(K({}, r.custom || {}), o.data.custom)),
      null != r.isCanvas && (o.data.isCanvas = r.isCanvas),
      r.rules &&
        Object.keys(r.rules).forEach((e) => {
          ['canDrag', 'canDrop', 'canMoveIn', 'canMoveOut'].includes(e) &&
            (o.rules[e] = r.rules[e]);
        }),
      r.related)
    ) {
      const e = { id: o.id, related: !0 };
      Object.keys(r.related).forEach((t) => {
        o.related[t] = (n) =>
          R.createElement(X, e, R.createElement(r.related[t], n));
      });
    }
    r.info && (o.info = r.info);
  }
  return o;
}
const Re = (e, t, n) => {
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
            ? Re(o, t)
            : 'children' === n && Array.isArray(o)
            ? o.map((e) => ('string' == typeof e ? e : Re(e, t)))
            : o),
        e
      );
    }, {})),
      n && (r.key = n);
    const d = { ...R.createElement(s, { ...r }) };
    return { ...d, name: Se(t, d.type) };
  },
  qe = (e, t) => {
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
function Ae(e) {
  const t = e && e.options,
    n = () => Ae(e);
  return {
    getDropPlaceholder: (t, o, r, s = (t) => e.nodes[t.id].dom) => {
      const d = e.nodes[o],
        a = n().node(d.id).isCanvas() ? d : e.nodes[d.data.parent];
      if (!a) return;
      const i = a.data.nodes || [],
        l = je(
          a,
          i
            ? i.reduce((t, n) => {
                const o = s(e.nodes[n]);
                if (o) {
                  const e = { id: n, ...T(o) };
                  t.push(e);
                }
                return t;
              }, [])
            : [],
          r.x,
          r.y
        ),
        c = i.length && e.nodes[i[l.index]],
        p = { placement: { ...l, currentNode: c }, error: null };
      return (
        Oe(e.nodes, t).forEach(({ node: e, exists: t }) => {
          t &&
            n()
              .node(e.id)
              .isDraggable((e) => (p.error = e));
        }),
        n()
          .node(a.id)
          .isDroppable(t, (e) => (p.error = e)),
        p
      );
    },
    getOptions: () => t,
    getNodes: () => e.nodes,
    node: (t) => Ie(e, t),
    getSerializedNodes() {
      const t = Object.keys(e.nodes).map((e) => [
        e,
        this.node(e).toSerializedNode(),
      ]);
      return be(t);
    },
    getEvent: (t) =>
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
      })(e, t),
    serialize() {
      return JSON.stringify(this.getSerializedNodes());
    },
    parseReactElement: (t) => ({
      toNodeTree(o) {
        let r = (function (e, t) {
            let n = e;
            return (
              'string' == typeof n && (n = R.createElement(H, {}, n)),
              Le({ data: { type: n.type, props: { ...n.props } } }, (e) => {
                t && t(e, n);
              })
            );
          })(t, (t, n) => {
            const r = Se(e.options.resolver, t.data.type);
            (t.data.displayName = t.data.displayName || r),
              (t.data.name = r),
              o && o(t, n);
          }),
          s = [];
        return (
          t.props &&
            t.props.children &&
            (s = R.Children.toArray(t.props.children).reduce(
              (e, t) => (
                R.isValidElement(t) &&
                  e.push(n().parseReactElement(t).toNodeTree(o)),
                e
              ),
              []
            )),
          ((e, t) => ({ rootNodeId: e.id, nodes: qe(e, t) }))(r, s)
        );
      },
    }),
    parseSerializedNode: (t) => ({
      toNode(o) {
        const s = ((e, t) => {
          const { type: n, props: o, ...r } = e;
          G(
            (void 0 !== n && 'string' == typeof n) ||
              (void 0 !== n && void 0 !== n.resolvedName),
            w
              .replace('%displayName%', e.displayName)
              .replace('%availableComponents%', Object.keys(t).join(', '))
          );
          const { type: s, name: d, props: a } = Re(e, t),
            {
              parent: i,
              custom: l,
              displayName: c,
              isCanvas: p,
              nodes: u,
              hidden: h,
            } = r;
          return {
            type: s,
            name: d,
            displayName: c || d,
            props: a,
            custom: l || {},
            isCanvas: !!p,
            hidden: !!h,
            parent: i,
            linkedNodes: r.linkedNodes || r._childCanvas || {},
            nodes: u || [],
          };
        })(t, e.options.resolver);
        G(s.type, p);
        const d = 'string' == typeof o && o;
        return (
          d &&
            r('query.parseSerializedNode(...).toNode(id)', {
              suggest:
                'query.parseSerializedNode(...).toNode(node => node.id = id)',
            }),
          n()
            .parseFreshNode({ ...(d ? { id: d } : {}), data: s })
            .toNode(!d && o)
        );
      },
    }),
    parseFreshNode: (t) => ({
      toNode: (n) =>
        Le(t, (t) => {
          t.data.parent === c && (t.data.parent = d);
          const o = Se(e.options.resolver, t.data.type);
          G(null !== o, p),
            (t.data.displayName = t.data.displayName || o),
            (t.data.name = o),
            n && n(t);
        }),
    }),
    createNode(e, t) {
      r(`query.createNode(${e})`, {
        suggest: `query.parseReactElement(${e}).toNodeTree()`,
      });
      const n = this.parseReactElement(e).toNodeTree(),
        o = n.nodes[n.rootNodeId];
      return t
        ? (t.id && (o.id = t.id),
          t.data && (o.data = { ...o.data, ...t.data }),
          o)
        : o;
    },
    getState: () => e,
  };
}
class Me extends C {
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
class _e extends S {}
class Fe {
  constructor(e) {
    Y(this, 'store', void 0),
      Y(this, 'siblingDimensions', []),
      Y(this, 'canvasBounds', null),
      (this.store = e);
  }
  setSiblings(e, t) {
    const n = this.store.query.node(e).get();
    n &&
      (n.dom && (this.canvasBounds = n.dom.getBoundingClientRect()),
      (this.siblingDimensions = n.data.nodes
        .filter((e) => !t.includes(e))
        .map((e) => {
          const t = this.store.query.node(e).get();
          return t && t.dom ? K({ id: e }, T(t.dom)) : null;
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
      Math.abs(r - a) < Fe.SNAP_THRESHOLD &&
        ((n = a - e.width / 2),
        t.push({
          type: 'vertical',
          position: a,
          start: Math.min(e.top, d.top),
          end: Math.max(e.bottom, d.bottom),
        })),
        Math.abs(s - i) < Fe.SNAP_THRESHOLD &&
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
      Math.abs(r - d) < Fe.SNAP_THRESHOLD &&
        ((n = d - e.width / 2),
        t.push({
          type: 'vertical',
          position: d,
          start: this.canvasBounds.top,
          end: this.canvasBounds.bottom,
        })),
        Math.abs(s - a) < Fe.SNAP_THRESHOLD &&
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
Y(Fe, 'SNAP_THRESHOLD', 8);
const Be = (e) => {
  e.preventDefault();
};
class ze {
  constructor(e, t) {
    Y(this, 'store', void 0),
      Y(this, 'dragTarget', void 0),
      Y(this, 'currentDropTargetId', void 0),
      Y(this, 'currentDropTargetCanvasAncestorId', void 0),
      Y(this, 'currentIndicator', null),
      Y(this, 'currentTargetId', void 0),
      Y(this, 'currentTargetChildDimensions', void 0),
      Y(this, 'dragError', void 0),
      Y(this, 'draggedNodes', void 0),
      Y(this, 'onScrollListener', void 0),
      Y(this, 'snapGuideCalculator', void 0),
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
      (this.snapGuideCalculator = new Fe(e)),
      (this.onScrollListener = this.onScroll.bind(this)),
      window.addEventListener('scroll', this.onScrollListener, !0),
      window.addEventListener('dragover', Be, !1);
  }
  cleanup() {
    window.removeEventListener('scroll', this.onScrollListener, !0),
      window.removeEventListener('dragover', Be, !1),
      this.snapGuideCalculator.clear(),
      this.store.actions.setSnapGuides([]);
  }
  onScroll(e) {
    const t = e.target,
      n = this.store.query.node(d).get();
    t instanceof Element &&
      n &&
      n.dom &&
      t.contains(n.dom) &&
      (this.currentTargetChildDimensions = null);
  }
  getDraggedNodes() {
    return Oe(
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
      o + ze.BORDER_OFFSET > n ||
      r - ze.BORDER_OFFSET < n ||
      s + ze.BORDER_OFFSET > t ||
      d - ze.BORDER_OFFSET < t
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
  getChildDimensions(e) {
    const t = this.currentTargetChildDimensions;
    return this.currentTargetId === e.id && t
      ? t
      : e.data.nodes.reduce((e, t) => {
          const n = this.store.query.node(t).get().dom;
          return n && e.push(K({ id: t }, T(n))), e;
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
  computeIndicator(e, t, n) {
    let o = this.getCanvasAncestor(e);
    if (!o) return;
    if (
      ((this.currentDropTargetId = e),
      (this.currentDropTargetCanvasAncestorId = o.id),
      o.data.parent &&
        this.isNearBorders(T(o.dom), t, n) &&
        !this.store.query.node(o.id).isLinkedNode() &&
        (o = this.store.query.node(o.data.parent).get()),
      !o)
    )
      return;
    (this.currentTargetChildDimensions = this.getChildDimensions(o)),
      (this.currentTargetId = o.id);
    const r = je(o, this.currentTargetChildDimensions, t, n);
    if (!this.isDiff(r)) return;
    let s = this.dragError;
    s ||
      this.store.query.node(o.id).isDroppable(
        this.draggedNodes.map((e) => e.node),
        (e) => {
          s = e;
        }
      );
    const d = o.data.nodes[r.index],
      a = d && this.store.query.node(d).get();
    this.currentIndicator = {
      placement: K(K({}, r), {}, { currentNode: a }),
      error: s,
    };
    const i = this.draggedNodes.map((e) => e.node.id);
    this.snapGuideCalculator.setSiblings(o.id, i);
    const l = this.snapGuideCalculator.calculate({
      left: t - 50,
      right: t + 50,
      top: n - 25,
      bottom: n + 25,
      width: 100,
      height: 50,
    });
    return this.store.actions.setSnapGuides(l.guides), this.currentIndicator;
  }
  getIndicator() {
    return this.currentIndicator;
  }
}
Y(ze, 'BORDER_OFFSET', 10);
const He = function (e, t) {
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
class Ge extends Me {
  constructor() {
    super(...arguments),
      Y(this, 'draggedElementShadow', void 0),
      Y(this, 'dragTarget', void 0),
      Y(this, 'positioner', null),
      Y(this, 'currentSelectedElementIds', []);
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
            (this.draggedElementShadow = He(t, a, Ge.forceSingleDragShadow)),
              (this.dragTarget = { type: 'existing', nodes: s }),
              (this.positioner = new ze(this.options.store, this.dragTarget));
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
              o = R.isValidElement(t)
                ? e.query.parseReactElement(t).toNodeTree()
                : t;
            } else o = e.query.parseReactElement(n).toNodeTree();
            (this.draggedElementShadow = He(
              t,
              [t.currentTarget],
              Ge.forceSingleDragShadow
            )),
              (this.dragTarget = { type: 'new', tree: o }),
              (this.positioner = new ze(this.options.store, this.dragTarget));
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
                  o && $(o.onCreate) && o.onCreate(t.tree));
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
Y(Ge, 'forceSingleDragShadow', D() && x());
const $e = () => {
    const { indicator: e, indicatorOptions: t, enabled: n } = te((e) => ({
        indicator: e.indicator,
        indicatorOptions: e.options.indicator,
        enabled: e.options.enabled,
      })),
      o = ee();
    if (
      (_(() => {
        o && (n ? o.enable() : o.disable());
      }, [n, o]),
      !e)
    )
      return null;
    const r = (function (e, t, n) {
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
        e.placement,
        T(e.placement.parent.dom),
        e.placement.currentNode && T(e.placement.currentNode.dom),
        t.thickness
      ),
      s = e.error ? t.error : t.success;
    return R.createElement(k, {
      className: t.className,
      style: {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        ...('block' === r.mode
          ? {
              backgroundColor: `${s}08`,
              border: `2px solid ${s}`,
              borderRadius: '6px',
              boxSizing: 'border-box',
              pointerEvents: 'none',
              boxShadow: `0 0 0 4px ${s}10, inset 0 0 20px ${s}15`,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }
          : { backgroundColor: s, borderWidth: 0 }),
        transition: t.transition || '0.2s ease-in',
        ...(t.style ?? {}),
      },
      parentDom: e.placement.parent.dom,
    });
  },
  We = () => {
    const { snapGuides: e, enabled: t } = te((e) => ({
      snapGuides: e.snapGuides || [],
      enabled: e.options.enabled,
    }));
    return t && e && 0 !== e.length
      ? R.createElement(
          R.Fragment,
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
            return R.createElement('div', { key: `snap-guide-${t}`, style: n });
          })
        )
      : null;
  },
  Je = ({ children: e }) => {
    const t = A(Q),
      n = M(() => t.query.getOptions().handlers(t), [t]);
    return n
      ? R.createElement(
          Z.Provider,
          { value: n },
          R.createElement($e, null),
          R.createElement(We, null),
          e
        )
      : null;
  },
  Xe = {
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
        new Ge({
          store: e,
          removeHoverOnMouseleave: !1,
          isMultiSelectEnabled: (e) => !!e.metaKey,
        }),
      normalizeNodes: () => {},
    },
  },
  Ye = {
    methods: (e, t) =>
      K(
        K({}, Te(e, t)),
        {},
        {
          setState(t) {
            const n = U(this, we);
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
  Ve = (e, t) => I(Ye, { ...Xe, options: { ...Xe.options, ...e } }, Ae, t),
  Ke = ({ children: e, ...t }) => {
    void 0 !== t.resolver &&
      G(
        'object' == typeof t.resolver &&
          !Array.isArray(t.resolver) &&
          null !== t.resolver,
        j
      );
    const n = L.useRef(t),
      o = Ve(n.current, (e, t, n, o, r) => {
        if (!n) return;
        const { patches: s, ...d } = n;
        for (let n = 0; n < s.length; n++) {
          const { path: a } = s[n],
            i = a.length > 2 && 'nodes' === a[0] && 'data' === a[2];
          if (
            ([P.IGNORE, P.THROTTLE].includes(d.type) &&
              d.params &&
              (d.type = d.params[0]),
            ['setState', 'deserialize'].includes(d.type) || i)
          ) {
            r((n) => {
              e.options.normalizeNodes && e.options.normalizeNodes(n, t, d, o);
            });
            break;
          }
        }
      });
    return (
      L.useEffect(() => {
        o &&
          void 0 !== t.enabled &&
          o.query.getOptions().enabled !== t.enabled &&
          o.actions.setOptions((e) => {
            e.enabled = t.enabled;
          });
      }, [o, t.enabled]),
      L.useEffect(() => {
        o.subscribe(
          (e) => ({ json: o.query.serialize() }),
          () => {
            o.query.getOptions().onNodesChange(o.query);
          }
        );
      }, [o]),
      o
        ? L.createElement(
            Q.Provider,
            { value: o },
            L.createElement(Je, null, e)
          )
        : null
    );
  },
  Ue = ['events', 'data'],
  Qe = ['nodes'],
  Ze = ['nodes'],
  et = ['_hydrationTimestamp', 'rules'],
  tt = ['_hydrationTimestamp', 'rules'],
  nt = (e) => {
    const {
        events: t,
        data: { nodes: n, linkedNodes: o },
      } = e,
      r = U(e, Ue),
      s = Le(W(e));
    return {
      node: (e = K(
        K(K({}, s), r),
        {},
        { events: K(K({}, s.events), t), dom: e.dom || s.dom }
      )),
      childNodes: n,
      linkedNodes: o,
    };
  },
  ot = (e, t) => {
    const { nodes: n } = t,
      o = U(t, Qe),
      { nodes: r } = e,
      s = U(e, Ze);
    expect(s).toEqual(o);
    const d = Object.keys(n).reduce((e, t) => {
        const o = U(n[t], et);
        return (e[t] = o), e;
      }, {}),
      a = Object.keys(r).reduce((e, t) => {
        const n = U(r[t], tt);
        return (e[t] = n), e;
      }, {});
    expect(a).toEqual(d);
  },
  rt = (e) => {
    const t = {},
      n = (e) => {
        const { node: o, childNodes: r, linkedNodes: s } = nt(e);
        (t[o.id] = o),
          r &&
            r.forEach((e, r) => {
              const { node: s, childNodes: d, linkedNodes: a } = nt(e);
              (s.data.parent = o.id),
                (t[s.id] = s),
                (o.data.nodes[r] = s.id),
                n(
                  K(
                    K({}, s),
                    {},
                    {
                      data: K(
                        K({}, s.data),
                        {},
                        { nodes: d || [], linkedNodes: a || {} }
                      ),
                    }
                  )
                );
            }),
          s &&
            Object.keys(s).forEach((e) => {
              const { node: r, childNodes: d, linkedNodes: a } = nt(s[e]);
              (o.data.linkedNodes[e] = r.id),
                (r.data.parent = o.id),
                (t[r.id] = r),
                n(
                  K(
                    K({}, r),
                    {},
                    {
                      data: K(
                        K({}, r.data),
                        {},
                        { nodes: d || [], linkedNodes: a || {} }
                      ),
                    }
                  )
                );
            });
      };
    return n(e), t;
  },
  st = function () {
    let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    const { nodes: t, events: n } = e;
    return K(
      K(K({}, Xe), e),
      {},
      { nodes: t ? rt(t) : {}, events: K(K({}, Xe.events), n || {}) }
    );
  };
export {
  Ye as ActionMethodsWithConfig,
  Canvas,
  Me as CoreEventHandlers,
  Ge as DefaultEventHandlers,
  _e as DerivedCoreEventHandlers,
  Ke as Editor,
  ue as Element,
  Je as Events,
  me as Frame,
  le as NodeElement,
  Ie as NodeHelpers,
  X as NodeProvider,
  fe as NodeSelectorType,
  ze as Positioner,
  Ae as QueryMethods,
  We as RenderSnapGuides,
  Fe as SnapGuideCalculator,
  Ne as connectEditor,
  Ee as connectNode,
  He as createShadow,
  rt as createTestNodes,
  st as createTestState,
  ce as defaultElementProps,
  he as deprecateCanvasComponent,
  Xe as editorInitialState,
  pe as elementPropToNodeData,
  ot as expectEditorState,
  ke as serializeNode,
  ye as useEditor,
  Ve as useEditorStore,
  ee as useEventHandler,
  se as useNode,
};
//# sourceMappingURL=index.js.map
