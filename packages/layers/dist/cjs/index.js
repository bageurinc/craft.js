'use strict';

if (typeof window !== 'undefined') {
  if (!window['__CRAFTJS__']) {
    window['__CRAFTJS__'] = {};
  }

  window['__CRAFTJS__']['@craftjs/layers'] = '0.2.7';
}

Object.defineProperty(exports, '__esModule', { value: true });

var utils = require('@craftjs/utils');
var React = require('react');
var core = require('@craftjs/core');
var styledComponents = require('styled-components');
var ContentEditable = require('react-contenteditable');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e };
}

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(
          n,
          k,
          d.get
            ? d
            : {
                enumerable: true,
                get: function () {
                  return e[k];
                },
              }
        );
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);
var React__namespace = /*#__PURE__*/ _interopNamespace(React);
var ContentEditable__default = /*#__PURE__*/ _interopDefaultLegacy(
  ContentEditable
);

const LayerContext = React__default['default'].createContext({});

const LayerManagerContext = React.createContext({});

function useLayerManager(collector) {
  const { store } = React.useContext(LayerManagerContext);
  const collected = utils.useCollector(store, collector);
  return React.useMemo(
    () => ({
      store,
      ...collected,
    }),
    [store, collected]
  );
}

function useLayer(collect) {
  const { id, depth, connectors: internalConnectors } = React.useContext(
    LayerContext
  );
  const { actions: managerActions, ...collected } = useLayerManager((state) => {
    return id && state.layers[id] && collect && collect(state.layers[id]);
  });
  const { children } = core.useEditor((state, query) => ({
    children: state.nodes[id] && query.node(id).descendants(),
  }));
  const actions = React.useMemo(() => {
    return {
      toggleLayer: () => managerActions.toggleLayer(id),
      setExpandedState: (expanded) =>
        managerActions.setExpandedState(id, expanded),
    };
  }, [managerActions, id]);
  const connectors = React.useMemo(
    () =>
      utils.wrapConnectorHooks({
        layer: (el) => internalConnectors.layer(el, id),
        drag: (el) => internalConnectors.drag(el, id),
        layerHeader: (el) => internalConnectors.layerHeader(el, id),
      }),
    [internalConnectors, id]
  );
  return {
    id,
    depth,
    children,
    actions,
    connectors,
    ...collected,
  };
}

const LayerNode = () => {
  const { id, depth, children, expanded } = useLayer((layer) => ({
    expanded: layer.expanded,
  }));
  const { data, shouldBeExpanded } = core.useEditor((state, query) => {
    // TODO: handle multiple selected elements
    const selected = query.getEvent('selected').first();
    return {
      data: state.nodes[id] && state.nodes[id].data,
      shouldBeExpanded:
        selected && query.node(selected).ancestors(true).includes(id),
    };
  });
  const {
    actions: { registerLayer, toggleLayer },
    renderLayer,
    expandRootOnLoad,
  } = useLayerManager((state) => ({
    renderLayer: state.options.renderLayer,
    expandRootOnLoad: state.options.expandRootOnLoad,
  }));
  const [isRegistered, setRegistered] = React.useState(false);
  React.useLayoutEffect(() => {
    registerLayer(id);
    setRegistered(true);
  }, [registerLayer, id]);
  const expandedRef = React.useRef(expanded);
  expandedRef.current = expanded;
  const shouldBeExpandedOnLoad = React.useRef(
    expandRootOnLoad && id === core.ROOT_NODE
  );
  React.useEffect(() => {
    if (!expandedRef.current && shouldBeExpanded) {
      toggleLayer(id);
    }
  }, [toggleLayer, id, shouldBeExpanded]);
  React.useEffect(() => {
    if (shouldBeExpandedOnLoad.current) {
      toggleLayer(id);
    }
  }, [toggleLayer, id]);
  return data && isRegistered
    ? React__default['default'].createElement(
        'div',
        { className: `craft-layer-node ${id}` },
        React__default['default'].createElement(
          renderLayer,
          {},
          children && expanded
            ? children.map((id) =>
                React__default['default'].createElement(LayerContextProvider, {
                  key: id,
                  id: id,
                  depth: depth + 1,
                })
              )
            : null
        )
      )
    : null;
};

const LayerEventHandlerContext = React.createContext(null);
const useLayerEventHandler = () => React.useContext(LayerEventHandlerContext);

