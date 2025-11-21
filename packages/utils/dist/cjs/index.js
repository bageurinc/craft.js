'use strict';

if (typeof window !== 'undefined') {
  if (!window['__CRAFTJS__']) {
    window['__CRAFTJS__'] = {};
  }

  window['__CRAFTJS__']['@craftjs/utils'] = '0.2.5';
}

Object.defineProperty(exports, '__esModule', { value: true });

var produce = require('immer');
var isEqualWith = require('lodash/isEqualWith');
var React = require('react');
var isEqual = require('shallowequal');
var nanoid = require('nanoid');
var invariant = require('tiny-invariant');
var ReactDOM = require('react-dom');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e };
}

var produce__default = /*#__PURE__*/ _interopDefaultLegacy(produce);
var isEqualWith__default = /*#__PURE__*/ _interopDefaultLegacy(isEqualWith);
var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);
var isEqual__default = /*#__PURE__*/ _interopDefaultLegacy(isEqual);
var invariant__default = /*#__PURE__*/ _interopDefaultLegacy(invariant);
var ReactDOM__default = /*#__PURE__*/ _interopDefaultLegacy(ReactDOM);

const ROOT_NODE = 'ROOT';
const DEPRECATED_ROOT_NODE = 'canvas-ROOT';
// TODO: Use a better way to store/display error messages
const ERROR_NOPARENT = 'Parent id cannot be ommited';
const ERROR_DUPLICATE_NODEID = 'Attempting to add a node with duplicated id';
const ERROR_INVALID_NODEID = 'Node does not exist, it may have been removed';
const ERROR_TOP_LEVEL_ELEMENT_NO_ID =
  'A <Element /> that is used inside a User Component must specify an `id` prop, eg: <Element id="text_element">...</Element> ';
const ERROR_MISSING_PLACEHOLDER_PLACEMENT =
  'Placeholder required placement info (parent, index, or where) is missing';
const ERROR_MOVE_CANNOT_DROP = 'Node cannot be dropped into target parent';
const ERROR_MOVE_INCOMING_PARENT = 'Target parent rejects incoming node';
const ERROR_MOVE_OUTGOING_PARENT = 'Current parent rejects outgoing node';
const ERROR_MOVE_NONCANVAS_CHILD =
  'Cannot move node that is not a direct child of a Canvas node';
const ERROR_MOVE_TO_NONCANVAS_PARENT =
  'Cannot move node into a non-Canvas parent';
const ERROR_MOVE_TOP_LEVEL_NODE = 'A top-level Node cannot be moved';
const ERROR_MOVE_ROOT_NODE = 'Root Node cannot be moved';
const ERROR_MOVE_TO_DESCENDANT = 'Cannot move node into a descendant';
const ERROR_NOT_IN_RESOLVER =
  'The component type specified for this node (%node_type%) does not exist in the resolver';
const ERROR_INFINITE_CANVAS =
  "The component specified in the <Canvas> `is` prop has additional Canvas specified in it's render template.";
const ERROR_CANNOT_DRAG =
  'The node has specified a canDrag() rule that prevents it from being dragged';
const ERROR_INVALID_NODE_ID = 'Invalid parameter Node Id specified';
const ERROR_DELETE_TOP_LEVEL_NODE = 'Attempting to delete a top-level Node';
const ERROR_RESOLVER_NOT_AN_OBJECT =
  'Resolver in <Editor /> has to be an object. For (de)serialization Craft.js needs a list of all the User Components. \n    \nMore info: https://craft.js.org/r/docs/api/editor#props';
const ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER =
  'An Error occurred while deserializing components: Cannot find component <%displayName% /> in resolver map. Please check your resolver in <Editor />\n\nAvailable components in resolver: %availableComponents%\n\nMore info: https://craft.js.org/r/docs/api/editor#props';
const ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT =
  'You can only use useEditor in the context of <Editor />. \n\nPlease only use useEditor in components that are children of the <Editor /> component.';
const ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT =
  'You can only use useNode in the context of <Editor />. \n\nPlease only use useNode in components that are children of the <Editor /> component.';

