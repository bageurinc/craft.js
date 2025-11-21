'use strict';
'undefined' != typeof window &&
  (window.__CRAFTJS__ || (window.__CRAFTJS__ = {}),
  (window.__CRAFTJS__['@craftjs/utils'] = '0.2.5')),
  Object.defineProperty(exports, '__esModule', { value: !0 });
var e = require('immer'),
  t = require('lodash/isEqualWith'),
  r = require('react'),
  n = require('shallowequal'),
  s = require('nanoid'),
  i = require('tiny-invariant'),
  o = require('react-dom');
function a(e) {
  return e && 'object' == typeof e && 'default' in e ? e : { default: e };
}
var c = a(e),
  l = a(t),
  d = a(r),
  u = a(n),
  p = a(i),
  h = a(o);
function E(e, t, r) {
  return (
    (t = (function (e) {
      var t = (function (e) {
        if ('object' != typeof e || !e) return e;
        var t = e[Symbol.toPrimitive];
        if (void 0 !== t) {
          var r = t.call(e, 'string');
          if ('object' != typeof r) return r;
          throw new TypeError('@@toPrimitive must return a primitive value.');
        }
        return String(e);
      })(e);
      return 'symbol' == typeof t ? t : t + '';
    })(t)) in e
      ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = r),
    e
  );
}
function f(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t &&
      (n = n.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable;
      })),
      r.push.apply(r, n);
  }
  return r;
}
function g(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = null != arguments[t] ? arguments[t] : {};
    t % 2
      ? f(Object(r), !0).forEach(function (t) {
          E(e, t, r[t]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
      : f(Object(r)).forEach(function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
        });
  }
  return e;
}
const R = {
  UNDO: 'HISTORY_UNDO',
  REDO: 'HISTORY_REDO',
  THROTTLE: 'HISTORY_THROTTLE',
  IGNORE: 'HISTORY_IGNORE',
  MERGE: 'HISTORY_MERGE',
  CLEAR: 'HISTORY_CLEAR',
};
class b {
  constructor() {
    E(this, 'timeline', []), E(this, 'pointer', -1);
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
    let r =
      arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 500;
    if (0 !== e.length || 0 !== t.length) {
      if (this.timeline.length && this.pointer >= 0) {
        const { patches: n, inversePatches: s, timestamp: i } = this.timeline[
          this.pointer
        ];
        if (new Date().getTime() - i < r)
          return void (this.timeline[this.pointer] = {
            timestamp: i,
            patches: [...n, ...e],
            inversePatches: [...t, ...s],
          });
      }
      this.add(e, t);
    }
  }
  merge(e, t) {
    if (0 !== e.length || 0 !== t.length) {
      if (this.timeline.length && this.pointer >= 0) {
        const { patches: r, inversePatches: n, timestamp: s } = this.timeline[
          this.pointer
        ];
        return void (this.timeline[this.pointer] = {
          timestamp: s,
          patches: [...r, ...e],
          inversePatches: [...t, ...n],
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
  undo(t) {
    if (!this.canUndo()) return;
    const { inversePatches: r } = this.timeline[this.pointer];
    return (this.pointer = this.pointer - 1), e.applyPatches(t, r);
  }
  redo(t) {
    if (!this.canRedo()) return;
    this.pointer = this.pointer + 1;
    const { patches: r } = this.timeline[this.pointer];
    return e.applyPatches(t, r);
  }
}
function m(e, t, r) {
  const n = Object.keys(e()).reduce(
    (r, n) =>
      g(
        g({}, r),
        {},
        {
          [n]: function () {
            return e(t())[n](...arguments);
          },
        }
      ),
    {}
  );
  return g(
    g({}, n),
    {},
    { history: { canUndo: () => r.canUndo(), canRedo: () => r.canRedo() } }
  );
}
e.enableMapSet(), e.enablePatches();
class O {
  constructor(e) {
    E(this, 'getState', void 0),
      E(this, 'subscribers', []),
      (this.getState = e);
  }
  subscribe(e, t, r) {
    const n = new y(() => e(this.getState()), t, r);
    return this.subscribers.push(n), this.unsubscribe.bind(this, n);
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
class y {
  constructor(e, t) {
    let r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
    E(this, 'collected', void 0),
      E(this, 'collector', void 0),
      E(this, 'onChange', void 0),
      E(this, 'id', void 0),
      (this.collector = e),
      (this.onChange = t),
      r && this.collect();
  }
  collect() {
    try {
      const e = this.collector();
      l.default(e, this.collected) ||
        ((this.collected = e), this.onChange && this.onChange(this.collected));
    } catch (e) {
      console.warn(e);
    }
  }
}
const v = function () {
  return s.nanoid(
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10
  );
};
class _ {
  constructor() {
    E(this, 'isEnabled', !0),
      E(this, 'elementIdMap', new WeakMap()),
      E(this, 'registry', new Map());
  }
  getElementId(e) {
    const t = this.elementIdMap.get(e);
    if (t) return t;
    const r = v();
    return this.elementIdMap.set(e, r), r;
  }
  getConnectorId(e, t) {
    const r = this.getElementId(e);
    return ''.concat(t, '--').concat(r);
  }
  register(e, t) {
    const r = this.getByElement(e, t.name);
    if (r) {
      if (u.default(t.required, r.required)) return r;
      this.getByElement(e, t.name).disable();
    }
    let n = null;
    const s = this.getConnectorId(e, t.name);
    return (
      this.registry.set(s, {
        id: s,
        required: t.required,
        enable: () => {
          n && n(), (n = t.connector(e, t.required, t.options));
        },
        disable: () => {
          n && n();
        },
        remove: () => this.remove(s),
      }),
      this.isEnabled && this.registry.get(s).enable(),
      this.registry.get(s)
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
var T;
(exports.EventHandlerUpdates = void 0),
  ((T = exports.EventHandlerUpdates || (exports.EventHandlerUpdates = {}))[
    (T.HandlerDisabled = 0)
  ] = 'HandlerDisabled'),
  (T[(T.HandlerEnabled = 1)] = 'HandlerEnabled');
class x {
  constructor(e) {
    E(this, 'options', void 0),
      E(this, 'registry', new _()),
      E(this, 'subscribers', new Set()),
      (this.options = e);
  }
  listen(e) {
    return this.subscribers.add(e), () => this.subscribers.delete(e);
  }
  disable() {
    this.onDisable && this.onDisable(),
      this.registry.disable(),
      this.subscribers.forEach((e) => {
        e(exports.EventHandlerUpdates.HandlerDisabled);
      });
  }
  enable() {
    this.onEnable && this.onEnable(),
      this.registry.enable(),
      this.subscribers.forEach((e) => {
        e(exports.EventHandlerUpdates.HandlerEnabled);
      });
  }
  cleanup() {
    this.disable(), this.subscribers.clear(), this.registry.clear();
  }
  addCraftEventListener(e, t, r, n) {
    const s = (n) => {
      (function (e, t, r) {
        e.craft || (e.craft = { stopPropagation: () => {}, blockedEvents: {} });
        const n = (e.craft && e.craft.blockedEvents[t]) || [];
        for (let e = 0; e < n.length; e++) {
          const t = n[e];
          if (r !== t && r.contains(t)) return !0;
        }
        return !1;
      })(n, t, e) ||
        ((n.craft.stopPropagation = () => {
          n.craft.blockedEvents[t] || (n.craft.blockedEvents[t] = []),
            n.craft.blockedEvents[t].push(e);
        }),
        r(n));
    };
    return e.addEventListener(t, s, n), () => e.removeEventListener(t, s, n);
  }
  createConnectorsUsage() {
    const e = this.handlers(),
      t = new Set();
    let r = !1;
    const n = new Map();
    return {
      connectors: Object.entries(e).reduce((e, s) => {
        let [i, o] = s;
        return g(
          g({}, e),
          {},
          {
            [i]: (e, s, a) => {
              const c = () => {
                const r = this.registry.register(e, {
                  required: s,
                  name: i,
                  options: a,
                  connector: o,
                });
                return t.add(r.id), r;
              };
              return n.set(this.registry.getConnectorId(e, i), c), r && c(), e;
            },
          }
        );
      }, {}),
      register: () => {
        (r = !0),
          n.forEach((e) => {
            e();
          });
      },
      cleanup: () => {
        (r = !1), t.forEach((e) => this.registry.remove(e));
      },
    };
  }
  derive(e, t) {
    return new e(this, t);
  }
  createProxyHandlers(e, t) {
    const r = [],
      n = e.handlers(),
      s = new Proxy(n, {
        get: (e, t, s) =>
          t in n == 0
            ? Reflect.get(e, t, s)
            : function (e) {
                for (
                  var s = arguments.length,
                    i = new Array(s > 1 ? s - 1 : 0),
                    o = 1;
                  o < s;
                  o++
                )
                  i[o - 1] = arguments[o];
                const a = n[t](e, ...i);
                a && r.push(a);
              },
      });
    return (
      t(s),
      () => {
        r.forEach((e) => {
          e();
        });
      }
    );
  }
  reflect(e) {
    return this.createProxyHandlers(this, e);
  }
}
function N(e, t) {
  t && ('function' == typeof e ? e(t) : (e.current = t));
}
function w(e, t) {
  const n = e.ref;
  return (
    p.default(
      'string' != typeof n,
      'Cannot connect to an element with an existing string ref. Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute'
    ),
    r.cloneElement(
      e,
      n
        ? {
            ref: (e) => {
              N(n, e), N(t, e);
            },
          }
        : { ref: t }
    )
  );
}
function I(e) {
  return (t = null, ...n) => {
    if (!r.isValidElement(t)) {
      if (!t) return;
      const r = t;
      return r && e(r, ...n), r;
    }
    const s = t;
    return (
      (function (e) {
        if ('string' != typeof e.type) throw new Error();
      })(s),
      w(s, e)
    );
  };
}
const D = () => 'undefined' != typeof window;
(exports.DEPRECATED_ROOT_NODE = 'canvas-ROOT'),
  (exports.DerivedEventHandlers = class extends x {
    constructor(e, t) {
      super(t),
        E(this, 'derived', void 0),
        E(this, 'unsubscribeParentHandlerListener', void 0),
        (this.derived = e),
        (this.options = t),
        (this.unsubscribeParentHandlerListener = this.derived.listen((e) => {
          switch (e) {
            case exports.EventHandlerUpdates.HandlerEnabled:
              return this.enable();
            case exports.EventHandlerUpdates.HandlerDisabled:
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
  }),
  (exports.ERROR_CANNOT_DRAG =
    'The node has specified a canDrag() rule that prevents it from being dragged'),
  (exports.ERROR_DELETE_TOP_LEVEL_NODE =
    'Attempting to delete a top-level Node'),
  (exports.ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER =
    'An Error occurred while deserializing components: Cannot find component <%displayName% /> in resolver map. Please check your resolver in <Editor />\n\nAvailable components in resolver: %availableComponents%\n\nMore info: https://craft.js.org/r/docs/api/editor#props'),
  (exports.ERROR_DUPLICATE_NODEID =
    'Attempting to add a node with duplicated id'),
  (exports.ERROR_INFINITE_CANVAS =
    "The component specified in the <Canvas> `is` prop has additional Canvas specified in it's render template."),
  (exports.ERROR_INVALID_NODEID =
    'Node does not exist, it may have been removed'),
  (exports.ERROR_INVALID_NODE_ID = 'Invalid parameter Node Id specified'),
  (exports.ERROR_MISSING_PLACEHOLDER_PLACEMENT =
    'Placeholder required placement info (parent, index, or where) is missing'),
  (exports.ERROR_MOVE_CANNOT_DROP =
    'Node cannot be dropped into target parent'),
  (exports.ERROR_MOVE_INCOMING_PARENT = 'Target parent rejects incoming node'),
  (exports.ERROR_MOVE_NONCANVAS_CHILD =
    'Cannot move node that is not a direct child of a Canvas node'),
  (exports.ERROR_MOVE_OUTGOING_PARENT = 'Current parent rejects outgoing node'),
  (exports.ERROR_MOVE_ROOT_NODE = 'Root Node cannot be moved'),
  (exports.ERROR_MOVE_TOP_LEVEL_NODE = 'A top-level Node cannot be moved'),
  (exports.ERROR_MOVE_TO_DESCENDANT = 'Cannot move node into a descendant'),
  (exports.ERROR_MOVE_TO_NONCANVAS_PARENT =
    'Cannot move node into a non-Canvas parent'),
  (exports.ERROR_NOPARENT = 'Parent id cannot be ommited'),
  (exports.ERROR_NOT_IN_RESOLVER =
    'The component type specified for this node (%node_type%) does not exist in the resolver'),
  (exports.ERROR_RESOLVER_NOT_AN_OBJECT =
    'Resolver in <Editor /> has to be an object. For (de)serialization Craft.js needs a list of all the User Components. \n    \nMore info: https://craft.js.org/r/docs/api/editor#props'),
  (exports.ERROR_TOP_LEVEL_ELEMENT_NO_ID =
    'A <Element /> that is used inside a User Component must specify an `id` prop, eg: <Element id="text_element">...</Element> '),
  (exports.ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT =
    'You can only use useEditor in the context of <Editor />. \n\nPlease only use useEditor in components that are children of the <Editor /> component.'),
  (exports.ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT =
    'You can only use useNode in the context of <Editor />. \n\nPlease only use useNode in components that are children of the <Editor /> component.'),
  (exports.EventHandlers = x),
  (exports.HISTORY_ACTIONS = R),
  (exports.History = b),
  (exports.ROOT_NODE = 'ROOT'),
  (exports.RenderIndicator = ({ style: e, className: t, parentDom: r }) => {
    const n = d.default.createElement('div', {
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
    return r && r.ownerDocument !== document
      ? h.default.createPortal(n, r.ownerDocument.body)
      : n;
  }),
  (exports.cloneWithRef = w),
  (exports.createQuery = m),
  (exports.deprecationWarning = (e, t) => {
    let r = 'Deprecation warning: '.concat(
      e,
      ' will be deprecated in future relases.'
    );
    const { suggest: n, doc: s } = t;
    n && (r += ' Please use '.concat(n, ' instead.')),
      s && (r += '('.concat(s, ')')),
      console.warn(r);
  }),
  (exports.getDOMInfo = (e) => {
    const {
        x: t,
        y: r,
        top: n,
        left: s,
        bottom: i,
        right: o,
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
      u = {
        left: parseInt(l.paddingLeft),
        right: parseInt(l.paddingRight),
        bottom: parseInt(l.paddingBottom),
        top: parseInt(l.paddingTop),
      };
    return {
      x: t,
      y: r,
      top: n,
      left: s,
      bottom: i,
      right: o,
      width: a,
      height: c,
      outerWidth: Math.round(a + d.left + d.right),
      outerHeight: Math.round(c + d.top + d.bottom),
      margin: d,
      padding: u,
      inFlow:
        e.parentElement &&
        !!((t) => {
          const r = getComputedStyle(t);
          if (
            !(
              (l.overflow && 'visible' !== l.overflow) ||
              'none' !== r.float ||
              'grid' === r.display ||
              ('flex' === r.display && 'column' !== r['flex-direction'])
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
  }),
  (exports.getRandomId = v),
  (exports.isChromium = () =>
    D() && /Chrome/i.test(window.navigator.userAgent)),
  (exports.isClientSide = D),
  (exports.isLinux = () => D() && /Linux/i.test(window.navigator.userAgent)),
  (exports.useCollector = function (e, t) {
    const { subscribe: n, getState: s, actions: i, query: o } = e,
      a = r.useRef(!0),
      c = r.useRef(null),
      l = r.useRef(t);
    l.current = t;
    const d = r.useCallback((e) => ({ ...e, actions: i, query: o }), [i, o]);
    a.current && t && ((c.current = t(s(), o)), (a.current = !1));
    const [u, p] = r.useState(d(c.current));
    return (
      r.useEffect(() => {
        let e;
        return (
          l.current &&
            (e = n(
              (e) => l.current(e, o),
              (e) => {
                p(d(e));
              }
            )),
          () => {
            e && e();
          }
        );
      }, [d, o, n]),
      u
    );
  }),
  (exports.useEffectOnce = (e) => {
    r.useEffect(e, []);
  }),
  (exports.useMethods = function (t, n, s, i) {
    const o = r.useMemo(() => new b(), []);
    let a,
      l = r.useRef([]),
      d = r.useRef(() => {});
    'function' == typeof t
      ? (a = t)
      : ((a = t.methods),
        (l.current = t.ignoreHistoryForActions),
        (d.current = t.normalizeHistory));
    const u = r.useRef(i);
    u.current = i;
    const p = r.useRef(n),
      h = r.useMemo(() => {
        const { current: t } = d,
          { current: r } = l,
          { current: n } = u;
        return (i, l) => {
          const d = s && m(s, () => i, o);
          let u,
            [p, h, E] = e.produceWithPatches(i, (e) => {
              switch (l.type) {
                case R.UNDO:
                  return o.undo(e);
                case R.REDO:
                  return o.redo(e);
                case R.CLEAR:
                  return o.clear(), g({}, e);
                case R.IGNORE:
                case R.MERGE:
                case R.THROTTLE: {
                  const [t, ...r] = l.payload;
                  a(e, d)[t](...r);
                  break;
                }
                default:
                  a(e, d)[l.type](...l.payload);
              }
            });
          return (
            (u = p),
            n &&
              n(
                p,
                i,
                { type: l.type, params: l.payload, patches: h },
                d,
                (t) => {
                  let r = e.produceWithPatches(p, t);
                  (u = r[0]), (h = [...h, ...r[1]]), (E = [...r[2], ...E]);
                }
              ),
            [R.UNDO, R.REDO].includes(l.type) && t && (u = c.default(u, t)),
            [...r, R.UNDO, R.REDO, R.IGNORE, R.CLEAR].includes(l.type) ||
              (l.type === R.THROTTLE
                ? o.throttleAdd(h, E, l.config && l.config.rate)
                : l.type === R.MERGE
                ? o.merge(h, E)
                : o.add(h, E)),
            u
          );
        };
      }, [o, a, s]),
      E = r.useCallback(() => p.current, []),
      f = r.useMemo(() => new O(E), [E]),
      y = r.useCallback(
        (e) => {
          const t = h(p.current, e);
          (p.current = t), f.notify();
        },
        [h, f]
      );
    r.useEffect(() => {
      f.notify();
    }, [f]);
    const v = r.useMemo(() => (s ? m(s, () => p.current, o) : []), [o, s]),
      _ = r.useMemo(() => {
        const e = Object.keys(a(null, null)),
          { current: t } = l;
        return g(
          g(
            {},
            e.reduce(
              (e, t) => (
                (e[t] = function () {
                  for (
                    var e = arguments.length, r = new Array(e), n = 0;
                    n < e;
                    n++
                  )
                    r[n] = arguments[n];
                  return y({ type: t, payload: r });
                }),
                e
              ),
              {}
            )
          ),
          {},
          {
            history: {
              undo: () => y({ type: R.UNDO }),
              redo: () => y({ type: R.REDO }),
              clear: () => y({ type: R.CLEAR }),
              throttle: (r) =>
                g(
                  {},
                  e
                    .filter((e) => !t.includes(e))
                    .reduce(
                      (e, t) => (
                        (e[t] = function () {
                          for (
                            var e = arguments.length, n = new Array(e), s = 0;
                            s < e;
                            s++
                          )
                            n[s] = arguments[s];
                          return y({
                            type: R.THROTTLE,
                            payload: [t, ...n],
                            config: { rate: r },
                          });
                        }),
                        e
                      ),
                      {}
                    )
                ),
              ignore: () =>
                g(
                  {},
                  e
                    .filter((e) => !t.includes(e))
                    .reduce(
                      (e, t) => (
                        (e[t] = function () {
                          for (
                            var e = arguments.length, r = new Array(e), n = 0;
                            n < e;
                            n++
                          )
                            r[n] = arguments[n];
                          return y({ type: R.IGNORE, payload: [t, ...r] });
                        }),
                        e
                      ),
                      {}
                    )
                ),
              merge: () =>
                g(
                  {},
                  e
                    .filter((e) => !t.includes(e))
                    .reduce(
                      (e, t) => (
                        (e[t] = function () {
                          for (
                            var e = arguments.length, r = new Array(e), n = 0;
                            n < e;
                            n++
                          )
                            r[n] = arguments[n];
                          return y({ type: R.MERGE, payload: [t, ...r] });
                        }),
                        e
                      ),
                      {}
                    )
                ),
            },
          }
        );
      }, [y, a]);
    return r.useMemo(
      () => ({
        getState: E,
        subscribe: (e, t, r) => f.subscribe(e, t, r),
        actions: _,
        query: v,
        history: o,
      }),
      [_, v, f, E, o]
    );
  }),
  (exports.wrapConnectorHooks = function (e) {
    return Object.keys(e).reduce(
      (t, r) => ((t[r] = I((...t) => e[r](...t))), t),
      {}
    );
  }),
  (exports.wrapHookToRecognizeElement = I);
//# sourceMappingURL=index.js.map