const LayerContextProvider = ({ id, depth }) => {
  const handlers = useLayerEventHandler();
  const { store } = React.useContext(LayerManagerContext);
  const storeRef = React.useRef(store);
  storeRef.current = store;
  const connectorsUsage = React.useMemo(
    () => handlers.createConnectorsUsage(),
    [handlers]
  );
  const connectors = React.useMemo(
    () => utils.wrapConnectorHooks(connectorsUsage.connectors),
    [connectorsUsage]
  );
  React.useEffect(() => {
    connectorsUsage.register();
    return () => {
      connectorsUsage.cleanup();
    };
  }, [connectorsUsage]);
  const { exists } = core.useEditor((state) => ({
    exists: !!state.nodes[id],
  }));
  if (!exists) {
    return null;
  }
  return React__default['default'].createElement(
    LayerContext.Provider,
    { value: { id, depth, connectors } },
    React__default['default'].createElement(LayerNode, null)
  );
};

const LayerMethods = (state) => ({
  setLayerEvent: (eventType, id) => {
    if (id !== null && !state.layers[id]) return;
    const current = state.events[eventType];
    if (current && id !== current) {
      state.layers[current].event[eventType] = false;
    }
    if (id) {
      state.layers[id].event[eventType] = true;
      state.events[eventType] = id;
    } else {
      state.events[eventType] = null;
    }
  },
  registerLayer: (id) => {
    if (!state.layers[id]) {
      state.layers[id] = {
        dom: null,
        headingDom: null,
        expanded: false,
        id,
        event: {
          selected: false,
          hovered: false,
        },
      };
    }
  },
  setDOM: (id, domCollection) => {
    state.layers[id] = {
      ...state.layers[id],
      ...(domCollection.dom ? { dom: domCollection.dom } : {}),
      ...(domCollection.headingDom
        ? { headingDom: domCollection.headingDom }
        : {}),
    };
  },
  toggleLayer: (id) => {
    state.layers[id].expanded = !state.layers[id].expanded;
  },
  setExpandedState: (id, expanded) => {
    state.layers[id].expanded = expanded;
  },
  setIndicator: (indicator) => {
    state.events.indicator = indicator;
  },
});

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