function _defineProperty(e, r, t) {
  return (
    (r = _toPropertyKey(r)) in e
      ? Object.defineProperty(e, r, {
          value: t,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[r] = t),
    e
  );
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r &&
      (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })),
      t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2
      ? ownKeys(Object(t), !0).forEach(function (r) {
          _defineProperty(e, r, t[r]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
      : ownKeys(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ('object' != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || 'default');
    if ('object' != typeof i) return i;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return ('string' === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, 'string');
  return 'symbol' == typeof i ? i : i + '';
}

const HISTORY_ACTIONS = {
  UNDO: 'HISTORY_UNDO',
  REDO: 'HISTORY_REDO',
  THROTTLE: 'HISTORY_THROTTLE',
  IGNORE: 'HISTORY_IGNORE',
  MERGE: 'HISTORY_MERGE',
  CLEAR: 'HISTORY_CLEAR',
};
class History {
  constructor() {
    _defineProperty(this, 'timeline', []);
    _defineProperty(this, 'pointer', -1);
  }
  add(patches, inversePatches) {
    if (patches.length === 0 && inversePatches.length === 0) {
      return;
    }
    this.pointer = this.pointer + 1;
    this.timeline.length = this.pointer;
    this.timeline[this.pointer] = {
      patches,
      inversePatches,
      timestamp: Date.now(),
    };
  }
  throttleAdd(patches, inversePatches) {
    let throttleRate =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
    if (patches.length === 0 && inversePatches.length === 0) {
      return;
    }
    if (this.timeline.length && this.pointer >= 0) {
      const {
        patches: currPatches,
        inversePatches: currInversePatches,
        timestamp,
      } = this.timeline[this.pointer];
      const now = new Date();
      const diff = now.getTime() - timestamp;
      if (diff < throttleRate) {
        this.timeline[this.pointer] = {
          timestamp,
          patches: [...currPatches, ...patches],
          inversePatches: [...inversePatches, ...currInversePatches],
        };
        return;
      }
    }
    this.add(patches, inversePatches);
  }
  merge(patches, inversePatches) {
    if (patches.length === 0 && inversePatches.length === 0) {
      return;
    }
    if (this.timeline.length && this.pointer >= 0) {
      const {
        patches: currPatches,
        inversePatches: currInversePatches,
        timestamp,
      } = this.timeline[this.pointer];
      this.timeline[this.pointer] = {
        timestamp,
        patches: [...currPatches, ...patches],
        inversePatches: [...inversePatches, ...currInversePatches],
      };
      return;
    }
    this.add(patches, inversePatches);
  }
  clear() {
    this.timeline = [];
    this.pointer = -1;
  }
  canUndo() {
    return this.pointer >= 0;
  }
  canRedo() {
    return this.pointer < this.timeline.length - 1;
  }
  undo(state) {
    if (!this.canUndo()) {
      return;
    }
    const { inversePatches } = this.timeline[this.pointer];
    this.pointer = this.pointer - 1;
    return produce.applyPatches(state, inversePatches);
  }
  redo(state) {
    if (!this.canRedo()) {
      return;
    }
    this.pointer = this.pointer + 1;
    const { patches } = this.timeline[this.pointer];
    return produce.applyPatches(state, patches);
  }
}

produce.enableMapSet();
produce.enablePatches();
function useMethods(
  methodsOrOptions,
  initialState,
  queryMethods,
  patchListener
) {
  const history = React.useMemo(() => new History(), []);
  let methodsFactory;
  let ignoreHistoryForActionsRef = React.useRef([]);
  let normalizeHistoryRef = React.useRef(() => {});
  if (typeof methodsOrOptions === 'function') {
    methodsFactory = methodsOrOptions;
  } else {
    methodsFactory = methodsOrOptions.methods;
    ignoreHistoryForActionsRef.current =
      methodsOrOptions.ignoreHistoryForActions;
    normalizeHistoryRef.current = methodsOrOptions.normalizeHistory;
  }
  const patchListenerRef = React.useRef(patchListener);
  patchListenerRef.current = patchListener;
  const stateRef = React.useRef(initialState);
  const reducer = React.useMemo(() => {
    const { current: normalizeHistory } = normalizeHistoryRef;
    const { current: ignoreHistoryForActions } = ignoreHistoryForActionsRef;
    const { current: patchListener } = patchListenerRef;
    return (state, action) => {
      const query =
        queryMethods && createQuery(queryMethods, () => state, history);
      let finalState;
      let [nextState, patches, inversePatches] = produce.produceWithPatches(
        state,
        (draft) => {
          switch (action.type) {
            case HISTORY_ACTIONS.UNDO: {
              return history.undo(draft);
            }
            case HISTORY_ACTIONS.REDO: {
              return history.redo(draft);
            }
            case HISTORY_ACTIONS.CLEAR: {
              history.clear();
              return _objectSpread2({}, draft);
            }
            // TODO: Simplify History API
            case HISTORY_ACTIONS.IGNORE:
            case HISTORY_ACTIONS.MERGE:
            case HISTORY_ACTIONS.THROTTLE: {
              const [type, ...params] = action.payload;
              methodsFactory(draft, query)[type](...params);
              break;
            }
            default:
              methodsFactory(draft, query)[action.type](...action.payload);
          }
        }
      );
      finalState = nextState;
      if (patchListener) {
        patchListener(
          nextState,
          state,
          {
            type: action.type,
            params: action.payload,
            patches,
          },
          query,
          (cb) => {
            let normalizedDraft = produce.produceWithPatches(nextState, cb);
            finalState = normalizedDraft[0];
            patches = [...patches, ...normalizedDraft[1]];
            inversePatches = [...normalizedDraft[2], ...inversePatches];
          }
        );
      }
      if (
        [HISTORY_ACTIONS.UNDO, HISTORY_ACTIONS.REDO].includes(action.type) &&
        normalizeHistory
      ) {
        finalState = produce__default['default'](finalState, normalizeHistory);
      }
      if (
        ![
          ...ignoreHistoryForActions,
          HISTORY_ACTIONS.UNDO,
          HISTORY_ACTIONS.REDO,
          HISTORY_ACTIONS.IGNORE,
          HISTORY_ACTIONS.CLEAR,
        ].includes(action.type)
      ) {
        if (action.type === HISTORY_ACTIONS.THROTTLE) {
          history.throttleAdd(
            patches,
            inversePatches,
            action.config && action.config.rate
          );
        } else if (action.type === HISTORY_ACTIONS.MERGE) {
          history.merge(patches, inversePatches);
        } else {
          history.add(patches, inversePatches);
        }
      }
      return finalState;
    };
  }, [history, methodsFactory, queryMethods]);
  const getState = React.useCallback(() => stateRef.current, []);
  const watcher = React.useMemo(() => new Watcher(getState), [getState]);
  const dispatch = React.useCallback(
    (action) => {
      const newState = reducer(stateRef.current, action);
      stateRef.current = newState;
      watcher.notify();
    },
    [reducer, watcher]
  );
  React.useEffect(() => {
    watcher.notify();
  }, [watcher]);
  const query = React.useMemo(
    () =>
      !queryMethods
        ? []
        : createQuery(queryMethods, () => stateRef.current, history),
    [history, queryMethods]
  );
  const actions = React.useMemo(() => {
    const actionTypes = Object.keys(methodsFactory(null, null));
    const { current: ignoreHistoryForActions } = ignoreHistoryForActionsRef;
    return _objectSpread2(
      _objectSpread2(
        {},
        actionTypes.reduce((accum, type) => {
          accum[type] = function () {
            for (
              var _len = arguments.length, payload = new Array(_len), _key = 0;
              _key < _len;
              _key++
            ) {
              payload[_key] = arguments[_key];
            }
            return dispatch({
              type,
              payload,
            });
          };
          return accum;
        }, {})
      ),
      {},
      {
        history: {
          undo() {
            return dispatch({
              type: HISTORY_ACTIONS.UNDO,
            });
          },
          redo() {
            return dispatch({
              type: HISTORY_ACTIONS.REDO,
            });
          },
          clear: () => {
            return dispatch({
              type: HISTORY_ACTIONS.CLEAR,
            });
          },
          throttle: (rate) => {
            return _objectSpread2(
              {},
              actionTypes
                .filter((type) => !ignoreHistoryForActions.includes(type))
                .reduce((accum, type) => {
                  accum[type] = function () {
                    for (
                      var _len2 = arguments.length,
                        payload = new Array(_len2),
                        _key2 = 0;
                      _key2 < _len2;
                      _key2++
                    ) {
                      payload[_key2] = arguments[_key2];
                    }
                    return dispatch({
                      type: HISTORY_ACTIONS.THROTTLE,
                      payload: [type, ...payload],
                      config: {
                        rate: rate,
                      },
                    });
                  };
                  return accum;
                }, {})
            );
          },
          ignore: () => {
            return _objectSpread2(
              {},
              actionTypes
                .filter((type) => !ignoreHistoryForActions.includes(type))
                .reduce((accum, type) => {
                  accum[type] = function () {
                    for (
                      var _len3 = arguments.length,
                        payload = new Array(_len3),
                        _key3 = 0;
                      _key3 < _len3;
                      _key3++
                    ) {
                      payload[_key3] = arguments[_key3];
                    }
                    return dispatch({
                      type: HISTORY_ACTIONS.IGNORE,
                      payload: [type, ...payload],
                    });
                  };
                  return accum;
                }, {})
            );
          },
          merge: () => {
            return _objectSpread2(
              {},
              actionTypes
                .filter((type) => !ignoreHistoryForActions.includes(type))
                .reduce((accum, type) => {
                  accum[type] = function () {
                    for (
                      var _len4 = arguments.length,
                        payload = new Array(_len4),
                        _key4 = 0;
                      _key4 < _len4;
                      _key4++
                    ) {
                      payload[_key4] = arguments[_key4];
                    }
                    return dispatch({
                      type: HISTORY_ACTIONS.MERGE,
                      payload: [type, ...payload],
                    });
                  };
                  return accum;
                }, {})
            );
          },
        },
      }
    );
  }, [dispatch, methodsFactory]);
  return React.useMemo(
    () => ({
      getState,
      subscribe: (collector, cb, collectOnCreate) =>
        watcher.subscribe(collector, cb, collectOnCreate),
      actions,
      query,
      history,
    }),
    [actions, query, watcher, getState, history]
  );
}
function createQuery(queryMethods, getState, history) {
  const queries = Object.keys(queryMethods()).reduce((accum, key) => {
    return _objectSpread2(
      _objectSpread2({}, accum),
      {},
      {
        [key]: function () {
          return queryMethods(getState())[key](...arguments);
        },
      }
    );
  }, {});
  return _objectSpread2(
    _objectSpread2({}, queries),
    {},
    {
      history: {
        canUndo: () => history.canUndo(),
        canRedo: () => history.canRedo(),
      },
    }
  );
}
class Watcher {
  constructor(getState) {
    _defineProperty(this, 'getState', void 0);
    _defineProperty(this, 'subscribers', []);
    this.getState = getState;
  }
  /**
   * Creates a Subscriber
   * @returns {() => void} a Function that removes the Subscriber
   */
  subscribe(collector, onChange, collectOnCreate) {
    const subscriber = new Subscriber(
      () => collector(this.getState()),
      onChange,
      collectOnCreate
    );
    this.subscribers.push(subscriber);
    return this.unsubscribe.bind(this, subscriber);
  }
  unsubscribe(subscriber) {
    if (this.subscribers.length) {
      const index = this.subscribers.indexOf(subscriber);
      if (index > -1) return this.subscribers.splice(index, 1);
    }
  }
  notify() {
    this.subscribers.forEach((subscriber) => subscriber.collect());
  }
}
class Subscriber {
  /**
   * Creates a Subscriber
   * @param collector The method that returns an object of values to be collected
   * @param onChange A callback method that is triggered when the collected values has changed
   * @param collectOnCreate If set to true, the collector/onChange will be called on instantiation
   */
  constructor(collector, onChange) {
    let collectOnCreate =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    _defineProperty(this, 'collected', void 0);
    _defineProperty(this, 'collector', void 0);
    _defineProperty(this, 'onChange', void 0);
    _defineProperty(this, 'id', void 0);
    this.collector = collector;
    this.onChange = onChange;
    // Collect and run onChange callback when Subscriber is created
    if (collectOnCreate) this.collect();
  }
  collect() {
    try {
      const recollect = this.collector();
      if (!isEqualWith__default['default'](recollect, this.collected)) {
        this.collected = recollect;
        if (this.onChange) this.onChange(this.collected);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }
}

const getDOMInfo = (el) => {
  const {
    x,
    y,
    top,
    left,
    bottom,
    right,
    width,
    height,
  } = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  const margin = {
    left: parseInt(style.marginLeft),
    right: parseInt(style.marginRight),
    bottom: parseInt(style.marginBottom),
    top: parseInt(style.marginTop),
  };
  const padding = {
    left: parseInt(style.paddingLeft),
    right: parseInt(style.paddingRight),
    bottom: parseInt(style.paddingBottom),
    top: parseInt(style.paddingTop),
  };
  const styleInFlow = (parent) => {
    const parentStyle = getComputedStyle(parent);
    if (style.overflow && style.overflow !== 'visible') {
      return;
    }
    if (parentStyle.float !== 'none') {
      return;
    }
    if (parentStyle.display === 'grid') {
      return;
    }
    if (
      parentStyle.display === 'flex' &&
      parentStyle['flex-direction'] !== 'column'
    ) {
      return;
    }
    switch (style.position) {
      case 'static':
      case 'relative':
        break;
      default:
        return;
    }
    switch (el.tagName) {
      case 'TR':
      case 'TBODY':
      case 'THEAD':
      case 'TFOOT':
        return true;
    }
    switch (style.display) {
      case 'block':
      case 'list-item':
      case 'table':
      case 'flex':
      case 'grid':
        return true;
    }
    return;
  };
  return {
    x,
    y,
    top,
    left,
    bottom,
    right,
    width,
    height,
    outerWidth: Math.round(width + margin.left + margin.right),
    outerHeight: Math.round(height + margin.top + margin.bottom),
    margin,
    padding,
    inFlow: el.parentElement && !!styleInFlow(el.parentElement),
  };
};

function useCollector(store, collector) {
  const { subscribe, getState, actions, query } = store;
  const initial = React.useRef(true);
  const collected = React.useRef(null);
  const collectorRef = React.useRef(collector);
  collectorRef.current = collector;
  const onCollect = React.useCallback(
    (collected) => {
      return { ...collected, actions, query };
    },
    [actions, query]
  );
  // Collect states for initial render
  if (initial.current && collector) {
    collected.current = collector(getState(), query);
    initial.current = false;
  }
  const [renderCollected, setRenderCollected] = React.useState(
    onCollect(collected.current)
  );
  // Collect states on state change
  React.useEffect(() => {
    let unsubscribe;
    if (collectorRef.current) {
      unsubscribe = subscribe(
        (current) => collectorRef.current(current, query),
        (collected) => {
          setRenderCollected(onCollect(collected));
        }
      );
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onCollect, query, subscribe]);
  return renderCollected;
}

// By default nanoid generate an ID with 21 characters. To reduce the footprint, we default to 10 characters.
// We have a higher probability for collisions, though
/**
 * Generate a random ID. That ID can for example be used as a node ID.
 *
 * @param size The number of characters that are generated for the ID. Defaults to `10`
 * @returns A random id
 */
const getRandomId = function () {
  let size =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  return nanoid.nanoid(size);
};

/**
 * Stores all connected DOM elements and their connectors here
 * This allows us to easily enable/disable and perform cleanups
 */
class ConnectorRegistry {
  constructor() {
    _defineProperty(this, 'isEnabled', true);
    _defineProperty(this, 'elementIdMap', new WeakMap());
    _defineProperty(this, 'registry', new Map());
  }
  getElementId(element) {
    const existingId = this.elementIdMap.get(element);
    if (existingId) {
      return existingId;
    }
    const newId = getRandomId();
    this.elementIdMap.set(element, newId);
    return newId;
  }
  getConnectorId(element, connectorName) {
    const elementId = this.getElementId(element);
    return ''.concat(connectorName, '--').concat(elementId);
  }
  register(element, connectorPayload) {
    const existingConnector = this.getByElement(element, connectorPayload.name);
    if (existingConnector) {
      if (
        isEqual__default['default'](
          connectorPayload.required,
          existingConnector.required
        )
      ) {
        return existingConnector;
      }
      this.getByElement(element, connectorPayload.name).disable();
    }
    let cleanup = null;
    const id = this.getConnectorId(element, connectorPayload.name);
    this.registry.set(id, {
      id,
      required: connectorPayload.required,
      enable: () => {
        if (cleanup) {
          cleanup();
        }
        cleanup = connectorPayload.connector(
          element,
          connectorPayload.required,
          connectorPayload.options
        );
      },
      disable: () => {
        if (!cleanup) {
          return;
        }
        cleanup();
      },
      remove: () => {
        return this.remove(id);
      },
    });
    if (this.isEnabled) {
      this.registry.get(id).enable();
    }
    return this.registry.get(id);
  }
  get(id) {
    return this.registry.get(id);
  }
  remove(id) {
    const connector = this.get(id);
    if (!connector) {
      return;
    }
    connector.disable();
    this.registry.delete(connector.id);
  }
  enable() {
    this.isEnabled = true;
    this.registry.forEach((connectors) => {
      connectors.enable();
    });
  }
  disable() {
    this.isEnabled = false;
    this.registry.forEach((connectors) => {
      connectors.disable();
    });
  }
  getByElement(element, connectorName) {
    return this.get(this.getConnectorId(element, connectorName));
  }
  removeByElement(element, connectorName) {
    return this.remove(this.getConnectorId(element, connectorName));
  }
  clear() {
    this.disable();
    this.elementIdMap = new WeakMap();
    this.registry = new Map();
  }
}

exports.EventHandlerUpdates = void 0;
(function (EventHandlerUpdates) {
  EventHandlerUpdates[(EventHandlerUpdates['HandlerDisabled'] = 0)] =
    'HandlerDisabled';
  EventHandlerUpdates[(EventHandlerUpdates['HandlerEnabled'] = 1)] =
    'HandlerEnabled';
})(exports.EventHandlerUpdates || (exports.EventHandlerUpdates = {}));

/**
 * Check if a specified event is blocked by a child
 * that's a descendant of the specified element
 */
function isEventBlockedByDescendant(e, eventName, el) {
  // Store initial Craft event value
  if (!e.craft) {
    e.craft = {
      stopPropagation: () => {},
      blockedEvents: {},
    };
  }
  const blockingElements = (e.craft && e.craft.blockedEvents[eventName]) || [];
  for (let i = 0; i < blockingElements.length; i++) {
    const blockingElement = blockingElements[i];
    if (el !== blockingElement && el.contains(blockingElement)) {
      return true;
    }
  }
  return false;
}

class EventHandlers {
  constructor(options) {
    _defineProperty(this, 'options', void 0);
    _defineProperty(this, 'registry', new ConnectorRegistry());
    _defineProperty(this, 'subscribers', new Set());
    this.options = options;
  }
  listen(cb) {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }
  disable() {
    if (this.onDisable) {
      this.onDisable();
    }
    this.registry.disable();
    this.subscribers.forEach((listener) => {
      listener(exports.EventHandlerUpdates.HandlerDisabled);
    });
  }
  enable() {
    if (this.onEnable) {
      this.onEnable();
    }
    this.registry.enable();
    this.subscribers.forEach((listener) => {
      listener(exports.EventHandlerUpdates.HandlerEnabled);
    });
  }
  cleanup() {
    this.disable();
    this.subscribers.clear();
    this.registry.clear();
  }
  addCraftEventListener(el, eventName, listener, options) {
    const bindedListener = (e) => {
      if (!isEventBlockedByDescendant(e, eventName, el)) {
        e.craft.stopPropagation = () => {
          if (!e.craft.blockedEvents[eventName]) {
            e.craft.blockedEvents[eventName] = [];
          }
          e.craft.blockedEvents[eventName].push(el);
        };
        listener(e);
      }
    };
    el.addEventListener(eventName, bindedListener, options);
    return () => el.removeEventListener(eventName, bindedListener, options);
  }
  /**
   * Creates a record of chainable connectors and tracks their usages
   */
  createConnectorsUsage() {
    const handlers = this.handlers();
    // Track all active connector ids here
    // This is so we can return a cleanup method below so the callee can programmatically cleanup all connectors
    const activeConnectorIds = new Set();
    let canRegisterConnectors = false;
    const connectorsToRegister = new Map();
    const connectors = Object.entries(handlers).reduce((accum, _ref) => {
      let [name, handler] = _ref;
      return _objectSpread2(
        _objectSpread2({}, accum),
        {},
        {
          [name]: (el, required, options) => {
            const registerConnector = () => {
              const connector = this.registry.register(el, {
                required,
                name,
                options,
                connector: handler,
              });
              activeConnectorIds.add(connector.id);
              return connector;
            };
            connectorsToRegister.set(
              this.registry.getConnectorId(el, name),
              registerConnector
            );
            /**
             * If register() has been called,
             * register the connector immediately.
             *
             * Otherwise, registration is deferred until after register() is called
             */
            if (canRegisterConnectors) {
              registerConnector();
            }
            return el;
          },
        }
      );
    }, {});
    return {
      connectors,
      register: () => {
        canRegisterConnectors = true;
        connectorsToRegister.forEach((registerConnector) => {
          registerConnector();
        });
      },
      cleanup: () => {
        canRegisterConnectors = false;
        activeConnectorIds.forEach((connectorId) =>
          this.registry.remove(connectorId)
        );
      },
    };
  }
  derive(type, opts) {
    return new type(this, opts);
  }
  // This method allows us to execute multiple connectors and returns a single cleanup method for all of them
  createProxyHandlers(instance, cb) {
    const connectorsToCleanup = [];
    const handlers = instance.handlers();
    const proxiedHandlers = new Proxy(handlers, {
      get: (target, key, receiver) => {
        if (key in handlers === false) {
          return Reflect.get(target, key, receiver);
        }
        return function (el) {
          for (
            var _len = arguments.length,
              args = new Array(_len > 1 ? _len - 1 : 0),
              _key = 1;
            _key < _len;
            _key++
          ) {
            args[_key - 1] = arguments[_key];
          }
          const cleanup = handlers[key](el, ...args);
          if (!cleanup) {
            return;
          }
          connectorsToCleanup.push(cleanup);
        };
      },
    });
    cb(proxiedHandlers);
    return () => {
      connectorsToCleanup.forEach((cleanup) => {
        cleanup();
      });
    };
  }
  // This lets us to execute and cleanup sibling connectors
  reflect(cb) {
    return this.createProxyHandlers(this, cb);
  }
}

// Creates EventHandlers that depends on another EventHandlers instance
// This lets us to easily create new connectors that composites of the parent EventHandlers instance
class DerivedEventHandlers extends EventHandlers {
  constructor(derived, options) {
    super(options);
    _defineProperty(this, 'derived', void 0);
    _defineProperty(this, 'unsubscribeParentHandlerListener', void 0);
    this.derived = derived;
    this.options = options;
    // Automatically disable/enable depending on the parent handlers
    this.unsubscribeParentHandlerListener = this.derived.listen((msg) => {
      switch (msg) {
        case exports.EventHandlerUpdates.HandlerEnabled: {
          return this.enable();
        }
        case exports.EventHandlerUpdates.HandlerDisabled: {
          return this.disable();
        }
        default: {
          return;
        }
      }
    });
  }
  // A method to easily inherit parent connectors
  inherit(cb) {
    return this.createProxyHandlers(this.derived, cb);
  }
  cleanup() {
    super.cleanup();
    this.unsubscribeParentHandlerListener();
  }
}

// https://github.com/react-dnd/react-dnd
function setRef(ref, node) {
  if (node) {
    if (typeof ref === 'function') {
      ref(node);
    } else {
      ref.current = node;
    }
  }
}
function cloneWithRef(element, newRef) {
  const previousRef = element.ref;
  invariant__default['default'](
    typeof previousRef !== 'string',
    'Cannot connect to an element with an existing string ref. ' +
      'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' +
      'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute'
  );
  if (!previousRef) {
    // When there is no ref on the element, use the new ref directly
    return React.cloneElement(element, {
      ref: newRef,
    });
  } else {
    return React.cloneElement(element, {
      ref: (node) => {
        setRef(previousRef, node);
        setRef(newRef, node);
      },
    });
  }
}
function throwIfCompositeComponentElement(element) {
  if (typeof element.type === 'string') {
    return;
  }
  throw new Error();
}
function wrapHookToRecognizeElement(hook) {
  return (elementOrNode = null, ...args) => {
    // When passed a node, call the hook straight away.
    if (!React.isValidElement(elementOrNode)) {
      if (!elementOrNode) {
        return;
      }
      const node = elementOrNode;
      node && hook(node, ...args);
      return node;
    }
    // If passed a ReactElement, clone it and attach this function as a ref.
    // This helps us achieve a neat API where user doesn't even know that refs
    // are being used under the hood.
    const element = elementOrNode;
    throwIfCompositeComponentElement(element);
    return cloneWithRef(element, hook);
  };
}
// A React wrapper for our connectors
// Wrap all our connectors so that would additionally accept React.ReactElement
function wrapConnectorHooks(connectors) {
  return Object.keys(connectors).reduce((accum, key) => {
    accum[key] = wrapHookToRecognizeElement((...args) => {
      // @ts-ignore
      return connectors[key](...args);
    });
    return accum;
  }, {});
}

const RenderIndicator = ({ style, className, parentDom }) => {
  const indicator = React__default['default'].createElement('div', {
    className: className,
    style: {
      position: 'fixed',
      display: 'block',
      opacity: 1,
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'transparent',
      zIndex: 99999,
      ...style,
    },
  });
  if (parentDom && parentDom.ownerDocument !== document) {
    return ReactDOM__default['default'].createPortal(
      indicator,
      parentDom.ownerDocument.body
    );
  }
  return indicator;
};

const useEffectOnce = (effect) => {
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  React.useEffect(effect, []);
};

const deprecationWarning = (name, payload) => {
  let message = 'Deprecation warning: '.concat(
    name,
    ' will be deprecated in future relases.'
  );
  const { suggest, doc } = payload;
  if (suggest) {
    message += ' Please use '.concat(suggest, ' instead.');
  }
  // URL link to Documentation
  if (doc) {
    message += '('.concat(doc, ')');
  }
  // eslint-disable-next-line no-console
  console.warn(message);
};

const isClientSide = () => typeof window !== 'undefined';
const isLinux = () =>
  isClientSide() && /Linux/i.test(window.navigator.userAgent);
const isChromium = () =>
  isClientSide() && /Chrome/i.test(window.navigator.userAgent);

exports.DEPRECATED_ROOT_NODE = DEPRECATED_ROOT_NODE;
exports.DerivedEventHandlers = DerivedEventHandlers;
exports.ERROR_CANNOT_DRAG = ERROR_CANNOT_DRAG;
exports.ERROR_DELETE_TOP_LEVEL_NODE = ERROR_DELETE_TOP_LEVEL_NODE;
exports.ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER = ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER;
exports.ERROR_DUPLICATE_NODEID = ERROR_DUPLICATE_NODEID;
exports.ERROR_INFINITE_CANVAS = ERROR_INFINITE_CANVAS;
exports.ERROR_INVALID_NODEID = ERROR_INVALID_NODEID;
exports.ERROR_INVALID_NODE_ID = ERROR_INVALID_NODE_ID;
exports.ERROR_MISSING_PLACEHOLDER_PLACEMENT = ERROR_MISSING_PLACEHOLDER_PLACEMENT;
exports.ERROR_MOVE_CANNOT_DROP = ERROR_MOVE_CANNOT_DROP;
exports.ERROR_MOVE_INCOMING_PARENT = ERROR_MOVE_INCOMING_PARENT;
exports.ERROR_MOVE_NONCANVAS_CHILD = ERROR_MOVE_NONCANVAS_CHILD;
exports.ERROR_MOVE_OUTGOING_PARENT = ERROR_MOVE_OUTGOING_PARENT;
exports.ERROR_MOVE_ROOT_NODE = ERROR_MOVE_ROOT_NODE;
exports.ERROR_MOVE_TOP_LEVEL_NODE = ERROR_MOVE_TOP_LEVEL_NODE;
exports.ERROR_MOVE_TO_DESCENDANT = ERROR_MOVE_TO_DESCENDANT;
exports.ERROR_MOVE_TO_NONCANVAS_PARENT = ERROR_MOVE_TO_NONCANVAS_PARENT;
exports.ERROR_NOPARENT = ERROR_NOPARENT;
exports.ERROR_NOT_IN_RESOLVER = ERROR_NOT_IN_RESOLVER;
exports.ERROR_RESOLVER_NOT_AN_OBJECT = ERROR_RESOLVER_NOT_AN_OBJECT;
exports.ERROR_TOP_LEVEL_ELEMENT_NO_ID = ERROR_TOP_LEVEL_ELEMENT_NO_ID;
exports.ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT = ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT;
exports.ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT = ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT;
exports.EventHandlers = EventHandlers;
exports.HISTORY_ACTIONS = HISTORY_ACTIONS;
exports.History = History;
exports.ROOT_NODE = ROOT_NODE;
exports.RenderIndicator = RenderIndicator;
exports.cloneWithRef = cloneWithRef;
exports.createQuery = createQuery;
exports.deprecationWarning = deprecationWarning;
exports.getDOMInfo = getDOMInfo;
exports.getRandomId = getRandomId;
exports.isChromium = isChromium;
exports.isClientSide = isClientSide;
exports.isLinux = isLinux;
exports.useCollector = useCollector;
exports.useEffectOnce = useEffectOnce;
exports.useMethods = useMethods;
exports.wrapConnectorHooks = wrapConnectorHooks;
exports.wrapHookToRecognizeElement = wrapHookToRecognizeElement;
//# sourceMappingURL=index.js.map
