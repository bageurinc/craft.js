'undefined' != typeof window &&
  (window.__CRAFTJS__ || (window.__CRAFTJS__ = {}),
  (window.__CRAFTJS__['@craftjs/core'] = '0.2.12'));
import {
  ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT as e,
  useCollector as t,
  wrapConnectorHooks as n,
  ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT as r,
  deprecationWarning as o,
  ERROR_TOP_LEVEL_ELEMENT_NO_ID as s,
  ROOT_NODE as d,
  ERROR_INVALID_NODEID as a,
  ERROR_DELETE_TOP_LEVEL_NODE as i,
  ERROR_NOPARENT as c,
  DEPRECATED_ROOT_NODE as l,
  ERROR_NOT_IN_RESOLVER as p,
  ERROR_INVALID_NODE_ID as u,
  ERROR_MOVE_TOP_LEVEL_NODE as h,
  ERROR_MOVE_NONCANVAS_CHILD as g,
  ERROR_CANNOT_DRAG as f,
  ERROR_MOVE_TO_NONCANVAS_PARENT as m,
  ERROR_MOVE_INCOMING_PARENT as v,
  ERROR_MOVE_CANNOT_DROP as y,
  ERROR_MOVE_TO_DESCENDANT as N,
  ERROR_DUPLICATE_NODEID as E,
  ERROR_MOVE_OUTGOING_PARENT as b,
  getRandomId as O,
  ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER as T,
  getDOMInfo as w,
  EventHandlers as C,
  DerivedEventHandlers as k,
  isChromium as x,
  isLinux as D,
  RenderIndicator as S,
  useMethods as I,
  ERROR_RESOLVER_NOT_AN_OBJECT as j,
  HISTORY_ACTIONS as P,
} from '@craftjs/utils';
export { ROOT_NODE } from '@craftjs/utils';
import * as L from 'react';
import q, {
  createContext as R,
  useContext as A,
  useMemo as _,
  useEffect as F,
  useState as z,
  useRef as M,
  Children as H,
  Fragment as B,
} from 'react';
import $ from 'tiny-invariant';
import W from 'lodash/isFunction';
import J from 'lodash/cloneDeep';
const V = q.createContext(null),
  X = ({ id: e, related: t = !1, children: n }) =>
    q.createElement(V.Provider, { value: { id: e, related: t } }, n);
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
function G(e, t) {
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
function K(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = null != arguments[t] ? arguments[t] : {};
    t % 2
      ? G(Object(n), !0).forEach(function (t) {
          Y(e, t, n[t]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
      : G(Object(n)).forEach(function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
        });
  }
  return e;
}
function U(e, t) {
  if (null == e) return {};
  var n,
    r,
    o = (function (e, t) {
      if (null == e) return {};
      var n = {};
      for (var r in e)
        if ({}.hasOwnProperty.call(e, r)) {
          if (-1 !== t.indexOf(r)) continue;
          n[r] = e[r];
        }
      return n;
    })(e, t);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (r = 0; r < s.length; r++)
      -1 === t.indexOf((n = s[r])) &&
        {}.propertyIsEnumerable.call(e, n) &&
        (o[n] = e[n]);
  }
  return o;
}
const Q = R(null),
  Z = R(null),
  ee = () => A(Z);
function te(r) {
  const o = ee(),
    s = A(Q);
  $(s, e);
  const d = t(s, r),
    a = _(() => o && o.createConnectorsUsage(), [o]);
  F(
    () => (
      a.register(),
      () => {
        a.cleanup();
      }
    ),
    [a]
  );
  const i = _(() => a && n(a.connectors), [a]);
  return K(K({}, d), {}, { connectors: i, inContext: !!s, store: s });
}
const ne = ['actions', 'query', 'connectors'];
function re(e) {
  const t = A(V);
  $(t, r);
  const { id: o, related: s } = t,
    d = te((t) => o && t.nodes[o] && e && e(t.nodes[o])),
    { actions: a, connectors: i } = d,
    c = U(d, ne),
    l = _(
      () => n({ connect: (e) => i.connect(e, o), drag: (e) => i.drag(e, o) }),
      [i, o]
    ),
    p = _(
      () => ({
        setProp: (e, t) => {
          t ? a.history.throttle(t).setProp(o, e) : a.setProp(o, e);
        },
        setCustom: (e, t) => {
          t ? a.history.throttle(t).setCustom(o, e) : a.setCustom(o, e);
        },
        setHidden: (e) => a.setHidden(o, e),
      }),
      [a, o]
    );
  return K(
    K({}, c),
    {},
    { id: o, related: s, inNodeContext: !!t, actions: p, connectors: l }
  );
}
const oe = ['id', 'related', 'actions', 'inNodeContext', 'connectors'];
function se(e) {
  const t = re(e),
    { id: n, related: r, actions: s, inNodeContext: d, connectors: a } = t;
  return K(
    K({}, U(t, oe)),
    {},
    {
      actions: s,
      id: n,
      related: r,
      setProp: (e, t) => (
        o('useNode().setProp()', { suggest: 'useNode().actions.setProp()' }),
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
    return 'string' == typeof e.type ? t(n(q.cloneElement(e))) : e;
  },
  ae = () => {
    const { type: e, props: t, nodes: n, hydrationTimestamp: r } = re((e) => ({
      type: e.data.type,
      props: e.data.props,
      nodes: e.data.nodes,
      hydrationTimestamp: e._hydrationTimestamp,
    }));
    return _(() => {
      let r = t.children;
      n &&
        n.length > 0 &&
        (r = q.createElement(
          q.Fragment,
          null,
          n.map((e) => q.createElement(ce, { id: e, key: e }))
        ));
      const o = q.createElement(e, t, r);
      return 'string' == typeof e ? q.createElement(de, { render: o }) : o;
    }, [e, t, r, n]);
  },
  ie = ({ render: e }) => {
    const { hidden: t } = re((e) => ({ hidden: e.data.hidden })),
      { onRender: n } = te((e) => ({ onRender: e.options.onRender }));
    return t
      ? null
      : q.createElement(n, { render: e || q.createElement(ae, null) });
  },
  ce = ({ id: e, render: t }) =>
    q.createElement(X, { id: e }, q.createElement(ie, { render: t })),
  le = { is: 'div', canvas: !1, custom: {}, hidden: !1 },
  pe = { is: 'type', canvas: 'isCanvas' };
function ue({ id: e, children: t, ...n }) {
  const { is: r } = { ...le, ...n },
    { query: o, actions: d } = te(),
    { id: a, inNodeContext: i } = re(),
    [c] = z(() => {
      $(!!e, s);
      const c = o.node(a).get();
      if (i) {
        const s = c.data.linkedNodes[e]
          ? o.node(c.data.linkedNodes[e]).get()
          : null;
        if (s && s.data.type === r) return s.id;
        const i = q.createElement(ue, n, t),
          l = o.parseReactElement(i).toNodeTree();
        return d.history.ignore().addLinkedNodeFromTree(l, a, e), l.rootNodeId;
      }
      return null;
    });
  return c ? q.createElement(ce, { id: c }) : null;
}
const he = () => o('<Canvas />', { suggest: '<Element canvas={true} />' });
function Canvas({ ...e }) {
  return F(() => he(), []), q.createElement(ue, { ...e, canvas: !0 });
}
const ge = () => {
    const { timestamp: e } = te((e) => ({
      timestamp: e.nodes[d] && e.nodes[d]._hydrationTimestamp,
    }));
    return e ? q.createElement(ce, { id: d, key: e }) : null;
  },
  fe = ({ children: e, json: t, data: n }) => {
    const { actions: r, query: s } = te();
    t && o('<Frame json={...} />', { suggest: '<Frame data={...} />' });
    const a = M(!1);
    if (!a.current) {
      const o = n || t;
      if (o) r.history.ignore().deserialize(o);
      else if (e) {
        const t = q.Children.only(e),
          n = s
            .parseReactElement(t)
            .toNodeTree((e, n) => (n === t && (e.id = d), e));
        r.history.ignore().addNodeTree(n);
      }
      a.current = !0;
    }
    return q.createElement(ge, null);
  };
var me;
!(function (e) {
  (e[(e.Any = 0)] = 'Any'), (e[(e.Id = 1)] = 'Id'), (e[(e.Obj = 2)] = 'Obj');
})(me || (me = {}));
const ve = (e) => {
  const {
    addLinkedNodeFromTree: t,
    setDOM: n,
    setNodeEvent: r,
    replaceNodes: o,
    reset: s,
    ...d
  } = e;
  return d;
};
function ye(e) {
  const { connectors: t, actions: n, query: r, store: o, ...s } = te(e),
    d = ve(n);
  return {
    connectors: t,
    actions: _(
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
    query: r,
    store: o,
    ...s,
  };
}
function Ne(e) {
  return (t) => (n) => {
    const r = e ? ye(e) : ye();
    return q.createElement(t, { ...r, ...n });
  };
}
function Ee(e) {
  return function (t) {
    return (n) => {
      const r = se(e);
      return q.createElement(t, { ...r, ...n });
    };
  };
}
const be = (e) =>
    Object.fromEntries
      ? Object.fromEntries(e)
      : e.reduce((e, t) => {
          let [n, r] = t;
          return K(K({}, e), {}, { [n]: r });
        }, {}),
  Oe = (e, t, n) => {
    const r = Array.isArray(t) ? t : [t],
      o = K({ existOnly: !1, idOnly: !1 }, n || {}),
      s = r
        .filter((e) => !!e)
        .map((t) =>
          'string' == typeof t
            ? { node: e[t], exists: !!e[t] }
            : 'object' != typeof t || o.idOnly
            ? { node: null, exists: !1 }
            : { node: t, exists: !!e[t.id] }
        );
    return o.existOnly && $(0 === s.filter((e) => !e.exists).length, a), s;
  },
  Te = ['history'],
  we = (e, t) => {
    const n = (t, n, o) => {
        const s = (n, r) => {
          const o = t.nodes[n];
          'string' != typeof o.data.type &&
            $(
              e.options.resolver[o.data.name],
              p.replace('%node_type%', ''.concat(o.data.type.name))
            ),
            (e.nodes[n] = K(
              K({}, o),
              {},
              { data: K(K({}, o.data), {}, { parent: r }) }
            )),
            o.data.nodes.length > 0 &&
              (delete e.nodes[n].data.props.children,
              o.data.nodes.forEach((e) => s(e, o.id))),
            Object.values(o.data.linkedNodes).forEach((e) => s(e, o.id));
        };
        if ((s(t.rootNodeId, n), !n && t.rootNodeId === d)) return;
        const a = r(n);
        if ('child' === o.type) {
          const e = o.index;
          return void (null != e
            ? a.data.nodes.splice(e, 0, t.rootNodeId)
            : a.data.nodes.push(t.rootNodeId));
        }
        a.data.linkedNodes[o.id] = t.rootNodeId;
      },
      r = (t) => {
        $(t, c);
        const n = e.nodes[t];
        return $(n, a), n;
      },
      s = (t) => {
        const n = e.nodes[t],
          r = e.nodes[n.data.parent];
        if (
          (n.data.nodes && [...n.data.nodes].forEach((e) => s(e)),
          n.data.linkedNodes &&
            Object.values(n.data.linkedNodes).map((e) => s(e)),
          r.data.nodes.includes(t))
        ) {
          const e = r.data.nodes;
          e.splice(e.indexOf(t), 1);
        } else {
          const e = Object.keys(r.data.linkedNodes).find(
            (e) => r.data.linkedNodes[e] === e
          );
          e && delete r.data.linkedNodes[e];
        }
        ((e, t) => {
          Object.keys(e.events).forEach((n) => {
            const r = e.events[n];
            r &&
              r.has &&
              r.has(t) &&
              (e.events[n] = new Set(Array.from(r).filter((e) => t !== e)));
          });
        })(e, t),
          delete e.nodes[t];
      };
    return {
      addLinkedNodeFromTree(e, t, o) {
        const d = r(t).data.linkedNodes[o];
        d && s(d), n(e, t, { type: 'linked', id: o });
      },
      add(e, t, r) {
        let s = [e];
        Array.isArray(e) &&
          (o('actions.add(node: Node[])', {
            suggest: 'actions.add(node: Node)',
          }),
          (s = e)),
          s.forEach((e) => {
            n({ nodes: { [e.id]: e }, rootNodeId: e.id }, t, {
              type: 'child',
              index: r,
            });
          });
      },
      addNodeTree(e, t, r) {
        n(e, t, { type: 'child', index: r });
      },
      delete(n) {
        Oe(e.nodes, n, { existOnly: !0, idOnly: !0 }).forEach((e) => {
          let { node: n } = e;
          $(!t.node(n.id).isTopLevelNode(), i), s(n.id);
        });
      },
      deserialize(e) {
        const n = 'string' == typeof e ? JSON.parse(e) : e,
          r = Object.keys(n).map((e) => {
            let r = e;
            return (
              e === l && (r = d),
              [r, t.parseSerializedNode(n[e]).toNode((e) => (e.id = r))]
            );
          });
        this.replaceNodes(be(r));
      },
      move(n, r, o) {
        const s = Oe(e.nodes, n, { existOnly: !0 }),
          d = e.nodes[r],
          a = new Set();
        s.forEach((n, s) => {
          let { node: i } = n;
          const c = i.id,
            l = i.data.parent;
          t.node(r).isDroppable([c], (e) => {
            throw new Error(e);
          }),
            e.options.onBeforeMoveEnd(i, d, e.nodes[l]);
          const p = e.nodes[l].data.nodes;
          a.add(p);
          const u = p.indexOf(c);
          (p[u] = '$$'),
            d.data.nodes.splice(o + s, 0, c),
            (e.nodes[c].data.parent = r);
        }),
          a.forEach((e) => {
            const t = e.length;
            [...e].reverse().forEach((n, r) => {
              '$$' === n && e.splice(t - 1 - r, 1);
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
        const r = Oe(e.nodes, n, { idOnly: !0, existOnly: !0 }),
          o = new Set(
            r.map((e) => {
              let { node: t } = e;
              return t.id;
            })
          );
        o.forEach((n) => {
          e.nodes[n].events[t] = !0;
        }),
          (e.events[t] = o);
      },
      setCustom(t, n) {
        Oe(e.nodes, t, { idOnly: !0, existOnly: !0 }).forEach((t) => {
          let { node: r } = t;
          return n(e.nodes[r.id].data.custom);
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
      setHidden(t, n) {
        e.nodes[t].data.hidden = n;
      },
      setProp(t, n) {
        Oe(e.nodes, t, { idOnly: !0, existOnly: !0 }).forEach((t) => {
          let { node: r } = t;
          return n(e.nodes[r.id].data.props);
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
const ke = (e, t) => {
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
    var r;
    return $(n, p.replace('%node_type%', (r = t).name || r.displayName)), n;
  },
  xe = (e, t) => ('string' == typeof e ? e : { resolvedName: ke(t, e) }),
  De = (e, t) => {
    let { type: n, isCanvas: r, props: o } = e;
    return (
      (o = Object.keys(o).reduce((e, n) => {
        const r = o[n];
        return (
          null == r ||
            'function' == typeof r ||
            (e[n] =
              'children' === n && 'string' != typeof r
                ? H.map(r, (e) => ('string' == typeof e ? e : De(e, t)))
                : 'function' == typeof r.type
                ? De(r, t)
                : r),
          e
        );
      }, {})),
      { type: xe(n, t), isCanvas: !!r, props: o }
    );
  },
  Se = (e, t) => {
    const { type: n, props: r, isCanvas: o, name: s, ...d } = e;
    return { ...De({ type: n, isCanvas: o, props: r }, t), ...d };
  };
function Ie(e, t) {
  $('string' == typeof t, u);
  const n = e.nodes[t],
    r = (t) => Ie(e, t);
  return {
    isCanvas: () => !!n.data.isCanvas,
    isRoot: () => n.id === d,
    isLinkedNode: () =>
      n.data.parent && r(n.data.parent).linkedNodes().includes(n.id),
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
        o('query.node(id).isParentOfTopLevelCanvas', {
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
      return (function n(r) {
        let o =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
          s =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        const d = e.nodes[r];
        return d
          ? (o.push(r),
            d.data.parent
              ? ((t || (!t && 0 === s)) && (o = n(d.data.parent, o, s + 1)), o)
              : o)
          : o;
      })(n.data.parent);
    },
    descendants() {
      let n = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
        o = arguments.length > 1 ? arguments[1] : void 0;
      return (function t(s) {
        let d =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
          a =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        return (n || (!n && 0 === a)) && e.nodes[s]
          ? ('childNodes' !== o &&
              r(s)
                .linkedNodes()
                .forEach((e) => {
                  d.push(e), (d = t(e, d, a + 1));
                }),
            'linkedNodes' !== o &&
              r(s)
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
          $(!this.isTopLevelNode(), h),
          $(Ie(e, t.data.parent).isCanvas(), g),
          $(t.rules.canDrag(t, r), f),
          !0
        );
      } catch (e) {
        return t && t(e), !1;
      }
    },
    isDroppable(t, o) {
      const s = Oe(e.nodes, t),
        d = n;
      try {
        $(this.isCanvas(), m),
          $(
            d.rules.canMoveIn(
              s.map((e) => e.node),
              d,
              r
            ),
            v
          );
        const t = {};
        return (
          s.forEach((n) => {
            let { node: o, exists: s } = n;
            if (($(o.rules.canDrop(d, o, r), y), !s)) return;
            $(!r(o.id).isTopLevelNode(), h);
            const a = r(o.id).descendants(!0);
            $(!a.includes(d.id) && d.id !== o.id, N);
            const i = o.data.parent && e.nodes[o.data.parent];
            $(i.data.isCanvas, g),
              $(i || (!i && !e.nodes[o.id]), E),
              i.id !== d.id && (t[i.id] || (t[i.id] = []), t[i.id].push(o));
          }),
          Object.keys(t).forEach((n) => {
            const o = e.nodes[n];
            $(o.rules.canMoveOut(t[n], o, r), b);
          }),
          !0
        );
      } catch (e) {
        return o && o(e), !1;
      }
    },
    toSerializedNode: () => Se(n.data, e.options.resolver),
    toNodeTree(e) {
      const n = [t, ...this.descendants(!0, e)].reduce(
        (e, t) => ((e[t] = r(t).get()), e),
        {}
      );
      return { rootNodeId: t, nodes: n };
    },
    decendants() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return (
        o('query.node(id).decendants', {
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
function je(e, t, n, r) {
  let o = { parent: e, index: 0, where: 'before' },
    s = 0,
    d = 0,
    a = 0,
    i = 0,
    c = 0,
    l = 0,
    p = 0;
  for (let e = 0, u = t.length; e < u; e++) {
    const u = t[e];
    if (
      ((a = u.left + u.outerWidth),
      (p = u.top + u.outerHeight),
      (c = u.left + u.outerWidth / 2),
      (l = u.top + u.outerHeight / 2),
      !((d && u.left > d) || (i && l >= i) || (s && a < s)))
    )
      if (((o.index = e), u.inFlow)) {
        if (r < l) {
          o.where = 'before';
          break;
        }
        o.where = 'after';
      } else
        r < p && (i = p),
          n < c
            ? ((d = c), (o.where = 'before'))
            : ((s = c), (o.where = 'after'));
  }
  return o;
}
const Pe = (e) => ('string' == typeof e ? e : e.name);
function Le(e, t) {
  let n = e.data.type;
  const r = {
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
  if (r.data.type === ue || r.data.type === Canvas) {
    const e = K(K({}, le), r.data.props);
    (r.data.props = Object.keys(r.data.props).reduce(
      (t, n) => (
        Object.keys(le).includes(n)
          ? (r.data[pe[n] || n] = e[n])
          : (t[n] = r.data.props[n]),
        t
      ),
      {}
    )),
      (n = r.data.type),
      (r.data.name = Pe(n)),
      (r.data.displayName = Pe(n)),
      r.data.type === Canvas && ((r.data.isCanvas = !0), he());
  }
  t && t(r);
  const o = n.craft;
  if (o) {
    if (
      ((r.data.displayName = o.displayName || o.name || r.data.displayName),
      (r.data.props = K(K({}, o.props || o.defaultProps || {}), r.data.props)),
      (r.data.custom = K(K({}, o.custom || {}), r.data.custom)),
      null != o.isCanvas && (r.data.isCanvas = o.isCanvas),
      o.rules &&
        Object.keys(o.rules).forEach((e) => {
          ['canDrag', 'canDrop', 'canMoveIn', 'canMoveOut'].includes(e) &&
            (r.rules[e] = o.rules[e]);
        }),
      o.related)
    ) {
      const e = { id: r.id, related: !0 };
      Object.keys(o.related).forEach((t) => {
        r.related[t] = (n) =>
          q.createElement(X, e, q.createElement(o.related[t], n));
      });
    }
    o.info && (r.info = o.info);
  }
  return r;
}
const qe = (e, t, n) => {
    let { type: r, props: o } = e;
    const s = ((e, t) =>
      'object' == typeof e && e.resolvedName
        ? 'Canvas' === e.resolvedName
          ? Canvas
          : t[e.resolvedName]
        : 'string' == typeof e
        ? e
        : null)(r, t);
    if (!s) return;
    (o = Object.keys(o).reduce((e, n) => {
      const r = o[n];
      return (
        (e[n] =
          null == r
            ? null
            : 'object' == typeof r && r.resolvedName
            ? qe(r, t)
            : 'children' === n && Array.isArray(r)
            ? r.map((e) => ('string' == typeof e ? e : qe(e, t)))
            : r),
        e
      );
    }, {})),
      n && (o.key = n);
    const d = { ...q.createElement(s, { ...o }) };
    return { ...d, name: ke(t, d.type) };
  },
  Re = (e, t) => {
    if (t.length < 1) return { [e.id]: e };
    const n = t.map(({ rootNodeId: e }) => e),
      r = { ...e, data: { ...e.data, nodes: n } };
    return t.reduce(
      (t, n) => {
        const r = n.nodes[n.rootNodeId];
        return {
          ...t,
          ...n.nodes,
          [r.id]: { ...r, data: { ...r.data, parent: e.id } },
        };
      },
      { [e.id]: r }
    );
  };
function Ae(e) {
  const t = e && e.options,
    n = () => Ae(e);
  return {
    getDropPlaceholder: (t, r, o, s = (t) => e.nodes[t.id].dom) => {
      const d = e.nodes[r],
        a = n().node(d.id).isCanvas() ? d : e.nodes[d.data.parent];
      if (!a) return;
      const i = a.data.nodes || [],
        c = je(
          a,
          i
            ? i.reduce((t, n) => {
                const r = s(e.nodes[n]);
                if (r) {
                  const e = { id: n, ...w(r) };
                  t.push(e);
                }
                return t;
              }, [])
            : [],
          o.x,
          o.y
        ),
        l = i.length && e.nodes[i[c.index]],
        p = { placement: { ...c, currentNode: l }, error: null };
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
      toNodeTree(r) {
        let o = (function (e, t) {
            let n = e;
            return (
              'string' == typeof n && (n = q.createElement(B, {}, n)),
              Le({ data: { type: n.type, props: { ...n.props } } }, (e) => {
                t && t(e, n);
              })
            );
          })(t, (t, n) => {
            const o = ke(e.options.resolver, t.data.type);
            (t.data.displayName = t.data.displayName || o),
              (t.data.name = o),
              r && r(t, n);
          }),
          s = [];
        return (
          t.props &&
            t.props.children &&
            (s = q.Children.toArray(t.props.children).reduce(
              (e, t) => (
                q.isValidElement(t) &&
                  e.push(n().parseReactElement(t).toNodeTree(r)),
                e
              ),
              []
            )),
          ((e, t) => ({ rootNodeId: e.id, nodes: Re(e, t) }))(o, s)
        );
      },
    }),
    parseSerializedNode: (t) => ({
      toNode(r) {
        const s = ((e, t) => {
          const { type: n, props: r, ...o } = e;
          $(
            (void 0 !== n && 'string' == typeof n) ||
              (void 0 !== n && void 0 !== n.resolvedName),
            T.replace('%displayName%', e.displayName).replace(
              '%availableComponents%',
              Object.keys(t).join(', ')
            )
          );
          const { type: s, name: d, props: a } = qe(e, t),
            {
              parent: i,
              custom: c,
              displayName: l,
              isCanvas: p,
              nodes: u,
              hidden: h,
            } = o;
          return {
            type: s,
            name: d,
            displayName: l || d,
            props: a,
            custom: c || {},
            isCanvas: !!p,
            hidden: !!h,
            parent: i,
            linkedNodes: o.linkedNodes || o._childCanvas || {},
            nodes: u || [],
          };
        })(t, e.options.resolver);
        $(s.type, p);
        const d = 'string' == typeof r && r;
        return (
          d &&
            o('query.parseSerializedNode(...).toNode(id)', {
              suggest:
                'query.parseSerializedNode(...).toNode(node => node.id = id)',
            }),
          n()
            .parseFreshNode({ ...(d ? { id: d } : {}), data: s })
            .toNode(!d && r)
        );
      },
    }),
    parseFreshNode: (t) => ({
      toNode: (n) =>
        Le(t, (t) => {
          t.data.parent === l && (t.data.parent = d);
          const r = ke(e.options.resolver, t.data.type);
          $(null !== r, p),
            (t.data.displayName = t.data.displayName || r),
            (t.data.name = r),
            n && n(t);
        }),
    }),
    createNode(e, t) {
      o(`query.createNode(${e})`, {
        suggest: `query.parseReactElement(${e}).toNodeTree()`,
      });
      const n = this.parseReactElement(e).toNodeTree(),
        r = n.nodes[n.rootNodeId];
      return t
        ? (t.id && (r.id = t.id),
          t.data && (r.data = { ...r.data, ...t.data }),
          r)
        : r;
    },
    getState: () => e,
  };
}
class _e extends C {
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
class Fe extends k {}
const ze = (e) => {
  e.preventDefault();
};
class Me {
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
      (this.onScrollListener = this.onScroll.bind(this)),
      window.addEventListener('scroll', this.onScrollListener, !0),
      window.addEventListener('dragover', ze, !1);
  }
  cleanup() {
    window.removeEventListener('scroll', this.onScrollListener, !0),
      window.removeEventListener('dragover', ze, !1);
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
    const { top: r, bottom: o, left: s, right: d } = e;
    return (
      r + Me.BORDER_OFFSET > n ||
      o - Me.BORDER_OFFSET < n ||
      s + Me.BORDER_OFFSET > t ||
      d - Me.BORDER_OFFSET < t
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
          return n && e.push(K({ id: t }, w(n))), e;
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
    let r = this.getCanvasAncestor(e);
    if (!r) return;
    if (
      ((this.currentDropTargetId = e),
      (this.currentDropTargetCanvasAncestorId = r.id),
      r.data.parent &&
        this.isNearBorders(w(r.dom), t, n) &&
        !this.store.query.node(r.id).isLinkedNode() &&
        (r = this.store.query.node(r.data.parent).get()),
      !r)
    )
      return;
    (this.currentTargetChildDimensions = this.getChildDimensions(r)),
      (this.currentTargetId = r.id);
    const o = je(r, this.currentTargetChildDimensions, t, n);
    if (!this.isDiff(o)) return;
    let s = this.dragError;
    s ||
      this.store.query.node(r.id).isDroppable(
        this.draggedNodes.map((e) => e.node),
        (e) => {
          s = e;
        }
      );
    const d = r.data.nodes[o.index],
      a = d && this.store.query.node(d).get();
    return (
      (this.currentIndicator = {
        placement: K(K({}, o), {}, { currentNode: a }),
        error: s,
      }),
      this.currentIndicator
    );
  }
  getIndicator() {
    return this.currentIndicator;
  }
}
Y(Me, 'BORDER_OFFSET', 10);
const He = function (e, t) {
  if (
    1 === t.length ||
    (arguments.length > 2 && void 0 !== arguments[2] && arguments[2])
  ) {
    const { width: n, height: r } = t[0].getBoundingClientRect(),
      o = t[0].cloneNode(!0);
    return (
      (o.style.position = 'absolute'),
      (o.style.left = '-100%'),
      (o.style.top = '-100%'),
      (o.style.width = ''.concat(n, 'px')),
      (o.style.height = ''.concat(r, 'px')),
      (o.style.pointerEvents = 'none'),
      o.classList.add('drag-shadow'),
      document.body.appendChild(o),
      e.dataTransfer.setDragImage(o, 0, 0),
      o
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
          height: r,
          top: o,
          left: s,
        } = e.getBoundingClientRect(),
        d = e.cloneNode(!0);
      (d.style.position = 'absolute'),
        (d.style.left = ''.concat(s, 'px')),
        (d.style.top = ''.concat(o, 'px')),
        (d.style.width = ''.concat(t, 'px')),
        (d.style.height = ''.concat(r, 'px')),
        d.classList.add('drag-shadow'),
        n.appendChild(d);
    }),
    document.body.appendChild(n),
    e.dataTransfer.setDragImage(n, e.clientX, e.clientY),
    n
  );
};
class Be extends _e {
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
        const r = this.addCraftEventListener(t, 'mousedown', (t) => {
            t.craft.stopPropagation();
            let r = [];
            if (n) {
              const { query: o } = e,
                s = o.getEvent('selected').all();
              (this.options.isMultiSelectEnabled(t) || s.includes(n)) &&
                (r = s.filter((e) => {
                  const t = o.node(e).descendants(!0),
                    r = o.node(e).ancestors(!0);
                  return !t.includes(n) && !r.includes(n);
                })),
                r.includes(n) || r.push(n);
            }
            e.actions.setNodeEvent('selected', r);
          }),
          o = this.addCraftEventListener(t, 'click', (t) => {
            t.craft.stopPropagation();
            const { query: r } = e,
              o = r.getEvent('selected').all(),
              s = this.options.isMultiSelectEnabled(t),
              d = this.currentSelectedElementIds.includes(n);
            let a = [...o];
            s && d
              ? (a.splice(a.indexOf(n), 1),
                e.actions.setNodeEvent('selected', a))
              : !s &&
                o.length > 1 &&
                ((a = [n]), e.actions.setNodeEvent('selected', a)),
              (this.currentSelectedElementIds = a);
          });
        return () => {
          r(), o();
        };
      },
      hover: (t, n) => {
        const r = this.addCraftEventListener(t, 'mouseover', (t) => {
          t.craft.stopPropagation(), e.actions.setNodeEvent('hovered', n);
        });
        let o = null;
        return (
          this.options.removeHoverOnMouseleave &&
            (o = this.addCraftEventListener(t, 'mouseleave', (t) => {
              t.craft.stopPropagation(),
                e.actions.setNodeEvent('hovered', null);
            })),
          () => {
            r(), o && o();
          }
        );
      },
      drop: (t, n) => {
        const r = this.addCraftEventListener(t, 'dragover', (t) => {
            if (
              (t.craft.stopPropagation(), t.preventDefault(), !this.positioner)
            )
              return;
            const r = this.positioner.computeIndicator(n, t.clientX, t.clientY);
            r && e.actions.setIndicator(r);
          }),
          o = this.addCraftEventListener(t, 'dragenter', (e) => {
            e.craft.stopPropagation(), e.preventDefault();
          });
        return () => {
          o(), r();
        };
      },
      drag: (t, n) => {
        if (!e.query.node(n).isDraggable()) return () => {};
        t.setAttribute('draggable', 'true');
        const r = this.addCraftEventListener(t, 'dragstart', (t) => {
            t.craft.stopPropagation();
            const { query: r, actions: o } = e;
            let s = r.getEvent('selected').all();
            const d = this.options.isMultiSelectEnabled(t);
            this.currentSelectedElementIds.includes(n) ||
              ((s = d ? [...s, n] : [n]),
              e.actions.setNodeEvent('selected', s)),
              o.setNodeEvent('dragged', s);
            const a = s.map((e) => r.node(e).get().dom);
            (this.draggedElementShadow = He(t, a, Be.forceSingleDragShadow)),
              (this.dragTarget = { type: 'existing', nodes: s }),
              (this.positioner = new Me(this.options.store, this.dragTarget));
          }),
          o = this.addCraftEventListener(t, 'dragend', (t) => {
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
          t.setAttribute('draggable', 'false'), r(), o();
        };
      },
      create: (t, n, r) => {
        t.setAttribute('draggable', 'true');
        const o = this.addCraftEventListener(t, 'dragstart', (t) => {
            let r;
            if ((t.craft.stopPropagation(), 'function' == typeof n)) {
              const t = n();
              r = q.isValidElement(t)
                ? e.query.parseReactElement(t).toNodeTree()
                : t;
            } else r = e.query.parseReactElement(n).toNodeTree();
            (this.draggedElementShadow = He(
              t,
              [t.currentTarget],
              Be.forceSingleDragShadow
            )),
              (this.dragTarget = { type: 'new', tree: r }),
              (this.positioner = new Me(this.options.store, this.dragTarget));
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
                  r && W(r.onCreate) && r.onCreate(t.tree));
              });
          });
        return () => {
          t.removeAttribute('draggable'), o(), s();
        };
      },
    };
  }
  dropElement(e) {
    const t = this.options.store;
    if (!this.positioner) return;
    const n = this.draggedElementShadow,
      r = this.positioner.getIndicator();
    this.dragTarget && r && !r.error && e(this.dragTarget, r),
      n && (n.parentNode.removeChild(n), (this.draggedElementShadow = null)),
      (this.dragTarget = null),
      t.actions.setIndicator(null),
      t.actions.setNodeEvent('dragged', null),
      this.positioner.cleanup(),
      (this.positioner = null);
  }
}
Y(Be, 'forceSingleDragShadow', x() && D());
const $e = () => {
    const { indicator: e, indicatorOptions: t, enabled: n } = te((e) => ({
        indicator: e.indicator,
        indicatorOptions: e.options.indicator,
        enabled: e.options.enabled,
      })),
      r = ee();
    if (
      (F(() => {
        r && (n ? r.enable() : r.disable());
      }, [n, r]),
      !e)
    )
      return null;
    const o = (function (e, t, n) {
        let r =
            arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 2,
          o = 0,
          s = 0,
          d = 0,
          a = 0,
          i = e.where,
          c = 'line';
        return (
          n
            ? ((c = 'line'),
              n.inFlow
                ? ((d = n.outerWidth),
                  (a = r),
                  (o = 'before' === i ? n.top : n.bottom),
                  (s = n.left))
                : ((d = r),
                  (a = n.outerHeight),
                  (o = n.top),
                  (s = 'before' === i ? n.left : n.left + n.outerWidth)))
            : ((c = 'block'),
              t &&
                ((o = t.top + t.padding.top),
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
            top: ''.concat(o, 'px'),
            left: ''.concat(s, 'px'),
            width: ''.concat(d, 'px'),
            height: ''.concat(a, 'px'),
            mode: c,
          }
        );
      })(
        e.placement,
        w(e.placement.parent.dom),
        e.placement.currentNode && w(e.placement.currentNode.dom),
        t.thickness
      ),
      s = e.error ? t.error : t.success;
    return q.createElement(S, {
      className: t.className,
      style: {
        top: o.top,
        left: o.left,
        width: o.width,
        height: o.height,
        ...('block' === o.mode
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
  We = ({ children: e }) => {
    const t = A(Q),
      n = _(() => t.query.getOptions().handlers(t), [t]);
    return n
      ? q.createElement(Z.Provider, { value: n }, q.createElement($e, null), e)
      : null;
  },
  Je = {
    nodes: {},
    events: { dragged: new Set(), selected: new Set(), hovered: new Set() },
    indicator: null,
    options: {
      onNodesChange: () => null,
      onRender: ({ render: e }) => e,
      onBeforeMoveEnd: () => null,
      resolver: {},
      enabled: !0,
      indicator: { error: 'red', success: 'rgb(98, 196, 98)' },
      handlers: (e) =>
        new Be({
          store: e,
          removeHoverOnMouseleave: !1,
          isMultiSelectEnabled: (e) => !!e.metaKey,
        }),
      normalizeNodes: () => {},
    },
  },
  Ve = {
    methods: (e, t) =>
      K(
        K({}, we(e, t)),
        {},
        {
          setState(t) {
            const n = U(this, Te);
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
  Xe = (e, t) => I(Ve, { ...Je, options: { ...Je.options, ...e } }, Ae, t),
  Ye = ({ children: e, ...t }) => {
    void 0 !== t.resolver &&
      $(
        'object' == typeof t.resolver &&
          !Array.isArray(t.resolver) &&
          null !== t.resolver,
        j
      );
    const n = L.useRef(t),
      r = Xe(n.current, (e, t, n, r, o) => {
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
            o((n) => {
              e.options.normalizeNodes && e.options.normalizeNodes(n, t, d, r);
            });
            break;
          }
        }
      });
    return (
      L.useEffect(() => {
        r &&
          void 0 !== t.enabled &&
          r.query.getOptions().enabled !== t.enabled &&
          r.actions.setOptions((e) => {
            e.enabled = t.enabled;
          });
      }, [r, t.enabled]),
      L.useEffect(() => {
        r.subscribe(
          (e) => ({ json: r.query.serialize() }),
          () => {
            r.query.getOptions().onNodesChange(r.query);
          }
        );
      }, [r]),
      r
        ? L.createElement(
            Q.Provider,
            { value: r },
            L.createElement(We, null, e)
          )
        : null
    );
  },
  Ge = ['events', 'data'],
  Ke = ['nodes'],
  Ue = ['nodes'],
  Qe = ['_hydrationTimestamp', 'rules'],
  Ze = ['_hydrationTimestamp', 'rules'],
  et = (e) => {
    const {
        events: t,
        data: { nodes: n, linkedNodes: r },
      } = e,
      o = U(e, Ge),
      s = Le(J(e));
    return {
      node: (e = K(
        K(K({}, s), o),
        {},
        { events: K(K({}, s.events), t), dom: e.dom || s.dom }
      )),
      childNodes: n,
      linkedNodes: r,
    };
  },
  tt = (e, t) => {
    const { nodes: n } = t,
      r = U(t, Ke),
      { nodes: o } = e,
      s = U(e, Ue);
    expect(s).toEqual(r);
    const d = Object.keys(n).reduce((e, t) => {
        const r = U(n[t], Qe);
        return (e[t] = r), e;
      }, {}),
      a = Object.keys(o).reduce((e, t) => {
        const n = U(o[t], Ze);
        return (e[t] = n), e;
      }, {});
    expect(a).toEqual(d);
  },
  nt = (e) => {
    const t = {},
      n = (e) => {
        const { node: r, childNodes: o, linkedNodes: s } = et(e);
        (t[r.id] = r),
          o &&
            o.forEach((e, o) => {
              const { node: s, childNodes: d, linkedNodes: a } = et(e);
              (s.data.parent = r.id),
                (t[s.id] = s),
                (r.data.nodes[o] = s.id),
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
              const { node: o, childNodes: d, linkedNodes: a } = et(s[e]);
              (r.data.linkedNodes[e] = o.id),
                (o.data.parent = r.id),
                (t[o.id] = o),
                n(
                  K(
                    K({}, o),
                    {},
                    {
                      data: K(
                        K({}, o.data),
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
  rt = function () {
    let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    const { nodes: t, events: n } = e;
    return K(
      K(K({}, Je), e),
      {},
      { nodes: t ? nt(t) : {}, events: K(K({}, Je.events), n || {}) }
    );
  };
export {
  Ve as ActionMethodsWithConfig,
  Canvas,
  _e as CoreEventHandlers,
  Be as DefaultEventHandlers,
  Fe as DerivedCoreEventHandlers,
  Ye as Editor,
  ue as Element,
  We as Events,
  fe as Frame,
  ce as NodeElement,
  Ie as NodeHelpers,
  X as NodeProvider,
  me as NodeSelectorType,
  Me as Positioner,
  Ae as QueryMethods,
  Ne as connectEditor,
  Ee as connectNode,
  He as createShadow,
  nt as createTestNodes,
  rt as createTestState,
  le as defaultElementProps,
  he as deprecateCanvasComponent,
  Je as editorInitialState,
  pe as elementPropToNodeData,
  tt as expectEditorState,
  Se as serializeNode,
  ye as useEditor,
  Xe as useEditorStore,
  ee as useEventHandler,
  se as useNode,
};
//# sourceMappingURL=index.js.map