class LayerHandlers extends core.DerivedCoreEventHandlers {
  constructor() {
    super(...arguments);
    _defineProperty(this, 'autoScrollInterval', null);
    _defineProperty(this, 'AUTO_SCROLL_THRESHOLD', 50);
    // pixels from edge
    _defineProperty(this, 'AUTO_SCROLL_SPEED', 5);
  }
  // pixels per frame
  getLayer(id) {
    return this.options.layerStore.getState().layers[id];
  }
  handleAutoScroll(e, scrollContainer) {
    if (!scrollContainer) return;
    const rect = scrollContainer.getBoundingClientRect();
    const distanceFromTop = e.clientY - rect.top;
    const distanceFromBottom = rect.bottom - e.clientY;
    // Clear existing interval
    if (this.autoScrollInterval) {
      cancelAnimationFrame(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
    // Check if near top or bottom
    if (
      distanceFromTop < this.AUTO_SCROLL_THRESHOLD &&
      scrollContainer.scrollTop > 0
    ) {
      // Scroll up
      const speed = Math.max(
        1,
        (this.AUTO_SCROLL_THRESHOLD - distanceFromTop) / 10
      );
      const scroll = () => {
        scrollContainer.scrollTop -= speed;
        if (scrollContainer.scrollTop > 0) {
          this.autoScrollInterval = requestAnimationFrame(scroll);
        }
      };
      this.autoScrollInterval = requestAnimationFrame(scroll);
    } else if (distanceFromBottom < this.AUTO_SCROLL_THRESHOLD) {
      // Scroll down
      const maxScroll =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;
      if (scrollContainer.scrollTop < maxScroll) {
        const speed = Math.max(
          1,
          (this.AUTO_SCROLL_THRESHOLD - distanceFromBottom) / 10
        );
        const scroll = () => {
          scrollContainer.scrollTop += speed;
          const currentMaxScroll =
            scrollContainer.scrollHeight - scrollContainer.clientHeight;
          if (scrollContainer.scrollTop < currentMaxScroll) {
            this.autoScrollInterval = requestAnimationFrame(scroll);
          }
        };
        this.autoScrollInterval = requestAnimationFrame(scroll);
      }
    }
  }
  stopAutoScroll() {
    if (this.autoScrollInterval) {
      cancelAnimationFrame(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }
  handlers() {
    const editorStore = this.derived.options.store;
    const { layerStore } = this.options;
    return {
      layer: (el, layerId) => {
        layerStore.actions.setDOM(layerId, {
          dom: el,
        });
        const cleanupParentConnectors = this.inherit((connectors) => {
          connectors.select(el, layerId);
          connectors.hover(el, layerId);
          connectors.drag(el, layerId);
        });
        const unbindMouseOver = this.addCraftEventListener(
          el,
          'mouseover',
          (e) => {
            e.craft.stopPropagation();
            layerStore.actions.setLayerEvent('hovered', layerId);
          }
        );
        let unbindMouseleave = null;
        if (this.derived.options.removeHoverOnMouseleave) {
          unbindMouseleave = this.addCraftEventListener(
            el,
            'mouseleave',
            (e) => {
              e.craft.stopPropagation();
              layerStore.actions.setLayerEvent('hovered', null);
            }
          );
        }
        const unbindDragOver = this.addCraftEventListener(
          el,
          'dragover',
          (e) => {
            e.craft.stopPropagation();
            e.preventDefault();
            // Auto-scroll handling
            const scrollContainer = el.closest('.craft-layers-container');
            this.handleAutoScroll(e, scrollContainer);
            const { indicator, currentCanvasHovered } = LayerHandlers.events;
            if (currentCanvasHovered && indicator) {
              const heading = this.getLayer(
                currentCanvasHovered.id
              ).headingDom.getBoundingClientRect();
              if (
                e.clientY > heading.top + 20 &&
                e.clientY < heading.bottom - 20
              ) {
                const currNode =
                  currentCanvasHovered.data.nodes[
                    currentCanvasHovered.data.nodes.length - 1
                  ];
                if (!currNode) {
                  // If the currentCanvasHovered has no child nodes, then we place the indicator as the first child
                  LayerHandlers.events.indicator = _objectSpread2(
                    _objectSpread2({}, indicator),
                    {},
                    {
                      placement: _objectSpread2(
                        _objectSpread2({}, indicator.placement),
                        {},
                        {
                          index: 0,
                          where: 'before',
                          parent: currentCanvasHovered,
                        }
                      ),
                      onCanvas: true,
                    }
                  );
                  return;
                }
                LayerHandlers.events.indicator = _objectSpread2(
                  _objectSpread2({}, indicator),
                  {},
                  {
                    placement: {
                      currentNode: editorStore.query.node(currNode).get(),
                      index: currentCanvasHovered.data.nodes.length,
                      where: 'after',
                      parent: currentCanvasHovered,
                    },
                    onCanvas: true,
                  }
                );
                layerStore.actions.setIndicator(LayerHandlers.events.indicator);
              }
            }
          }
        );
        const unbindDragEnter = this.addCraftEventListener(
          el,
          'dragenter',
          (e) => {
            e.craft.stopPropagation();
            e.preventDefault();
            const dragId = LayerHandlers.draggedElement;
            if (!dragId) return;
            let target = layerId;
            const indicatorInfo = editorStore.query.getDropPlaceholder(
              dragId,
              target,
              {
                x: e.clientX,
                y: e.clientY,
              },
              (node) => {
                const layer = this.getLayer(node.id);
                return layer && layer.dom;
              }
            );
            if (indicatorInfo) {
              const {
                placement: { parent },
              } = indicatorInfo;
              const parentHeadingInfo = this.getLayer(
                parent.id
              ).headingDom.getBoundingClientRect();
              LayerHandlers.events.currentCanvasHovered = null;
              if (editorStore.query.node(parent.id).isCanvas()) {
                if (parent.data.parent) {
                  const grandparent = editorStore.query
                    .node(parent.data.parent)
                    .get();
                  if (editorStore.query.node(grandparent.id).isCanvas()) {
                    LayerHandlers.events.currentCanvasHovered = parent;
                    if (
                      (e.clientY > parentHeadingInfo.bottom - 20 &&
                        !this.getLayer(parent.id).expanded) ||
                      e.clientY < parentHeadingInfo.top + 20
                    ) {
                      indicatorInfo.placement.parent = grandparent;
                      indicatorInfo.placement.currentNode = parent;
                      indicatorInfo.placement.index = grandparent.data.nodes
                        ? grandparent.data.nodes.indexOf(parent.id)
                        : 0;
                      if (
                        e.clientY > parentHeadingInfo.bottom - 20 &&
                        !this.getLayer(parent.id).expanded
                      ) {
                        indicatorInfo.placement.where = 'after';
                      } else if (e.clientY < parentHeadingInfo.top + 20) {
                        indicatorInfo.placement.where = 'before';
                      }
                    }
                  }
                }
              }
              LayerHandlers.events.indicator = _objectSpread2(
                _objectSpread2({}, indicatorInfo),
                {},
                {
                  onCanvas: false,
                }
              );
              layerStore.actions.setIndicator(LayerHandlers.events.indicator);
            }
          }
        );
        return () => {
          cleanupParentConnectors();
          unbindMouseOver();
          unbindDragOver();
          unbindDragEnter();
          if (!unbindMouseleave) {
            return;
          }
          unbindMouseleave();
        };
      },
      layerHeader: (el, layerId) => {
        layerStore.actions.setDOM(layerId, {
          headingDom: el,
        });
      },
      drag: (el, layerId) => {
        el.setAttribute('draggable', 'true');
        const unbindDragStart = this.addCraftEventListener(
          el,
          'dragstart',
          (e) => {
            e.craft.stopPropagation();
            LayerHandlers.draggedElement = layerId;
          }
        );
        const unbindDragEnd = this.addCraftEventListener(el, 'dragend', (e) => {
          e.craft.stopPropagation();
          this.stopAutoScroll(); // Stop auto-scroll on drag end
          const events = LayerHandlers.events;
          if (events.indicator && !events.indicator.error) {
            const { placement } = events.indicator;
            const { parent, index, where } = placement;
            const { id: parentId } = parent;
            editorStore.actions.move(
              LayerHandlers.draggedElement,
              parentId,
              index + (where === 'after' ? 1 : 0)
            );
          }
          LayerHandlers.draggedElement = null;
          LayerHandlers.events.indicator = null;
          layerStore.actions.setIndicator(null);
        });
        return () => {
          el.removeAttribute('draggable');
          unbindDragStart();
          unbindDragEnd();
        };
      },
    };
  }
}
_defineProperty(LayerHandlers, 'draggedElement', void 0);
_defineProperty(LayerHandlers, 'events', {
  indicator: null,
  currentCanvasHovered: null,
});

const pulse = styledComponents.keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;
const StyledIndicator = styledComponents.styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  box-shadow: ${(props) =>
    props.$error
      ? '0 0 8px rgba(239, 68, 68, 0.6)'
      : '0 0 8px rgba(59, 130, 246, 0.6)'};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;
const RenderLayerIndicator = ({ children }) => {
  const { layers, events } = useLayerManager((state) => state);
  const { query } = core.useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const { indicator: indicatorStyles } = query.getOptions();
  const indicatorPosition = React.useMemo(() => {
    const { indicator } = events;
    if (indicator) {
      const {
        placement: { where, parent, currentNode },
        error,
      } = indicator;
      const layerId = currentNode ? currentNode.id : parent.id;
      let top;
      const color = error ? indicatorStyles.error : indicatorStyles.success;
      if (indicator.onCanvas && layers[parent.id].dom != null) {
        const parentPos = layers[parent.id].dom.getBoundingClientRect();
        const parentHeadingPos = layers[
          parent.id
        ].headingDom.getBoundingClientRect();
        return {
          top: parentHeadingPos.top,
          left: parentPos.left,
          width: parentPos.width,
          height: parentHeadingPos.height,
          background: 'transparent',
          borderWidth: '1px',
          borderColor: color,
        };
      } else {
        if (!layers[layerId]) return;
        const headingPos = layers[layerId].headingDom.getBoundingClientRect();
        const pos = layers[layerId].dom.getBoundingClientRect();
        if (where === 'after' || !currentNode) {
          top = pos.top + pos.height;
        } else {
          top = pos.top;
        }
        return {
          top,
          left: headingPos.left,
          width: pos.width + pos.left - headingPos.left,
          height: 4,
          borderWidth: 0,
          background: color,
        };
      }
    }
  }, [events, indicatorStyles.error, indicatorStyles.success, layers]);
  return React__default['default'].createElement(
    'div',
    null,
    events.indicator
      ? React__default['default'].createElement(StyledIndicator, {
          $error: !!events.indicator.error,
          style: indicatorPosition,
        })
      : null,
    children
  );
};

const LayerEventContextProvider = ({ children }) => {
  const { store: layerStore } = useLayerManager();
  const coreEventHandler = core.useEventHandler();
  const handler = React.useMemo(
    () =>
      coreEventHandler.derive(LayerHandlers, {
        layerStore,
      }),
    [coreEventHandler, layerStore]
  );
  return React__default['default'].createElement(
    LayerEventHandlerContext.Provider,
    { value: handler },
    React__default['default'].createElement(RenderLayerIndicator, null),
    children
  );
};

const EditableLayerName = () => {
  const { id } = useLayer();
  const { displayName, actions } = core.useEditor((state) => ({
    displayName:
      state.nodes[id] && state.nodes[id].data.custom.displayName
        ? state.nodes[id].data.custom.displayName
        : state.nodes[id].data.displayName,
    hidden: state.nodes[id] && state.nodes[id].data.hidden,
  }));
  const [editingName, setEditingName] = React.useState(false);
  const nameDOM = React.useRef(null);
  const clickOutside = React.useCallback((e) => {
    if (nameDOM.current && !nameDOM.current.contains(e.target)) {
      setEditingName(false);
    }
  }, []);
  React.useEffect(() => {
    return () => {
      window.removeEventListener('click', clickOutside);
    };
  }, [clickOutside]);
  return React__default['default'].createElement(
    ContentEditable__default['default'],
    {
      html: displayName,
      disabled: !editingName,
      ref: (ref) => {
        if (ref) {
          nameDOM.current = ref.el.current;
          window.removeEventListener('click', clickOutside);
          window.addEventListener('click', clickOutside);
        }
      },
      onChange: (e) => {
        actions.setCustom(
          id,
          (custom) => (custom.displayName = e.target.value)
        );
      },
      tagName: 'h2',
      onDoubleClick: () => {
        if (!editingName) setEditingName(true);
      },
    }
  );
};

var _path$2;
function _extends$3() {
  return (
    (_extends$3 = Object.assign
      ? Object.assign.bind()
      : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}.hasOwnProperty.call(t, r) && (n[r] = t[r]));
          }
          return n;
        }),
    _extends$3.apply(null, arguments)
  );
}
var SvgArrow = function SvgArrow(props) {
  return /*#__PURE__*/ React__namespace.createElement(
    'svg',
    _extends$3(
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 10 6',
      },
      props
    ),
    _path$2 ||
      (_path$2 = /*#__PURE__*/ React__namespace.createElement('path', {
        d:
          'M9.99 1.01A1 1 0 0 0 8.283.303L5 3.586 1.717.303A1 1 0 1 0 .303 1.717l3.99 3.98a1 1 0 0 0 1.414 0l3.99-3.98a.997.997 0 0 0 .293-.707Z',
      }))
  );
};

