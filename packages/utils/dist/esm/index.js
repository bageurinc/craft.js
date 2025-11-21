'undefined' != typeof window &&
  (window.__CRAFTJS__ || (window.__CRAFTJS__ = {}),
  (window.__CRAFTJS__['@craftjs/utils'] = '0.2.5'));
import e, {
  applyPatches as t,
  enableMapSet as n,
  enablePatches as r,
  produceWithPatches as i,
} from 'immer';
import o from 'lodash/isEqualWith';
import s, {
  useMemo as a,
  useRef as c,
  useCallback as l,
  useEffect as d,
  useState as h,
  cloneElement as u,
  isValidElement as p,
} from 'react';
import f from 'shallowequal';
import { nanoid as m } from 'nanoid';
import g from 'tiny-invariant';
import b from 'react-dom';
const y = 'ROOT',
  v = 'canvas-ROOT',
  E = 'Parent id cannot be ommited',
  w = 'Attempting to add a node with duplicated id',
  O = 'Node does not exist, it may have been removed',
  R =
    'A <Element /> that is used inside a User Component must specify an `id` prop, eg: <Element id="text_element">...</Element> ',
  T =
    'Placeholder required placement info (parent, index, or where) is missing',
  C = 'Node cannot be dropped into target parent',
  P = 'Target parent rejects incoming node',
  I = 'Current parent rejects outgoing node',
  D = 'Cannot move node that is not a direct child of a Canvas node',
  H = 'Cannot move node into a non-Canvas parent',
  j = 'A top-level Node cannot be moved',
  A = 'Root Node cannot be moved',
  x = 'Cannot move node into a descendant',
  N =
    'The component type specified for this node (%node_type%) does not exist in the resolver',
  S =
    "The component specified in the <Canvas> `is` prop has additional Canvas specified in it's render template.",
  _ =
    'The node has specified a canDrag() rule that prevents it from being dragged',
  k = 'Invalid parameter Node Id specified',
  L = 'Attempting to delete a top-level Node',
  M =
    'Resolver in <Editor /> has to be an object. For (de)serialization Craft.js needs a list of all the User Components. \n    \nMore info: https://craft.js.org/r/docs/api/editor#props',
  U =
    'An Error occurred while deserializing components: Cannot find component <%displayName% /> in resolver map. Please check your resolver in <Editor />\n\nAvailable components in resolver: %availableComponents%\n\nMore info: https://craft.js.org/r/docs/api/editor#props',
  q =
    'You can only use useEditor in the context of <Editor />. \n\nPlease only use useEditor in components that are children of the <Editor /> component.',
  G =
    'You can only use useNode in the context of <Editor />. \n\nPlease only use useNode in components that are children of the <Editor /> component.';
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
function B(e, t) {
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
function F(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = null != arguments[t] ? arguments[t] : {};
    t % 2
      ? B(Object(n), !0).forEach(function (t) {
          Y(e, t, n[t]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
      : B(Object(n)).forEach(function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
        });
  }
  return e;
}
const W = {
  UNDO: 'HISTORY_UNDO',
  REDO: 'HISTORY_REDO',
  THROTTLE: 'HISTORY_THROTTLE',
  IGNORE: 'HISTORY_IGNORE',
  MERGE: 'HISTORY_MERGE',
  CLEAR: 'HISTORY_CLEAR',
};
class z {
  constructor() {
    Y(this, 'timeline', []), Y(this, 'pointer', -1);
  }
  add(e, t) {
    (0 === e.length && 0 === t.length) ||
      ((this.pointer = this.pointer + 1),
      (this.timeline.length = this.pointer),
      (this.timeline[this.pointer] = {
        patches: e,
        inversePatches: t,
        timestamp: Date.now(),
      }));
  }
  throttleAdd(e, t) {
    let n =
      arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 500;
    if (0 !== e.length || 0 !== t.length) {
      if (this.timeline.length && this.pointer >= 0) {
        const { patches: r, inversePatches: i, timestamp: o } = this.timeline[
          this.pointer
        ];
        if (new Date().getTime() - o < n)
          return void (this.timeline[this.pointer] = {
            timestamp: o,
            patches: [...r, ...e],
            inversePatches: [...t, ...i],
          });
      }
      this.add(e, t);
    }
  }
  merge(e, t) {
    if (0 !== e.length || 0 !== t.length) {
      if (this.timeline.length && this.pointer >= 0) {
        const { patches: n, inversePatches: r, timestamp: i } = this.timeline[
          this.pointer
        ];
        return void (this.timeline[this.pointer] = {
          timestamp: i,
          patches: [...n, ...e],
          inversePatches: [...t, ...r],
        });
      }
      this.add(e, t);
    }
  }
  clear() {
    (this.timeline = []), (this.pointer = -1);
  }
  canUndo() {
    return this.pointer >= 0;
  }
  canRedo() {
    return this.pointer < this.timeline.length - 1;
  }
  undo(e) {
    if (!this.canUndo()) return;
    const { inversePatches: n } = this.timeline[this.pointer];
    return (this.pointer = this.pointer - 1), t(e, n);
  }
  redo(e) {
    if (!this.canRedo()) return;
    this.pointer = this.pointer + 1;
    const { patches: n } = this.timeline[this.pointer];
    return t(e, n);
  }
}
function J(t, n, r, o) {
  const s = a(() => new z(), []);
  let h,
    u = c([]),
    p = c(() => {});
  'function' == typeof t
    ? (h = t)
    : ((h = t.methods),
      (u.current = t.ignoreHistoryForActions),
      (p.current = t.normalizeHistory));
  const f = c(o);
  f.current = o;
  const m = c(n),
    g = a(() => {
      const { current: t } = p,
        { current: n } = u,
        { current: o } = f;
      return (a, c) => {
        const l = r && K(r, () => a, s);
        let d,
          [u, p, f] = i(a, (e) => {
            switch (c.type) {
              case W.UNDO:
                return s.undo(e);
              case W.REDO:
                return s.redo(e);
              case W.CLEAR:
                return s.clear(), F({}, e);
              case W.IGNORE:
              case W.MERGE:
              case W.THROTTLE: {
                const [t, ...n] = c.payload;
                h(e, l)[t](...n);
                break;
              }
              default:
                h(e, l)[c.type](...c.payload);
            }
          });
        return (
          (d = u),
          o &&
            o(u, a, { type: c.type, params: c.payload, patches: p }, l, (e) => {
              let t = i(u, e);
              (d = t[0]), (p = [...p, ...t[1]]), (f = [...t[2], ...f]);
            }),
          [W.UNDO, W.REDO].includes(c.type) && t && (d = e(d, t)),
          [...n, W.UNDO, W.REDO, W.IGNORE, W.CLEAR].includes(c.type) ||
            (c.type === W.THROTTLE
              ? s.throttleAdd(p, f, c.config && c.config.rate)
              : c.type === W.MERGE
              ? s.merge(p, f)
              : s.add(p, f)),
          d
        );
      };
    }, [s, h, r]),
    b = l(() => m.current, []),
    y = a(() => new Q(b), [b]),
    v = l(
      (e) => {
        const t = g(m.current, e);
        (m.current = t), y.notify();
      },
      [g, y]
    );
  d(() => {
    y.notify();
  }, [y]);
  const E = a(() => (r ? K(r, () => m.current, s) : []), [s, r]),
    w = a(() => {
      const e = Object.keys(h(null, null)),
        { current: t } = u;
      return F(
        F(
          {},
          e.reduce(
            (e, t) => (
              (e[t] = function () {
                for (
                  var e = arguments.length, n = new Array(e), r = 0;
                  r < e;
                  r++
                )
                  n[r] = arguments[r];
                return v({ type: t, payload: n });
              }),
              e
            ),
            {}
          )
        ),
        {},
        {
          history: {
            undo: () => v({ type: W.UNDO }),
            redo: () => v({ type: W.REDO }),
            clear: () => v({ type: W.CLEAR }),
            throttle: (n) =>
              F(
                {},
                e
                  .filter((e) => !t.includes(e))
                  .reduce(
                    (e, t) => (
                      (e[t] = function () {
                        for (
                          var e = arguments.length, r = new Array(e), i = 0;
                          i < e;
                          i++
                        )
                          r[i] = arguments[i];
                        return v({
                          type: W.THROTTLE,
                          payload: [t, ...r],
                          config: { rate: n },
                        });
                      }),
                      e
                    ),
                    {}
                  )
              ),
            ignore: () =>
              F(
                {},
                e
                  .filter((e) => !t.includes(e))
                  .reduce(
                    (e, t) => (
                      (e[t] = function () {
                        for (
                          var e = arguments.length, n = new Array(e), r = 0;
                          r < e;
                          r++
                        )
                          n[r] = arguments[r];
                        return v({ type: W.IGNORE, payload: [t, ...n] });
                      }),
                      e
                    ),
                    {}
                  )
              ),
            merge: () =>
              F(
                {},
                e
                  .filter((e) => !t.includes(e))
                  .reduce(
                    (e, t) => (
                      (e[t] = function () {
                        for (
                          var e = arguments.length, n = new Array(e), r = 0;
                          r < e;
                          r++
                        )
                          n[r] = arguments[r];
                        return v({ type: W.MERGE, payload: [t, ...n] });
                      }),
                      e
                    ),
                    {}
                  )
              ),
          },
        }
      );
    }, [v, h]);
  return a(
    () => ({
      getState: b,
      subscribe: (e, t, n) => y.subscribe(e, t, n),
      actions: w,
      query: E,
      history: s,
    }),
    [w, E, y, b, s]
  );
}
function K(e, t, n) {
  const r = Object.keys(e()).reduce(
    (n, r) =>
      F(
        F({}, n),
        {},
        {
          [r]: function () {
            return e(t())[r](...arguments);
          },
        }
      ),
    {}
  );
  return F(
    F({}, r),
    {},
    { history: { canUndo: () => n.canUndo(), canRedo: () => n.canRedo() } }
  );
}
n(), r();
class Q {
  constructor(e) {
    Y(this, 'getState', void 0),
      Y(this, 'subscribers', []),
      (this.getState = e);
  }
  subscribe(e, t, n) {
    const r = new V(() => e(this.getState()), t, n);
    return this.subscribers.push(r), this.unsubscribe.bind(this, r);
  }
  unsubscribe(e) {
    if (this.subscribers.length) {
      const t = this.subscribers.indexOf(e);
      if (t > -1) return this.subscribers.splice(t, 1);
    }
  }
  notify() {
    this.subscribers.forEach((e) => e.collect());
  }
}
class V {
  constructor(e, t) {
    let n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
    Y(this, 'collected', void 0),
      Y(this, 'collector', void 0),
      Y(this, 'onChange', void 0),
      Y(this, 'id', void 0),
      (this.collector = e),
      (this.onChange = t),
      n && this.collect();
  }
  collect() {
    try {
      const e = this.collector();
      o(e, this.collected) ||
        ((this.collected = e), this.onChange && this.onChange(this.collected));
    } catch (e) {
      console.warn(e);
    }
  }
}
const X = (e) => {
  const {
      x: t,
      y: n,
      top: r,
      left: i,
      bottom: o,
      right: s,
      width: a,
      height: c,
    } = e.getBoundingClientRect(),
    l = window.getComputedStyle(e),
    d = {
      left: parseInt(l.marginLeft),
      right: parseInt(l.marginRight),
      bottom: parseInt(l.marginBottom),
      top: parseInt(l.marginTop),
    },
    h = {
      left: parseInt(l.paddingLeft),
      right: parseInt(l.paddingRight),
      bottom: parseInt(l.paddingBottom),
      top: parseInt(l.paddingTop),
    };
  return {
    x: t,
    y: n,
    top: r,
    left: i,
    bottom: o,
    right: s,
    width: a,
    height: c,
    outerWidth: Math.round(a + d.left + d.right),
    outerHeight: Math.round(c + d.top + d.bottom),
    margin: d,
    padding: h,
    inFlow:
      e.parentElement &&
      !!((t) => {
        const n = getComputedStyle(t);
        if (
          !(
            (l.overflow && 'visible' !== l.overflow) ||
            'none' !== n.float ||
            'grid' === n.display ||
            ('flex' === n.display && 'column' !== n['flex-direction'])
          )
        ) {
          switch (l.position) {
            case 'static':
            case 'relative':
              break;
            default:
              return;
          }
          switch (e.tagName) {
            case 'TR':
            case 'TBODY':
            case 'THEAD':
            case 'TFOOT':
              return !0;
          }
          switch (l.display) {
            case 'block':
            case 'list-item':
            case 'table':
            case 'flex':
            case 'grid':
              return !0;
          }
        }
      })(e.parentElement),
  };
};
function Z(e, t) {
  const { subscribe: n, getState: r, actions: i, query: o } = e,
    s = c(!0),
    a = c(null),
    u = c(t);
  u.current = t;
  const p = l((e) => ({ ...e, actions: i, query: o }), [i, o]);
  s.current && t && ((a.current = t(r(), o)), (s.current = !1));
  const [f, m] = h(p(a.current));
  return (
    d(() => {
      let e;
      return (
        u.current &&
          (e = n(
            (e) => u.current(e, o),
            (e) => {
              m(p(e));
            }
          )),
        () => {
          e && e();
        }
      );
    }, [p, o, n]),
    f
  );
}
const $ = function () {
  return m(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10);
};
class ee {
  constructor() {
    Y(this, 'isEnabled', !0),
      Y(this, 'elementIdMap', new WeakMap()),
      Y(this, 'registry', new Map());
  }
  getElementId(e) {
    const t = this.elementIdMap.get(e);
    if (t) return t;
    const n = $();
    return this.elementIdMap.set(e, n), n;
  }
  getConnectorId(e, t) {
    const n = this.getElementId(e);
    return ''.concat(t, '--').concat(n);
  }
  register(e, t) {
    const n = this.getByElement(e, t.name);
    if (n) {
      if (f(t.required, n.required)) return n;
      this.getByElement(e, t.name).disable();
    }
    let r = null;
    const i = this.getConnectorId(e, t.name);
    return (
      this.registry.set(i, {
        id: i,
        required: t.required,
        enable: () => {
          r && r(), (r = t.connector(e, t.required, t.options));
        },
        disable: () => {
          r && r();
        },
        remove: () => this.remove(i),
      }),
      this.isEnabled && this.registry.get(i).enable(),
      this.registry.get(i)
    );
  }
  get(e) {
    return this.registry.get(e);
  }
  remove(e) {
    const t = this.get(e);
    t && (t.disable(), this.registry.delete(t.id));
  }
  enable() {
    (this.isEnabled = !0),
      this.registry.forEach((e) => {
        e.enable();
      });
  }
  disable() {
    (this.isEnabled = !1),
      this.registry.forEach((e) => {
        e.disable();
      });
  }
  getByElement(e, t) {
    return this.get(this.getConnectorId(e, t));
  }
  removeByElement(e, t) {
    return this.remove(this.getConnectorId(e, t));
  }
  clear() {
    this.disable(),
      (this.elementIdMap = new WeakMap()),
      (this.registry = new Map());
  }
}
var te;
!(function (e) {
  (e[(e.HandlerDisabled = 0)] = 'HandlerDisabled'),
    (e[(e.HandlerEnabled = 1)] = 'HandlerEnabled');
})(te || (te = {}));
class ne {
  constructor(e) {
    Y(this, 'options', void 0),
      Y(this, 'registry', new ee()),
      Y(this, 'subscribers', new Set()),
      (this.options = e);
  }
  listen(e) {
    return this.subscribers.add(e), () => this.subscribers.delete(e);
  }
  disable() {
    this.onDisable && this.onDisable(),
      this.registry.disable(),
      this.subscribers.forEach((e) => {
        e(te.HandlerDisabled);
      });
  }
  enable() {
    this.onEnable && this.onEnable(),
      this.registry.enable(),
      this.subscribers.forEach((e) => {
        e(te.HandlerEnabled);
      });
  }
  cleanup() {
    this.disable(), this.subscribers.clear(), this.registry.clear();
  }
  addCraftEventListener(e, t, n, r) {
    const i = (r) => {
      (function (e, t, n) {
        e.craft || (e.craft = { stopPropagation: () => {}, blockedEvents: {} });
        const r = (e.craft && e.craft.blockedEvents[t]) || [];
        for (let e = 0; e < r.length; e++) {
          const t = r[e];
          if (n !== t && n.contains(t)) return !0;
        }
        return !1;
      })(r, t, e) ||
        ((r.craft.stopPropagation = () => {
          r.craft.blockedEvents[t] || (r.craft.blockedEvents[t] = []),
            r.craft.blockedEvents[t].push(e);
        }),
        n(r));
    };
    return e.addEventListener(t, i, r), () => e.removeEventListener(t, i, r);
  }
  createConnectorsUsage() {
    const e = this.handlers(),
      t = new Set();
    let n = !1;
    const r = new Map();
    return {
      connectors: Object.entries(e).reduce((e, i) => {
        let [o, s] = i;
        return F(
          F({}, e),
          {},
          {
            [o]: (e, i, a) => {
              const c = () => {
                const n = this.registry.register(e, {
                  required: i,
                  name: o,
                  options: a,
                  connector: s,
                });
                return t.add(n.id), n;
              };
              return r.set(this.registry.getConnectorId(e, o), c), n && c(), e;
            },
          }
        );
      }, {}),
      register: () => {
        (n = !0),
          r.forEach((e) => {
            e();
          });
      },
      cleanup: () => {
        (n = !1), t.forEach((e) => this.registry.remove(e));
      },
    };
  }
  derive(e, t) {
    return new e(this, t);
  }
  createProxyHandlers(e, t) {
    const n = [],
      r = e.handlers(),
      i = new Proxy(r, {
        get: (e, t, i) =>
          t in r == 0
            ? Reflect.get(e, t, i)
            : function (e) {
                for (
                  var i = arguments.length,
                    o = new Array(i > 1 ? i - 1 : 0),
                    s = 1;
                  s < i;
                  s++
                )
                  o[s - 1] = arguments[s];
                const a = r[t](e, ...o);
                a && n.push(a);
              },
      });
    return (
      t(i),
      () => {
        n.forEach((e) => {
          e();
        });
      }
    );
  }
  reflect(e) {
    return this.createProxyHandlers(this, e);
  }
}
class re extends ne {
  constructor(e, t) {
    super(t),
      Y(this, 'derived', void 0),
      Y(this, 'unsubscribeParentHandlerListener', void 0),
      (this.derived = e),
      (this.options = t),
      (this.unsubscribeParentHandlerListener = this.derived.listen((e) => {
        switch (e) {
          case te.HandlerEnabled:
            return this.enable();
          case te.HandlerDisabled:
            return this.disable();
          default:
            return;
        }
      }));
  }
  inherit(e) {
    return this.createProxyHandlers(this.derived, e);
  }
  cleanup() {
    super.cleanup(), this.unsubscribeParentHandlerListener();
  }
}
function ie(e, t) {
  t && ('function' == typeof e ? e(t) : (e.current = t));
}
function oe(e, t) {
  const n = e.ref;
  return (
    g(
      'string' != typeof n,
      'Cannot connect to an element with an existing string ref. Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute'
    ),
    u(
      e,
      n
        ? {
            ref: (e) => {
              ie(n, e), ie(t, e);
            },
          }
        : { ref: t }
    )
  );
}
function se(e) {
  return (t = null, ...n) => {
    if (!p(t)) {
      if (!t) return;
      const r = t;
      return r && e(r, ...n), r;
    }
    const r = t;
    return (
      (function (e) {
        if ('string' != typeof e.type) throw new Error();
      })(r),
      oe(r, e)
    );
  };
}
function ae(e) {
  return Object.keys(e).reduce(
    (t, n) => ((t[n] = se((...t) => e[n](...t))), t),
    {}
  );
}
const ce = ({ style: e, className: t, parentDom: n }) => {
    const r = s.createElement('div', {
      className: t,
      style: {
        position: 'fixed',
        display: 'block',
        opacity: 1,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'transparent',
        zIndex: 99999,
        ...e,
      },
    });
    return n && n.ownerDocument !== document
      ? b.createPortal(r, n.ownerDocument.body)
      : r;
  },
  le = (e) => {
    d(e, []);
  },
  de = (e, t) => {
    let n = 'Deprecation warning: '.concat(
      e,
      ' will be deprecated in future relases.'
    );
    const { suggest: r, doc: i } = t;
    r && (n += ' Please use '.concat(r, ' instead.')),
      i && (n += '('.concat(i, ')')),
      console.warn(n);
  },
  he = () => 'undefined' != typeof window,
  ue = () => he() && /Linux/i.test(window.navigator.userAgent),
  pe = () => he() && /Chrome/i.test(window.navigator.userAgent);
export {
  v as DEPRECATED_ROOT_NODE,
  re as DerivedEventHandlers,
  _ as ERROR_CANNOT_DRAG,
  L as ERROR_DELETE_TOP_LEVEL_NODE,
  U as ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER,
  w as ERROR_DUPLICATE_NODEID,
  S as ERROR_INFINITE_CANVAS,
  O as ERROR_INVALID_NODEID,
  k as ERROR_INVALID_NODE_ID,
  T as ERROR_MISSING_PLACEHOLDER_PLACEMENT,
  C as ERROR_MOVE_CANNOT_DROP,
  P as ERROR_MOVE_INCOMING_PARENT,
  D as ERROR_MOVE_NONCANVAS_CHILD,
  I as ERROR_MOVE_OUTGOING_PARENT,
  A as ERROR_MOVE_ROOT_NODE,
  j as ERROR_MOVE_TOP_LEVEL_NODE,
  x as ERROR_MOVE_TO_DESCENDANT,
  H as ERROR_MOVE_TO_NONCANVAS_PARENT,
  E as ERROR_NOPARENT,
  N as ERROR_NOT_IN_RESOLVER,
  M as ERROR_RESOLVER_NOT_AN_OBJECT,
  R as ERROR_TOP_LEVEL_ELEMENT_NO_ID,
  q as ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT,
  G as ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT,
  te as EventHandlerUpdates,
  ne as EventHandlers,
  W as HISTORY_ACTIONS,
  z as History,
  y as ROOT_NODE,
  ce as RenderIndicator,
  oe as cloneWithRef,
  K as createQuery,
  de as deprecationWarning,
  X as getDOMInfo,
  $ as getRandomId,
  pe as isChromium,
  he as isClientSide,
  ue as isLinux,
  Z as useCollector,
  le as useEffectOnce,
  J as useMethods,
  ae as wrapConnectorHooks,
  se as wrapHookToRecognizeElement,
};
//# sourceMappingURL=index.js.map