var _path$1, _path2$1;
function _extends$2() {
  return (
    (_extends$2 = Object.assign
      ? Object.assign.bind()
      : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}.hasOwnProperty.call(t, r) && (n[r] = t[r]));
          }
          return n;
        }),
    _extends$2.apply(null, arguments)
  );
}
var SvgEye = function SvgEye(props) {
  return /*#__PURE__*/ React__namespace.createElement(
    'svg',
    _extends$2(
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: 16,
        height: 16,
      },
      props
    ),
    _path$1 ||
      (_path$1 = /*#__PURE__*/ React__namespace.createElement('path', {
        fill: 'none',
        d: 'M0 0h24v24H0z',
      })),
    _path2$1 ||
      (_path2$1 = /*#__PURE__*/ React__namespace.createElement('path', {
        d:
          'M1.181 12C2.121 6.88 6.608 3 12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
      }))
  );
};

var _circle, _circle2, _circle3, _circle4, _circle5, _circle6;
function _extends$1() {
  return (
    (_extends$1 = Object.assign
      ? Object.assign.bind()
      : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}.hasOwnProperty.call(t, r) && (n[r] = t[r]));
          }
          return n;
        }),
    _extends$1.apply(null, arguments)
  );
}
var SvgGrip = function SvgGrip(props) {
  return /*#__PURE__*/ React__namespace.createElement(
    'svg',
    _extends$1(
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: 16,
        height: 16,
        fill: 'currentColor',
      },
      props
    ),
    _circle ||
      (_circle = /*#__PURE__*/ React__namespace.createElement('circle', {
        cx: 6,
        cy: 4,
        r: 1.5,
      })),
    _circle2 ||
      (_circle2 = /*#__PURE__*/ React__namespace.createElement('circle', {
        cx: 10,
        cy: 4,
        r: 1.5,
      })),
    _circle3 ||
      (_circle3 = /*#__PURE__*/ React__namespace.createElement('circle', {
        cx: 6,
        cy: 8,
        r: 1.5,
      })),
    _circle4 ||
      (_circle4 = /*#__PURE__*/ React__namespace.createElement('circle', {
        cx: 10,
        cy: 8,
        r: 1.5,
      })),
    _circle5 ||
      (_circle5 = /*#__PURE__*/ React__namespace.createElement('circle', {
        cx: 6,
        cy: 12,
        r: 1.5,
      })),
    _circle6 ||
      (_circle6 = /*#__PURE__*/ React__namespace.createElement('circle', {
        cx: 10,
        cy: 12,
        r: 1.5,
      }))
  );
};

var _path, _path2;
function _extends() {
  return (
    (_extends = Object.assign
      ? Object.assign.bind()
      : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}.hasOwnProperty.call(t, r) && (n[r] = t[r]));
          }
          return n;
        }),
    _extends.apply(null, arguments)
  );
}
var SvgLinked = function SvgLinked(props) {
  return /*#__PURE__*/ React__namespace.createElement(
    'svg',
    _extends(
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 18 18',
      },
      props
    ),
    _path ||
      (_path = /*#__PURE__*/ React__namespace.createElement('path', {
        className: 'linked_svg__a',
        d:
          'M16.5 9h-1a.5.5 0 0 0-.5.5V15H3V3h5.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5Z',
      })),
    _path2 ||
      (_path2 = /*#__PURE__*/ React__namespace.createElement('path', {
        className: 'linked_svg__a',
        d:
          'M16.75 1h-5.373a.4.4 0 0 0-.377.4.392.392 0 0 0 .117.28l1.893 1.895-3.52 3.521a.5.5 0 0 0 0 .707l.706.708a.5.5 0 0 0 .708 0l3.521-3.521 1.893 1.892A.39.39 0 0 0 16.6 7a.4.4 0 0 0 .4-.377V1.25a.25.25 0 0 0-.25-.25Z',
      }))
  );
};

// Light theme (default)
const lightTheme = {
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
};
// Dark theme
const darkTheme = {
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
};
// Theme helper function
const getTheme = (mode) => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

const ThemeContext = React.createContext(null);
const ThemeProvider = ({ theme, themeMode, children }) => {
  const value = React.useMemo(() => {
    // Use custom theme if provided, otherwise use themeMode
    const resolvedTheme = theme || getTheme(themeMode);
    return { theme: resolvedTheme };
  }, [theme, themeMode]);
  return React__default['default'].createElement(
    ThemeContext.Provider,
    { value: value },
    children
  );
};
const useLayerTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    // Return default light theme if no provider
    return getTheme('light');
  }
  return context.theme;
};

const StyledDiv = styledComponents.styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  background: ${(props) =>
    props.$selected ? props.$theme.bgSelected : 'transparent'};
  color: ${(props) =>
    props.$selected ? props.$theme.textSelected : props.$theme.textPrimary};
  svg {
    fill: ${(props) =>
      props.$selected ? props.$theme.iconSelected : props.$theme.iconPrimary};
    margin-top: 2px;
  }
  .inner {
    flex: 1;
    > div {
      padding: 0px;
      flex: 1;
      display: flex;
      margin-left: ${(props) => Math.min(props.$depth * 8, 40)}px;
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
`;
const Expand = styledComponents.styled.a`
  width: 8px;
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  transform: rotate(${(props) => (props.$expanded ? 180 : 0)}deg);
  opacity: 0.7;
  cursor: pointer;
`;
const Hide = styledComponents.styled.a`
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
    opacity: ${(props) => (props.$isHidden ? 0.2 : 1)};
  }
  &:after {
    content: ' ';
    width: 2px;
    height: ${(props) => (props.$isHidden ? 100 : 0)}%;
    position: absolute;
    left: 2px;
    top: 3px;
    background: ${(props) =>
      props.$selected ? props.$theme.iconSelected : props.$theme.iconPrimary};
    transform: rotate(-45deg);
    transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    transform-origin: 0% 0%;
    opacity: ${(props) => (props.$isHidden ? 0.4 : 1)};
  }
`;
const TopLevelIndicator = styledComponents.styled.div`
  margin-left: -22px;
  margin-right: 10px;

  svg {
    width: 12px;
    height: 12px;
  }
`;
const DragHandle = styledComponents.styled.div`
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
`;
const ReorderButtons = styledComponents.styled.div`
  display: flex;
  gap: 2px;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
`;
const ReorderButton = styledComponents.styled.button`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.3 : 0.6)};
  transition: opacity 0.2s ease;
  padding: 0;
  border-radius: 3px;

  &:hover {
    opacity: ${(props) => (props.$disabled ? 0.3 : 1)};
    background: ${(props) =>
      props.$disabled ? 'transparent' : props.$theme.bgHover};
  }

  svg {
    width: 12px;
    height: 12px;
    pointer-events: none;
  }
`;
const DefaultLayerHeader = () => {
  const theme = useLayerTheme();
  const {
    id,
    depth,
    expanded,
    children,
    connectors: { drag, layerHeader },
    actions: { toggleLayer },
  } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });
  const {
    hidden,
    actions,
    selected,
    topLevel,
    parent,
    currentIndex,
    canMoveUp,
    canMoveDown,
  } = core.useEditor((state, query) => {
    // TODO: handle multiple selected elements
    const selected = query.getEvent('selected').first() === id;
    const node = state.nodes[id];
    const parent = node?.data?.parent ? state.nodes[node.data.parent] : null;
    const siblings = parent?.data?.nodes || [];
    const currentIndex = siblings.indexOf(id);
    return {
      hidden: node && node.data.hidden,
      selected,
      topLevel: query.node(id).isTopLevelCanvas(),
      parent,
      currentIndex,
      canMoveUp: currentIndex > 0,
      canMoveDown: currentIndex < siblings.length - 1 && currentIndex !== -1,
    };
  });
  const handleMoveUp = (e) => {
    e.stopPropagation();
    if (!canMoveUp || !parent) return;
    // Move to previous position
    actions.move(id, parent.id, currentIndex - 1);
  };
  const handleMoveDown = (e) => {
    e.stopPropagation();
    if (!canMoveDown || !parent) return;
    // When moving down, the node is removed first, so we need to add 2
    // to account for: current position removal + skip the next sibling
    actions.move(id, parent.id, currentIndex + 2);
  };
  const [isHovered, setIsHovered] = React__default['default'].useState(false);
  return React__default['default'].createElement(
    StyledDiv,
    {
      $selected: selected,
      $depth: depth,
      $theme: theme,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    },
    React__default['default'].createElement(
      DragHandle,
      {
        ref: (dom) => {
          drag(dom);
        },
        $theme: theme,
      },
      React__default['default'].createElement(SvgGrip, null)
    ),
    React__default['default'].createElement(
      Hide,
      {
        $selected: selected,
        $isHidden: hidden,
        $theme: theme,
        onClick: () => actions.setHidden(id, !hidden),
      },
      React__default['default'].createElement(SvgEye, null)
    ),
    React__default['default'].createElement(
      'div',
      { className: 'inner' },
      React__default['default'].createElement(
        'div',
        {
          ref: (dom) => {
            layerHeader(dom);
          },
        },
        topLevel
          ? React__default['default'].createElement(
              TopLevelIndicator,
              null,
              React__default['default'].createElement(SvgLinked, null)
            )
          : null,
        React__default['default'].createElement(
          'div',
          { className: 'layer-name s' },
          React__default['default'].createElement(EditableLayerName, null)
        ),
        React__default['default'].createElement(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
          !topLevel &&
            isHovered &&
            React__default['default'].createElement(
              ReorderButtons,
              { $theme: theme, style: { opacity: isHovered ? 1 : 0 } },
              React__default['default'].createElement(
                ReorderButton,
                {
                  $theme: theme,
                  $disabled: !canMoveUp,
                  onClick: handleMoveUp,
                  title: 'Move up',
                },
                React__default['default'].createElement(
                  'svg',
                  { viewBox: '0 0 16 16', fill: 'currentColor' },
                  React__default['default'].createElement('path', {
                    d: 'M8 3l-5 5h10z',
                  })
                )
              ),
              React__default['default'].createElement(
                ReorderButton,
                {
                  $theme: theme,
                  $disabled: !canMoveDown,
                  onClick: handleMoveDown,
                  title: 'Move down',
                },
                React__default['default'].createElement(
                  'svg',
                  { viewBox: '0 0 16 16', fill: 'currentColor' },
                  React__default['default'].createElement('path', {
                    d: 'M8 13l5-5H3z',
                  })
                )
              )
            ),
          children && children.length
            ? React__default['default'].createElement(
                Expand,
                { $expanded: expanded, onMouseDown: () => toggleLayer() },
                React__default['default'].createElement(SvgArrow, null)
              )
            : null
        )
      )
    )
  );
};

const LayerNodeDiv = styledComponents.styled.div`
  background: ${(props) =>
    props.$hovered ? props.$theme.bgHover : props.$theme.bgBase};
  display: block;
  padding-bottom: ${(props) =>
    props.$hasCanvases && props.$expanded ? 5 : 0}px;
`;
const LayerChildren = styledComponents.styled.div`
  margin: 0 0 0 ${(props) => (props.$hasCanvases ? 28 : 0)}px;
  background: ${(props) =>
    props.$hasCanvases ? props.$theme.bgCanvas : 'transparent'};
  position: relative;

  ${(props) =>
    props.$hasCanvases
      ? `

  box-shadow: 0px 0px 44px -1px ${props.$theme.shadowColor};
  border-radius: 10px;
  margin-right: 5px;
  margin-bottom:5px;
  margin-top:5px;
  > * { overflow:hidden; }
    &:before {
      position:absolute;
      left:-19px;
      width: 2px;
      height:100%;
      content: " ";
      background:${props.$theme.borderColor};
    }
  `
      : ''}
`;
const DefaultLayer = ({ children }) => {
  const theme = useLayerTheme();
  const {
    id,
    expanded,
    hovered,
    connectors: { layer },
  } = useLayer((layer) => ({
    hovered: layer.event.hovered,
    expanded: layer.expanded,
  }));
  const { hasChildCanvases } = core.useEditor((state, query) => {
    return {
      hasChildCanvases: query.node(id).isParentOfTopLevelNodes(),
    };
  });
  return React__default['default'].createElement(
    LayerNodeDiv,
    {
      ref: (dom) => {
        layer(dom);
      },
      $expanded: expanded,
      $hasCanvases: hasChildCanvases,
      $hovered: hovered,
      $theme: theme,
    },
    React__default['default'].createElement(DefaultLayerHeader, null),
    children
      ? React__default['default'].createElement(
          LayerChildren,
          {
            $hasCanvases: hasChildCanvases,
            $theme: theme,
            className: 'craft-layer-children',
          },
          children
        )
      : null
  );
};

const LayerManagerProvider = ({ children, options }) => {
  // TODO: fix type
  const store = utils.useMethods(LayerMethods, {
    layers: {},
    events: {
      selected: null,
      dragged: null,
      hovered: null,
    },
    options: {
      renderLayer: DefaultLayer,
      ...options,
    },
  });
  return React__default['default'].createElement(
    LayerManagerContext.Provider,
    { value: { store } },
    React__default['default'].createElement(
      ThemeProvider,
      { theme: options.theme, themeMode: options.themeMode },
      React__default['default'].createElement(
        LayerEventContextProvider,
        null,
        children
      )
    )
  );
};

const Layers = ({ ...options }) => {
  return React__default['default'].createElement(
    'div',
    {
      className: 'craft-layers-container',
      style: { height: '100%', overflow: 'auto' },
    },
    React__default['default'].createElement(
      LayerManagerProvider,
      { options: options },
      React__default['default'].createElement(LayerContextProvider, {
        id: utils.ROOT_NODE,
        depth: 0,
      })
    )
  );
};

exports.DefaultLayer = DefaultLayer;
exports.DefaultLayerHeader = DefaultLayerHeader;
exports.EditableLayerName = EditableLayerName;
exports.Layers = Layers;
exports.darkTheme = darkTheme;
exports.getTheme = getTheme;
exports.lightTheme = lightTheme;
exports.useLayer = useLayer;
//# sourceMappingURL=index.js.map
