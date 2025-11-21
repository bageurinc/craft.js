if (typeof window !== 'undefined') {
  if (!window['__CRAFTJS__']) {
    window['__CRAFTJS__'] = {};
  }

  window['__CRAFTJS__']['@craftjs/core'] = '0.2.12';
}

import {
  ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT,
  useCollector,
  wrapConnectorHooks,
  ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT,
  deprecationWarning,
  ERROR_TOP_LEVEL_ELEMENT_NO_ID,
  ROOT_NODE,
  ERROR_INVALID_NODEID,
  ERROR_DELETE_TOP_LEVEL_NODE,
  ERROR_NOPARENT,
  DEPRECATED_ROOT_NODE,
  ERROR_NOT_IN_RESOLVER,
  ERROR_INVALID_NODE_ID,
  ERROR_MOVE_TOP_LEVEL_NODE,
  ERROR_MOVE_NONCANVAS_CHILD,
  ERROR_CANNOT_DRAG,
  ERROR_MOVE_TO_NONCANVAS_PARENT,
  ERROR_MOVE_INCOMING_PARENT,
  ERROR_MOVE_CANNOT_DROP,
  ERROR_MOVE_TO_DESCENDANT,
  ERROR_DUPLICATE_NODEID,
  ERROR_MOVE_OUTGOING_PARENT,
  getRandomId,
  ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER,
  getDOMInfo,
  EventHandlers,
  DerivedEventHandlers,
  isChromium,
  isLinux,
  RenderIndicator,
  useMethods,
  ERROR_RESOLVER_NOT_AN_OBJECT,
  HISTORY_ACTIONS,
} from '@craftjs/utils';
export { ROOT_NODE } from '@craftjs/utils';
import * as React from 'react';
import React__default, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useRef,
  Children,
  Fragment,
} from 'react';
import invariant from 'tiny-invariant';
import isFunction from 'lodash/isFunction';
import cloneDeep from 'lodash/cloneDeep';

const NodeContext = React__default.createContext(null);
const NodeProvider = ({ id, related = false, children }) => {
  return React__default.createElement(
    NodeContext.Provider,
    { value: { id, related } },
    children
  );
};

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
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++)
      (o = n[r]),
        -1 === t.indexOf(o) &&
          {}.propertyIsEnumerable.call(e, o) &&
          (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r)
    if ({}.hasOwnProperty.call(r, n)) {
      if (-1 !== e.indexOf(n)) continue;
      t[n] = r[n];
    }
  return t;
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

const EditorContext = createContext(null);

const EventHandlerContext = createContext(null);
const useEventHandler = () => useContext(EventHandlerContext);

function useInternalEditor(collector) {
  const handler = useEventHandler();
  const store = useContext(EditorContext);
  invariant(store, ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT);
  const collected = useCollector(store, collector);
  const connectorsUsage = useMemo(
    () => handler && handler.createConnectorsUsage(),
    [handler]
  );
  useEffect(() => {
    connectorsUsage.register();
    return () => {
      connectorsUsage.cleanup();
    };
  }, [connectorsUsage]);
  const connectors = useMemo(
    () => connectorsUsage && wrapConnectorHooks(connectorsUsage.connectors),
    [connectorsUsage]
  );
  return _objectSpread2(
    _objectSpread2({}, collected),
    {},
    {
      connectors,
      inContext: !!store,
      store,
    }
  );
}

const _excluded$3 = ['actions', 'query', 'connectors'];
function useInternalNode(collect) {
  const context = useContext(NodeContext);
  invariant(context, ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT);
  const { id, related } = context;
  const _useInternalEditor = useInternalEditor(
      (state) => id && state.nodes[id] && collect && collect(state.nodes[id])
    ),
    {
      actions: EditorActions,
      query,
      connectors: editorConnectors,
    } = _useInternalEditor,
    collected = _objectWithoutProperties(_useInternalEditor, _excluded$3);
  const connectors = useMemo(
    () =>
      wrapConnectorHooks({
        connect: (dom) => editorConnectors.connect(dom, id),
        drag: (dom) => editorConnectors.drag(dom, id),
      }),
    [editorConnectors, id]
  );
  const actions = useMemo(() => {
    return {
      setProp: (cb, throttleRate) => {
        if (throttleRate) {
          EditorActions.history.throttle(throttleRate).setProp(id, cb);
        } else {
          EditorActions.setProp(id, cb);
        }
      },
      setCustom: (cb, throttleRate) => {
        if (throttleRate) {
          EditorActions.history.throttle(throttleRate).setCustom(id, cb);
        } else {
          EditorActions.setCustom(id, cb);
        }
      },
      setHidden: (bool) => EditorActions.setHidden(id, bool),
    };
  }, [EditorActions, id]);
  return _objectSpread2(
    _objectSpread2({}, collected),
    {},
    {
      id,
      related,
      inNodeContext: !!context,
      actions,
      connectors,
    }
  );
}

const _excluded$2 = ['id', 'related', 'actions', 'inNodeContext', 'connectors'];
/**
 * A Hook to that provides methods and state information related to the corresponding Node that manages the current component.
 * @param collect - Collector function to consume values from the corresponding Node's state
 */
function useNode(collect) {
  const _useInternalNode = useInternalNode(collect),
    { id, related, actions, inNodeContext, connectors } = _useInternalNode,
    collected = _objectWithoutProperties(_useInternalNode, _excluded$2);
  return _objectSpread2(
    _objectSpread2({}, collected),
    {},
    {
      actions,
      id,
      related,
      setProp: (cb, throttleRate) => {
        deprecationWarning('useNode().setProp()', {
          suggest: 'useNode().actions.setProp()',
        });
        return actions.setProp(cb, throttleRate);
      },
      inNodeContext,
      connectors,
    }
  );
}

const SimpleElement = ({ render }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return typeof render.type === 'string'
    ? connect(drag(React__default.cloneElement(render)))
    : render;
};

const DefaultRender = () => {
  const { type, props, nodes, hydrationTimestamp } = useInternalNode(
    (node) => ({
      type: node.data.type,
      props: node.data.props,
      nodes: node.data.nodes,
      hydrationTimestamp: node._hydrationTimestamp,
    })
  );
  return useMemo(() => {
    let children = props.children;
    if (nodes && nodes.length > 0) {
      children = React__default.createElement(
        React__default.Fragment,
        null,
        nodes.map((id) =>
          React__default.createElement(NodeElement, { id: id, key: id })
        )
      );
    }
    const render = React__default.createElement(type, props, children);
    if (typeof type == 'string') {
      return React__default.createElement(SimpleElement, { render: render });
    }
    return render;
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [type, props, hydrationTimestamp, nodes]);
};

const RenderNodeToElement = ({ render }) => {
  const { hidden } = useInternalNode((node) => ({
    hidden: node.data.hidden,
  }));
  const { onRender } = useInternalEditor((state) => ({
    onRender: state.options.onRender,
  }));
  // don't display the node since it's hidden
  if (hidden) {
    return null;
  }
  return React__default.createElement(onRender, {
    render: render || React__default.createElement(DefaultRender, null),
  });
};

const NodeElement = ({ id, render }) => {
  return React__default.createElement(
    NodeProvider,
    { id: id },
    React__default.createElement(RenderNodeToElement, { render: render })
  );
};

const defaultElementProps = {
  is: 'div',
  canvas: false,
  custom: {},
  hidden: false,
};
const elementPropToNodeData = {
  is: 'type',
  canvas: 'isCanvas',
};
function Element$1({ id, children, ...elementProps }) {
  const { is } = {
    ...defaultElementProps,
    ...elementProps,
  };
  const { query, actions } = useInternalEditor();
  const { id: nodeId, inNodeContext } = useInternalNode();
  const [linkedNodeId] = useState(() => {
    invariant(!!id, ERROR_TOP_LEVEL_ELEMENT_NO_ID);
    const node = query.node(nodeId).get();
    if (inNodeContext) {
      const existingNode = node.data.linkedNodes[id]
        ? query.node(node.data.linkedNodes[id]).get()
        : null;
      // Render existing linked Node if it already exists (and is the same type as the JSX)
      if (existingNode && existingNode.data.type === is) {
        return existingNode.id;
      }
      // otherwise, create and render a new linked Node
      const linkedElement = React__default.createElement(
        Element$1,
        elementProps,
        children
      );
      const tree = query.parseReactElement(linkedElement).toNodeTree();
      actions.history.ignore().addLinkedNodeFromTree(tree, nodeId, id);
      return tree.rootNodeId;
    }
    return null;
  });
  return linkedNodeId
    ? React__default.createElement(NodeElement, { id: linkedNodeId })
    : null;
}

const deprecateCanvasComponent = () =>
  deprecationWarning('<Canvas />', {
    suggest: '<Element canvas={true} />',
  });
function Canvas({ ...props }) {
  useEffect(() => deprecateCanvasComponent(), []);
  return React__default.createElement(Element$1, { ...props, canvas: true });
}

const RenderRootNode = () => {
  const { timestamp } = useInternalEditor((state) => ({
    timestamp:
      state.nodes[ROOT_NODE] && state.nodes[ROOT_NODE]._hydrationTimestamp,
  }));
  if (!timestamp) {
    return null;
  }
  return React__default.createElement(NodeElement, {
    id: ROOT_NODE,
    key: timestamp,
  });
};
/**
 * A React Component that defines the editable area
 */
const Frame = ({ children, json, data }) => {
  const { actions, query } = useInternalEditor();
  if (!!json) {
    deprecationWarning('<Frame json={...} />', {
      suggest: '<Frame data={...} />',
    });
  }
  const isLoaded = useRef(false);
  if (!isLoaded.current) {
    const initialData = data || json;
    if (initialData) {
      actions.history.ignore().deserialize(initialData);
    } else if (children) {
      const rootNode = React__default.Children.only(children);
      const node = query.parseReactElement(rootNode).toNodeTree((node, jsx) => {
        if (jsx === rootNode) {
          node.id = ROOT_NODE;
        }
        return node;
      });
      actions.history.ignore().addNodeTree(node);
    }
    isLoaded.current = true;
  }
  return React__default.createElement(RenderRootNode, null);
};

var NodeSelectorType;
(function (NodeSelectorType) {
  NodeSelectorType[(NodeSelectorType['Any'] = 0)] = 'Any';
  NodeSelectorType[(NodeSelectorType['Id'] = 1)] = 'Id';
  NodeSelectorType[(NodeSelectorType['Obj'] = 2)] = 'Obj';
})(NodeSelectorType || (NodeSelectorType = {}));

const getPublicActions = (actions) => {
  const {
    addLinkedNodeFromTree,
    setDOM,
    setNodeEvent,
    replaceNodes,
    reset,
    ...EditorActions
  } = actions;
  return EditorActions;
};
function useEditor(collect) {
  const {
    connectors,
    actions: internalActions,
    query,
    store,
    ...collected
  } = useInternalEditor(collect);
  const EditorActions = getPublicActions(internalActions);
  const actions = useMemo(() => {
    return {
      ...EditorActions,
      history: {
        ...EditorActions.history,
        ignore: (...args) =>
          getPublicActions(EditorActions.history.ignore(...args)),
        throttle: (...args) =>
          getPublicActions(EditorActions.history.throttle(...args)),
      },
    };
  }, [EditorActions]);
  return {
    connectors,
    actions,
    query,
    store,
    ...collected,
  };
}

function connectEditor(collect) {
  return (WrappedComponent) => {
    return (props) => {
      const Editor = collect ? useEditor(collect) : useEditor();
      return React__default.createElement(WrappedComponent, {
        ...Editor,
        ...props,
      });
    };
  };
}

function connectNode(collect) {
  return function (WrappedComponent) {
    return (props) => {
      const node = useNode(collect);
      return React__default.createElement(WrappedComponent, {
        ...node,
        ...props,
      });
    };
  };
}

const fromEntries = (pairs) => {
  if (Object.fromEntries) {
    return Object.fromEntries(pairs);
  }
  return pairs.reduce((accum, _ref) => {
    let [id, value] = _ref;
    return _objectSpread2(
      _objectSpread2({}, accum),
      {},
      {
        [id]: value,
      }
    );
  }, {});
};

const getNodesFromSelector = (nodes, selector, config) => {
  const items = Array.isArray(selector) ? selector : [selector];
  const mergedConfig = _objectSpread2(
    {
      existOnly: false,
      idOnly: false,
    },
    config || {}
  );
  const nodeSelectors = items
    .filter((item) => !!item)
    .map((item) => {
      if (typeof item === 'string') {
        return {
          node: nodes[item],
          exists: !!nodes[item],
        };
      }
      if (typeof item === 'object' && !mergedConfig.idOnly) {
        const node = item;
        return {
          node,
          exists: !!nodes[node.id],
        };
      }
      return {
        node: null,
        exists: false,
      };
    });
  if (mergedConfig.existOnly) {
    invariant(
      nodeSelectors.filter((selector) => !selector.exists).length === 0,
      ERROR_INVALID_NODEID
    );
  }
  return nodeSelectors;
};

const removeNodeFromEvents = (state, nodeId) =>
  Object.keys(state.events).forEach((key) => {
    const eventSet = state.events[key];
    if (eventSet && eventSet.has && eventSet.has(nodeId)) {
      state.events[key] = new Set(
        Array.from(eventSet).filter((id) => nodeId !== id)
      );
    }
  });

const _excluded$1 = ['history'];
const Methods = (state, query) => {
  /** Helper functions */
  const addNodeTreeToParent = (tree, parentId, addNodeType) => {
    const iterateChildren = (id, parentId) => {
      const node = tree.nodes[id];
      if (typeof node.data.type !== 'string') {
        invariant(
          state.options.resolver[node.data.name],
          ERROR_NOT_IN_RESOLVER.replace(
            '%node_type%',
            ''.concat(node.data.type.name)
          )
        );
      }
      state.nodes[id] = _objectSpread2(
        _objectSpread2({}, node),
        {},
        {
          data: _objectSpread2(
            _objectSpread2({}, node.data),
            {},
            {
              parent: parentId,
            }
          ),
        }
      );
      if (node.data.nodes.length > 0) {
        delete state.nodes[id].data.props.children;
        node.data.nodes.forEach((childNodeId) =>
          iterateChildren(childNodeId, node.id)
        );
      }
      Object.values(node.data.linkedNodes).forEach((linkedNodeId) =>
        iterateChildren(linkedNodeId, node.id)
      );
    };
    iterateChildren(tree.rootNodeId, parentId);
    if (!parentId && tree.rootNodeId === ROOT_NODE) {
      return;
    }
    const parent = getParentAndValidate(parentId);
    if (addNodeType.type === 'child') {
      const index = addNodeType.index;
      if (index != null) {
        parent.data.nodes.splice(index, 0, tree.rootNodeId);
      } else {
        parent.data.nodes.push(tree.rootNodeId);
      }
      return;
    }
    parent.data.linkedNodes[addNodeType.id] = tree.rootNodeId;
  };
  const getParentAndValidate = (parentId) => {
    invariant(parentId, ERROR_NOPARENT);
    const parent = state.nodes[parentId];
    invariant(parent, ERROR_INVALID_NODEID);
    return parent;
  };
  const deleteNode = (id) => {
    const targetNode = state.nodes[id],
      parentNode = state.nodes[targetNode.data.parent];
    if (targetNode.data.nodes) {
      // we deep clone here because otherwise immer will mutate the node
      // object as we remove nodes
      [...targetNode.data.nodes].forEach((childId) => deleteNode(childId));
    }
    if (targetNode.data.linkedNodes) {
      Object.values(targetNode.data.linkedNodes).map((linkedNodeId) =>
        deleteNode(linkedNodeId)
      );
    }
    const isChildNode = parentNode.data.nodes.includes(id);
    if (isChildNode) {
      const parentChildren = parentNode.data.nodes;
      parentChildren.splice(parentChildren.indexOf(id), 1);
    } else {
      const linkedId = Object.keys(parentNode.data.linkedNodes).find(
        (id) => parentNode.data.linkedNodes[id] === id
      );
      if (linkedId) {
        delete parentNode.data.linkedNodes[linkedId];
      }
    }
    removeNodeFromEvents(state, id);
    delete state.nodes[id];
  };
  return {
    /**
     * @private
     * Add a new linked Node to the editor.
     * Only used internally by the <Element /> component
     *
     * @param tree
     * @param parentId
     * @param id
     */
    addLinkedNodeFromTree(tree, parentId, id) {
      const parent = getParentAndValidate(parentId);
      const existingLinkedNode = parent.data.linkedNodes[id];
      if (existingLinkedNode) {
        deleteNode(existingLinkedNode);
      }
      addNodeTreeToParent(tree, parentId, {
        type: 'linked',
        id,
      });
    },
    /**
     * Add a new Node to the editor.
     *
     * @param nodeToAdd
     * @param parentId
     * @param index
     */
    add(nodeToAdd, parentId, index) {
      // TODO: Deprecate adding array of Nodes to keep implementation simpler
      let nodes = [nodeToAdd];
      if (Array.isArray(nodeToAdd)) {
        deprecationWarning('actions.add(node: Node[])', {
          suggest: 'actions.add(node: Node)',
        });
        nodes = nodeToAdd;
      }
      nodes.forEach((node) => {
        addNodeTreeToParent(
          {
            nodes: {
              [node.id]: node,
            },
            rootNodeId: node.id,
          },
          parentId,
          {
            type: 'child',
            index,
          }
        );
      });
    },
    /**
     * Add a NodeTree to the editor
     *
     * @param tree
     * @param parentId
     * @param index
     */
    addNodeTree(tree, parentId, index) {
      addNodeTreeToParent(tree, parentId, {
        type: 'child',
        index,
      });
    },
    /**
     * Delete a Node
     * @param id
     */
    delete(selector) {
      const targets = getNodesFromSelector(state.nodes, selector, {
        existOnly: true,
        idOnly: true,
      });
      targets.forEach((_ref) => {
        let { node } = _ref;
        invariant(
          !query.node(node.id).isTopLevelNode(),
          ERROR_DELETE_TOP_LEVEL_NODE
        );
        deleteNode(node.id);
      });
    },
    deserialize(input) {
      const dehydratedNodes =
        typeof input == 'string' ? JSON.parse(input) : input;
      const nodePairs = Object.keys(dehydratedNodes).map((id) => {
        let nodeId = id;
        if (id === DEPRECATED_ROOT_NODE) {
          nodeId = ROOT_NODE;
        }
        return [
          nodeId,
          query
            .parseSerializedNode(dehydratedNodes[id])
            .toNode((node) => (node.id = nodeId)),
        ];
      });
      this.replaceNodes(fromEntries(nodePairs));
    },
    /**
     * Move a target Node to a new Parent at a given index
     * @param targetId
     * @param newParentId
     * @param index
     */
    move(selector, newParentId, index) {
      const targets = getNodesFromSelector(state.nodes, selector, {
        existOnly: true,
      });
      const newParent = state.nodes[newParentId];
      const nodesArrToCleanup = new Set();
      targets.forEach((_ref2, i) => {
        let { node: targetNode } = _ref2;
        const targetId = targetNode.id;
        const currentParentId = targetNode.data.parent;
        query.node(newParentId).isDroppable([targetId], (err) => {
          throw new Error(err);
        });
        // modify node props
        state.options.onBeforeMoveEnd(
          targetNode,
          newParent,
          state.nodes[currentParentId]
        );
        const currentParent = state.nodes[currentParentId];
        const currentParentNodes = currentParent.data.nodes;
        nodesArrToCleanup.add(currentParentNodes);
        const oldIndex = currentParentNodes.indexOf(targetId);
        currentParentNodes[oldIndex] = '$$'; // mark for deletion
        newParent.data.nodes.splice(index + i, 0, targetId);
        state.nodes[targetId].data.parent = newParentId;
      });
      nodesArrToCleanup.forEach((nodes) => {
        const length = nodes.length;
        [...nodes].reverse().forEach((value, index) => {
          if (value !== '$$') {
            return;
          }
          nodes.splice(length - 1 - index, 1);
        });
      });
    },
    replaceNodes(nodes) {
      this.clearEvents();
      state.nodes = nodes;
    },
    clearEvents() {
      this.setNodeEvent('selected', null);
      this.setNodeEvent('hovered', null);
      this.setNodeEvent('dragged', null);
      this.setIndicator(null);
    },
    /**
     * Resets all the editor state.
     */
    reset() {
      this.clearEvents();
      this.replaceNodes({});
    },
    /**
     * Set editor options via a callback function
     *
     * @param cb: function used to set the options.
     */
    setOptions(cb) {
      cb(state.options);
    },
    setNodeEvent(eventType, nodeIdSelector) {
      state.events[eventType].forEach((id) => {
        if (state.nodes[id]) {
          state.nodes[id].events[eventType] = false;
        }
      });
      state.events[eventType] = new Set();
      if (!nodeIdSelector) {
        return;
      }
      const targets = getNodesFromSelector(state.nodes, nodeIdSelector, {
        idOnly: true,
        existOnly: true,
      });
      const nodeIds = new Set(
        targets.map((_ref3) => {
          let { node } = _ref3;
          return node.id;
        })
      );
      nodeIds.forEach((id) => {
        state.nodes[id].events[eventType] = true;
      });
      state.events[eventType] = nodeIds;
    },
    /**
     * Set custom values to a Node
     * @param id
     * @param cb
     */
    setCustom(selector, cb) {
      const targets = getNodesFromSelector(state.nodes, selector, {
        idOnly: true,
        existOnly: true,
      });
      targets.forEach((_ref4) => {
        let { node } = _ref4;
        return cb(state.nodes[node.id].data.custom);
      });
    },
    /**
     * Given a `id`, it will set the `dom` porperty of that node.
     *
     * @param id of the node we want to set
     * @param dom
     */
    setDOM(id, dom) {
      if (!state.nodes[id]) {
        return;
      }
      state.nodes[id].dom = dom;
    },
    setIndicator(indicator) {
      if (
        indicator &&
        (!indicator.placement.parent.dom ||
          (indicator.placement.currentNode &&
            !indicator.placement.currentNode.dom))
      )
        return;
      state.indicator = indicator;
    },
    /**
     * Hide a Node
     * @param id
     * @param bool
     */
    setHidden(id, bool) {
      state.nodes[id].data.hidden = bool;
    },
    /**
     * Update the props of a Node
     * @param id
     * @param cb
     */
    setProp(selector, cb) {
      const targets = getNodesFromSelector(state.nodes, selector, {
        idOnly: true,
        existOnly: true,
      });
      targets.forEach((_ref5) => {
        let { node } = _ref5;
        return cb(state.nodes[node.id].data.props);
      });
    },
    selectNode(nodeIdSelector) {
      if (nodeIdSelector) {
        const targets = getNodesFromSelector(state.nodes, nodeIdSelector, {
          idOnly: true,
          existOnly: true,
        });
        this.setNodeEvent(
          'selected',
          targets.map((_ref6) => {
            let { node } = _ref6;
            return node.id;
          })
        );
      } else {
        this.setNodeEvent('selected', null);
      }
      this.setNodeEvent('hovered', null);
    },
  };
};
const ActionMethods = (state, query) => {
  return _objectSpread2(
    _objectSpread2({}, Methods(state, query)),
    {},
    {
      // Note: Beware: advanced method! You most likely don't need to use this
      // TODO: fix parameter types and cleanup the method
      setState(cb) {
        const _this = this,
          actions = _objectWithoutProperties(_this, _excluded$1);
        // We pass the other actions as the second parameter, so that devs could still make use of the predefined actions
        cb(state, actions);
      },
    }
  );
};

function EventHelpers(state, eventType) {
  const event = state.events[eventType];
  return {
    contains(id) {
      return event.has(id);
    },
    isEmpty() {
      return this.all().length === 0;
    },
    first() {
      const values = this.all();
      return values[0];
    },
    last() {
      const values = this.all();
      return values[values.length - 1];
    },
    all() {
      return Array.from(event);
    },
    size() {
      return this.all().length;
    },
    at(i) {
      return this.all()[i];
    },
    raw() {
      return event;
    },
  };
}

let CACHED_RESOLVER_DATA = null;
const getReversedResolver = (resolver) => {
  if (CACHED_RESOLVER_DATA && CACHED_RESOLVER_DATA.resolver === resolver) {
    return CACHED_RESOLVER_DATA.reversed;
  }
  CACHED_RESOLVER_DATA = {
    resolver,
    reversed: new Map(),
  };
  for (const [name, comp] of Object.entries(resolver)) {
    CACHED_RESOLVER_DATA.reversed.set(comp, name);
  }
  return CACHED_RESOLVER_DATA.reversed;
};
const getComponentName = (component) => {
  return component.name || component.displayName;
};
const searchComponentInResolver = (resolver, comp) => {
  const name = getReversedResolver(resolver).get(comp);
  return name !== undefined ? name : null;
};
const resolveComponent = (resolver, comp) => {
  if (typeof comp === 'string') {
    return comp;
  }
  const resolvedName = searchComponentInResolver(resolver, comp);
  invariant(
    resolvedName,
    ERROR_NOT_IN_RESOLVER.replace('%node_type%', getComponentName(comp))
  );
  return resolvedName;
};

const reduceType = (type, resolver) => {
  if (typeof type === 'string') {
    return type;
  }
  return { resolvedName: resolveComponent(resolver, type) };
};
const serializeComp = (data, resolver) => {
  let { type, isCanvas, props } = data;
  props = Object.keys(props).reduce((result, key) => {
    const prop = props[key];
    if (prop === undefined || prop === null || typeof prop === 'function') {
      return result;
    }
    if (key === 'children' && typeof prop !== 'string') {
      result[key] = Children.map(prop, (child) => {
        if (typeof child === 'string') {
          return child;
        }
        return serializeComp(child, resolver);
      });
    } else if (typeof prop.type === 'function') {
      result[key] = serializeComp(prop, resolver);
    } else {
      result[key] = prop;
    }
    return result;
  }, {});
  return {
    type: reduceType(type, resolver),
    isCanvas: !!isCanvas,
    props,
  };
};
const serializeNode = (data, resolver) => {
  const { type, props, isCanvas, name, ...nodeData } = data;
  const reducedComp = serializeComp({ type, isCanvas, props }, resolver);
  return {
    ...reducedComp,
    ...nodeData,
  };
};

function NodeHelpers(state, id) {
  invariant(typeof id == 'string', ERROR_INVALID_NODE_ID);
  const node = state.nodes[id];
  const nodeHelpers = (id) => NodeHelpers(state, id);
  return {
    isCanvas() {
      return !!node.data.isCanvas;
    },
    isRoot() {
      return node.id === ROOT_NODE;
    },
    isLinkedNode() {
      return (
        node.data.parent &&
        nodeHelpers(node.data.parent).linkedNodes().includes(node.id)
      );
    },
    isTopLevelNode() {
      return this.isRoot() || this.isLinkedNode();
    },
    isDeletable() {
      return !this.isTopLevelNode();
    },
    isParentOfTopLevelNodes: () =>
      node.data.linkedNodes && Object.keys(node.data.linkedNodes).length > 0,
    isParentOfTopLevelCanvas() {
      deprecationWarning('query.node(id).isParentOfTopLevelCanvas', {
        suggest: 'query.node(id).isParentOfTopLevelNodes',
      });
      return this.isParentOfTopLevelNodes();
    },
    isSelected() {
      return state.events.selected.has(id);
    },
    isHovered() {
      return state.events.hovered.has(id);
    },
    isDragged() {
      return state.events.dragged.has(id);
    },
    get() {
      return node;
    },
    ancestors() {
      let deep =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : false;
      function appendParentNode(id) {
        let ancestors =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : [];
        let depth =
          arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        const node = state.nodes[id];
        if (!node) {
          return ancestors;
        }
        ancestors.push(id);
        if (!node.data.parent) {
          return ancestors;
        }
        if (deep || (!deep && depth === 0)) {
          ancestors = appendParentNode(node.data.parent, ancestors, depth + 1);
        }
        return ancestors;
      }
      return appendParentNode(node.data.parent);
    },
    descendants() {
      let deep =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : false;
      let includeOnly = arguments.length > 1 ? arguments[1] : undefined;
      function appendChildNode(id) {
        let descendants =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : [];
        let depth =
          arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        if (deep || (!deep && depth === 0)) {
          const node = state.nodes[id];
          if (!node) {
            return descendants;
          }
          if (includeOnly !== 'childNodes') {
            // Include linkedNodes if any
            const linkedNodes = nodeHelpers(id).linkedNodes();
            linkedNodes.forEach((nodeId) => {
              descendants.push(nodeId);
              descendants = appendChildNode(nodeId, descendants, depth + 1);
            });
          }
          if (includeOnly !== 'linkedNodes') {
            const childNodes = nodeHelpers(id).childNodes();
            childNodes.forEach((nodeId) => {
              descendants.push(nodeId);
              descendants = appendChildNode(nodeId, descendants, depth + 1);
            });
          }
          return descendants;
        }
        return descendants;
      }
      return appendChildNode(id);
    },
    linkedNodes() {
      return Object.values(node.data.linkedNodes || {});
    },
    childNodes() {
      return node.data.nodes || [];
    },
    isDraggable(onError) {
      try {
        const targetNode = node;
        invariant(!this.isTopLevelNode(), ERROR_MOVE_TOP_LEVEL_NODE);
        invariant(
          NodeHelpers(state, targetNode.data.parent).isCanvas(),
          ERROR_MOVE_NONCANVAS_CHILD
        );
        invariant(
          targetNode.rules.canDrag(targetNode, nodeHelpers),
          ERROR_CANNOT_DRAG
        );
        return true;
      } catch (err) {
        if (onError) {
          onError(err);
        }
        return false;
      }
    },
    isDroppable(selector, onError) {
      const targets = getNodesFromSelector(state.nodes, selector);
      const newParentNode = node;
      try {
        invariant(this.isCanvas(), ERROR_MOVE_TO_NONCANVAS_PARENT);
        invariant(
          newParentNode.rules.canMoveIn(
            targets.map((selector) => selector.node),
            newParentNode,
            nodeHelpers
          ),
          ERROR_MOVE_INCOMING_PARENT
        );
        const parentNodes = {};
        targets.forEach((_ref) => {
          let { node: targetNode, exists } = _ref;
          invariant(
            targetNode.rules.canDrop(newParentNode, targetNode, nodeHelpers),
            ERROR_MOVE_CANNOT_DROP
          );
          // Ignore other checking if the Node is new
          if (!exists) {
            return;
          }
          invariant(
            !nodeHelpers(targetNode.id).isTopLevelNode(),
            ERROR_MOVE_TOP_LEVEL_NODE
          );
          const targetDeepNodes = nodeHelpers(targetNode.id).descendants(true);
          invariant(
            !targetDeepNodes.includes(newParentNode.id) &&
              newParentNode.id !== targetNode.id,
            ERROR_MOVE_TO_DESCENDANT
          );
          const currentParentNode =
            targetNode.data.parent && state.nodes[targetNode.data.parent];
          invariant(
            currentParentNode.data.isCanvas,
            ERROR_MOVE_NONCANVAS_CHILD
          );
          invariant(
            currentParentNode ||
              (!currentParentNode && !state.nodes[targetNode.id]),
            ERROR_DUPLICATE_NODEID
          );
          if (currentParentNode.id !== newParentNode.id) {
            if (!parentNodes[currentParentNode.id]) {
              parentNodes[currentParentNode.id] = [];
            }
            parentNodes[currentParentNode.id].push(targetNode);
          }
        });
        Object.keys(parentNodes).forEach((parentNodeId) => {
          const childNodes = parentNodes[parentNodeId];
          const parentNode = state.nodes[parentNodeId];
          invariant(
            parentNode.rules.canMoveOut(childNodes, parentNode, nodeHelpers),
            ERROR_MOVE_OUTGOING_PARENT
          );
        });
        return true;
      } catch (err) {
        if (onError) {
          onError(err);
        }
        return false;
      }
    },
    toSerializedNode() {
      return serializeNode(node.data, state.options.resolver);
    },
    toNodeTree(includeOnly) {
      const nodes = [id, ...this.descendants(true, includeOnly)].reduce(
        (accum, descendantId) => {
          accum[descendantId] = nodeHelpers(descendantId).get();
          return accum;
        },
        {}
      );
      return {
        rootNodeId: id,
        nodes,
      };
    },
    /**
     Deprecated NodeHelpers
     **/
    decendants() {
      let deep =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : false;
      deprecationWarning('query.node(id).decendants', {
        suggest: 'query.node(id).descendants',
      });
      return this.descendants(deep);
    },
    isTopLevelCanvas() {
      return !this.isRoot() && !node.data.parent;
    },
  };
}

function findPosition(parent, dims, posX, posY) {
  let result = {
    parent,
    index: 0,
    where: 'before',
  };
  let leftLimit = 0,
    xLimit = 0,
    dimRight = 0,
    yLimit = 0,
    xCenter = 0,
    yCenter = 0,
    dimDown = 0;
  // Each dim is: Top, Left, Height, Width
  for (let i = 0, len = dims.length; i < len; i++) {
    const dim = dims[i];
    // Right position of the element. Left + Width
    dimRight = dim.left + dim.outerWidth;
    // Bottom position of the element. Top + Height
    dimDown = dim.top + dim.outerHeight;
    // X center position of the element. Left + (Width / 2)
    xCenter = dim.left + dim.outerWidth / 2;
    // Y center position of the element. Top + (Height / 2)
    yCenter = dim.top + dim.outerHeight / 2;
    // Skip if over the limits
    if (
      (xLimit && dim.left > xLimit) ||
      (yLimit && yCenter >= yLimit) ||
      // >= avoid issue with clearfixes
      (leftLimit && dimRight < leftLimit)
    )
      continue;
    result.index = i;
    // If it's not in flow (like 'float' element)
    if (!dim.inFlow) {
      if (posY < dimDown) yLimit = dimDown;
      //If x lefter than center
      if (posX < xCenter) {
        xLimit = xCenter;
        result.where = 'before';
      } else {
        leftLimit = xCenter;
        result.where = 'after';
      }
    } else {
      // If y upper than center
      if (posY < yCenter) {
        result.where = 'before';
        break;
      } else result.where = 'after'; // After last element
    }
  }
  return result;
}

const getNodeTypeName = (type) => (typeof type == 'string' ? type : type.name);
function createNode(newNode, normalize) {
  let actualType = newNode.data.type;
  let id = newNode.id || getRandomId();
  const node = {
    id,
    _hydrationTimestamp: Date.now(),
    data: _objectSpread2(
      {
        type: actualType,
        name: getNodeTypeName(actualType),
        displayName: getNodeTypeName(actualType),
        props: {},
        custom: {},
        parent: null,
        isCanvas: false,
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
      newNode.data
    ),
    info: {},
    related: {},
    events: {
      selected: false,
      dragged: false,
      hovered: false,
    },
    rules: {
      canDrag: () => true,
      canDrop: () => true,
      canMoveIn: () => true,
      canMoveOut: () => true,
    },
    dom: null,
  };
  // @ts-ignore
  if (node.data.type === Element$1 || node.data.type === Canvas) {
    const mergedProps = _objectSpread2(
      _objectSpread2({}, defaultElementProps),
      node.data.props
    );
    node.data.props = Object.keys(node.data.props).reduce((props, key) => {
      if (Object.keys(defaultElementProps).includes(key)) {
        // If a <Element /> specific props is found (ie: "is", "canvas")
        // Replace the node.data with the value specified in the prop
        node.data[elementPropToNodeData[key] || key] = mergedProps[key];
      } else {
        // Otherwise include the props in the node as usual
        props[key] = node.data.props[key];
      }
      return props;
    }, {});
    actualType = node.data.type;
    node.data.name = getNodeTypeName(actualType);
    node.data.displayName = getNodeTypeName(actualType);
    const usingDeprecatedCanvas = node.data.type === Canvas;
    if (usingDeprecatedCanvas) {
      node.data.isCanvas = true;
      deprecateCanvasComponent();
    }
  }
  if (normalize) {
    normalize(node);
  }
  // TODO: use UserComponentConfig type
  const userComponentConfig = actualType.craft;
  if (userComponentConfig) {
    node.data.displayName =
      userComponentConfig.displayName ||
      userComponentConfig.name ||
      node.data.displayName;
    node.data.props = _objectSpread2(
      _objectSpread2(
        {},
        userComponentConfig.props || userComponentConfig.defaultProps || {}
      ),
      node.data.props
    );
    node.data.custom = _objectSpread2(
      _objectSpread2({}, userComponentConfig.custom || {}),
      node.data.custom
    );
    if (
      userComponentConfig.isCanvas !== undefined &&
      userComponentConfig.isCanvas !== null
    ) {
      node.data.isCanvas = userComponentConfig.isCanvas;
    }
    if (userComponentConfig.rules) {
      Object.keys(userComponentConfig.rules).forEach((key) => {
        if (['canDrag', 'canDrop', 'canMoveIn', 'canMoveOut'].includes(key)) {
          node.rules[key] = userComponentConfig.rules[key];
        }
      });
    }
    if (userComponentConfig.related) {
      const relatedNodeContext = {
        id: node.id,
        related: true,
      };
      Object.keys(userComponentConfig.related).forEach((comp) => {
        node.related[comp] = (props) =>
          React__default.createElement(
            NodeProvider,
            relatedNodeContext,
            React__default.createElement(
              userComponentConfig.related[comp],
              props
            )
          );
      });
    }
    if (userComponentConfig.info) {
      node.info = userComponentConfig.info;
    }
  }
  return node;
}

const restoreType = (type, resolver) =>
  typeof type === 'object' && type.resolvedName
    ? type.resolvedName === 'Canvas'
      ? Canvas
      : resolver[type.resolvedName]
    : typeof type === 'string'
    ? type
    : null;
const deserializeComp = (data, resolver, index) => {
  let { type, props } = data;
  const main = restoreType(type, resolver);
  if (!main) {
    return;
  }
  props = Object.keys(props).reduce((result, key) => {
    const prop = props[key];
    if (prop === null || prop === undefined) {
      result[key] = null;
    } else if (typeof prop === 'object' && prop.resolvedName) {
      result[key] = deserializeComp(prop, resolver);
    } else if (key === 'children' && Array.isArray(prop)) {
      result[key] = prop.map((child) => {
        if (typeof child === 'string') {
          return child;
        }
        return deserializeComp(child, resolver);
      });
    } else {
      result[key] = prop;
    }
    return result;
  }, {});
  if (index) {
    props.key = index;
  }
  const jsx = {
    ...React__default.createElement(main, {
      ...props,
    }),
  };
  return {
    ...jsx,
    name: resolveComponent(resolver, jsx.type),
  };
};
const deserializeNode = (data, resolver) => {
  const { type: Comp, props: Props, ...nodeData } = data;
  const isCompAnHtmlElement = Comp !== undefined && typeof Comp === 'string';
  const isCompAUserComponent =
    Comp !== undefined && Comp.resolvedName !== undefined;
  invariant(
    isCompAnHtmlElement || isCompAUserComponent,
    ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER.replace(
      '%displayName%',
      data.displayName
    ).replace('%availableComponents%', Object.keys(resolver).join(', '))
  );
  const { type, name, props } = deserializeComp(data, resolver);
  const { parent, custom, displayName, isCanvas, nodes, hidden } = nodeData;
  const linkedNodes = nodeData.linkedNodes || nodeData._childCanvas;
  return {
    type,
    name,
    displayName: displayName || name,
    props,
    custom: custom || {},
    isCanvas: !!isCanvas,
    hidden: !!hidden,
    parent,
    linkedNodes: linkedNodes || {},
    nodes: nodes || [],
  };
};

const mergeNodes = (rootNode, childrenNodes) => {
  if (childrenNodes.length < 1) {
    return { [rootNode.id]: rootNode };
  }
  const nodes = childrenNodes.map(({ rootNodeId }) => rootNodeId);
  const nodeWithChildren = { ...rootNode, data: { ...rootNode.data, nodes } };
  const rootNodes = { [rootNode.id]: nodeWithChildren };
  return childrenNodes.reduce((accum, tree) => {
    const currentNode = tree.nodes[tree.rootNodeId];
    return {
      ...accum,
      ...tree.nodes,
      // set the parent id for the current node
      [currentNode.id]: {
        ...currentNode,
        data: {
          ...currentNode.data,
          parent: rootNode.id,
        },
      },
    };
  }, rootNodes);
};
const mergeTrees = (rootNode, childrenNodes) => ({
  rootNodeId: rootNode.id,
  nodes: mergeNodes(rootNode, childrenNodes),
});

function parseNodeFromJSX(jsx, normalize) {
  let element = jsx;
  if (typeof element === 'string') {
    element = React__default.createElement(Fragment, {}, element);
  }
  let actualType = element.type;
  return createNode(
    {
      data: {
        type: actualType,
        props: { ...element.props },
      },
    },
    (node) => {
      if (normalize) {
        normalize(node, element);
      }
    }
  );
}

function QueryMethods(state) {
  const options = state && state.options;
  const _ = () => QueryMethods(state);
  return {
    /**
     * Determine the best possible location to drop the source Node relative to the target Node
     *
     * TODO: replace with Positioner.computeIndicator();
     */
    getDropPlaceholder: (
      source,
      target,
      pos,
      nodesToDOM = (node) => state.nodes[node.id].dom
    ) => {
      const targetNode = state.nodes[target],
        isTargetCanvas = _().node(targetNode.id).isCanvas();
      const targetParent = isTargetCanvas
        ? targetNode
        : state.nodes[targetNode.data.parent];
      if (!targetParent) return;
      const targetParentNodes = targetParent.data.nodes || [];
      const dimensionsInContainer = targetParentNodes
        ? targetParentNodes.reduce((result, id) => {
            const dom = nodesToDOM(state.nodes[id]);
            if (dom) {
              const info = {
                id,
                ...getDOMInfo(dom),
              };
              result.push(info);
            }
            return result;
          }, [])
        : [];
      const dropAction = findPosition(
        targetParent,
        dimensionsInContainer,
        pos.x,
        pos.y
      );
      const currentNode =
        targetParentNodes.length &&
        state.nodes[targetParentNodes[dropAction.index]];
      const output = {
        placement: {
          ...dropAction,
          currentNode,
        },
        error: null,
      };
      const sourceNodes = getNodesFromSelector(state.nodes, source);
      sourceNodes.forEach(({ node, exists }) => {
        // If source Node is already in the editor, check if it's draggable
        if (exists) {
          _()
            .node(node.id)
            .isDraggable((err) => (output.error = err));
        }
      });
      // Check if source Node is droppable in target
      _()
        .node(targetParent.id)
        .isDroppable(source, (err) => (output.error = err));
      return output;
    },
    /**
     * Get the current Editor options
     */
    getOptions() {
      return options;
    },
    getNodes() {
      return state.nodes;
    },
    /**
     * Helper methods to describe the specified Node
     * @param id
     */
    node(id) {
      return NodeHelpers(state, id);
    },
    /**
     * Returns all the `nodes` in a serialized format
     */
    getSerializedNodes() {
      const nodePairs = Object.keys(state.nodes).map((id) => [
        id,
        this.node(id).toSerializedNode(),
      ]);
      return fromEntries(nodePairs);
    },
    getEvent(eventType) {
      return EventHelpers(state, eventType);
    },
    /**
     * Retrieve the JSON representation of the editor's Nodes
     */
    serialize() {
      return JSON.stringify(this.getSerializedNodes());
    },
    parseReactElement: (reactElement) => ({
      toNodeTree(normalize) {
        let node = parseNodeFromJSX(reactElement, (node, jsx) => {
          const name = resolveComponent(state.options.resolver, node.data.type);
          node.data.displayName = node.data.displayName || name;
          node.data.name = name;
          if (normalize) {
            normalize(node, jsx);
          }
        });
        let childrenNodes = [];
        if (reactElement.props && reactElement.props.children) {
          childrenNodes = React__default.Children.toArray(
            reactElement.props.children
          ).reduce((accum, child) => {
            if (React__default.isValidElement(child)) {
              accum.push(_().parseReactElement(child).toNodeTree(normalize));
            }
            return accum;
          }, []);
        }
        return mergeTrees(node, childrenNodes);
      },
    }),
    parseSerializedNode: (serializedNode) => ({
      toNode(normalize) {
        const data = deserializeNode(serializedNode, state.options.resolver);
        invariant(data.type, ERROR_NOT_IN_RESOLVER);
        const id = typeof normalize === 'string' && normalize;
        if (id) {
          deprecationWarning(`query.parseSerializedNode(...).toNode(id)`, {
            suggest: `query.parseSerializedNode(...).toNode(node => node.id = id)`,
          });
        }
        return _()
          .parseFreshNode({
            ...(id ? { id } : {}),
            data,
          })
          .toNode(!id && normalize);
      },
    }),
    parseFreshNode: (node) => ({
      toNode(normalize) {
        return createNode(node, (node) => {
          if (node.data.parent === DEPRECATED_ROOT_NODE) {
            node.data.parent = ROOT_NODE;
          }
          const name = resolveComponent(state.options.resolver, node.data.type);
          invariant(name !== null, ERROR_NOT_IN_RESOLVER);
          node.data.displayName = node.data.displayName || name;
          node.data.name = name;
          if (normalize) {
            normalize(node);
          }
        });
      },
    }),
    createNode(reactElement, extras) {
      deprecationWarning(`query.createNode(${reactElement})`, {
        suggest: `query.parseReactElement(${reactElement}).toNodeTree()`,
      });
      const tree = this.parseReactElement(reactElement).toNodeTree();
      const node = tree.nodes[tree.rootNodeId];
      if (!extras) {
        return node;
      }
      if (extras.id) {
        node.id = extras.id;
      }
      if (extras.data) {
        node.data = {
          ...node.data,
          ...extras.data,
        };
      }
      return node;
    },
    getState() {
      return state;
    },
  };
}

class CoreEventHandlers extends EventHandlers {
  handlers() {
    return {
      connect: (el, id) => {},
      select: (el, id) => {},
      hover: (el, id) => {},
      drag: (el, id) => {},
      drop: (el, id) => {},
      create: (el, UserElement, options) => {},
    };
  }
}
class DerivedCoreEventHandlers extends DerivedEventHandlers {}

// Hack: to trigger dragend event immediate
// Otherwise we would have to wait until the native animation is completed before we can actually drop an block
const documentDragoverEventHandler = (e) => {
  e.preventDefault();
};
/**
 * Positioner is responsible for computing the drop Indicator during a sequence of drag-n-drop events
 */
class Positioner {
  constructor(store, dragTarget) {
    _defineProperty(this, 'store', void 0);
    _defineProperty(this, 'dragTarget', void 0);
    // Current Node being hovered on
    _defineProperty(this, 'currentDropTargetId', void 0);
    // Current closest Canvas Node relative to the currentDropTarget
    _defineProperty(this, 'currentDropTargetCanvasAncestorId', void 0);
    _defineProperty(this, 'currentIndicator', null);
    _defineProperty(this, 'currentTargetId', void 0);
    _defineProperty(this, 'currentTargetChildDimensions', void 0);
    _defineProperty(this, 'dragError', void 0);
    _defineProperty(this, 'draggedNodes', void 0);
    _defineProperty(this, 'onScrollListener', void 0);
    this.store = store;
    this.dragTarget = dragTarget;
    this.currentDropTargetId = null;
    this.currentDropTargetCanvasAncestorId = null;
    this.currentTargetId = null;
    this.currentTargetChildDimensions = null;
    this.currentIndicator = null;
    this.dragError = null;
    this.draggedNodes = this.getDraggedNodes();
    this.validateDraggedNodes();
    this.onScrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScrollListener, true);
    window.addEventListener('dragover', documentDragoverEventHandler, false);
  }
  cleanup() {
    window.removeEventListener('scroll', this.onScrollListener, true);
    window.removeEventListener('dragover', documentDragoverEventHandler, false);
  }
  onScroll(e) {
    const scrollBody = e.target;
    const rootNode = this.store.query.node(ROOT_NODE).get();
    // Clear the currentTargetChildDimensions if the user has scrolled
    // Because we will have to recompute new dimensions relative to the new scroll pos
    const shouldClearChildDimensionsCache =
      scrollBody instanceof Element &&
      rootNode &&
      rootNode.dom &&
      scrollBody.contains(rootNode.dom);
    if (!shouldClearChildDimensionsCache) {
      return;
    }
    this.currentTargetChildDimensions = null;
  }
  getDraggedNodes() {
    if (this.dragTarget.type === 'new') {
      return getNodesFromSelector(
        this.store.query.getNodes(),
        this.dragTarget.tree.nodes[this.dragTarget.tree.rootNodeId]
      );
    }
    return getNodesFromSelector(
      this.store.query.getNodes(),
      this.dragTarget.nodes
    );
  }
  // Check if the elements being dragged are allowed to be dragged
  validateDraggedNodes() {
    // We don't need to check for dragTarget.type = "new" because those nodes are not yet in the state (ie: via the .create() connector)
    if (this.dragTarget.type === 'new') {
      return;
    }
    this.draggedNodes.forEach((_ref) => {
      let { node, exists } = _ref;
      if (!exists) {
        return;
      }
      this.store.query.node(node.id).isDraggable((err) => {
        this.dragError = err;
      });
    });
  }
  isNearBorders(domInfo, x, y) {
    const { top, bottom, left, right } = domInfo;
    if (
      top + Positioner.BORDER_OFFSET > y ||
      bottom - Positioner.BORDER_OFFSET < y ||
      left + Positioner.BORDER_OFFSET > x ||
      right - Positioner.BORDER_OFFSET < x
    ) {
      return true;
    }
    return false;
  }
  isDiff(newPosition) {
    if (
      this.currentIndicator &&
      this.currentIndicator.placement.parent.id === newPosition.parent.id &&
      this.currentIndicator.placement.index === newPosition.index &&
      this.currentIndicator.placement.where === newPosition.where
    ) {
      return false;
    }
    return true;
  }
  /**
   * Get dimensions of every child Node in the specified parent Node
   */
  getChildDimensions(newParentNode) {
    // Use previously computed child dimensions if newParentNode is the same as the previous one
    const existingTargetChildDimensions = this.currentTargetChildDimensions;
    if (
      this.currentTargetId === newParentNode.id &&
      existingTargetChildDimensions
    ) {
      return existingTargetChildDimensions;
    }
    return newParentNode.data.nodes.reduce((result, id) => {
      const dom = this.store.query.node(id).get().dom;
      if (dom) {
        result.push(
          _objectSpread2(
            {
              id,
            },
            getDOMInfo(dom)
          )
        );
      }
      return result;
    }, []);
  }
  /**
   * Get closest Canvas node relative to the dropTargetId
   * Return dropTargetId if it itself is a Canvas node
   *
   * In most cases it will be the dropTarget itself or its immediate parent.
   * We typically only need to traverse 2 levels or more if the dropTarget is a linked node
   *
   * TODO: We should probably have some special rules to handle linked nodes
   */
  getCanvasAncestor(dropTargetId) {
    // If the dropTargetId is the same as the previous one
    // Return the canvas ancestor node that we found previuously
    if (
      dropTargetId === this.currentDropTargetId &&
      this.currentDropTargetCanvasAncestorId
    ) {
      const node = this.store.query
        .node(this.currentDropTargetCanvasAncestorId)
        .get();
      if (node) {
        return node;
      }
    }
    const getCanvas = (nodeId) => {
      const node = this.store.query.node(nodeId).get();
      if (node && node.data.isCanvas) {
        return node;
      }
      if (!node.data.parent) {
        return null;
      }
      return getCanvas(node.data.parent);
    };
    return getCanvas(dropTargetId);
  }
  /**
   * Compute a new Indicator object based on the dropTarget and x,y coords
   * Returns null if theres no change from the previous Indicator
   */
  computeIndicator(dropTargetId, x, y) {
    let newParentNode = this.getCanvasAncestor(dropTargetId);
    if (!newParentNode) {
      return;
    }
    this.currentDropTargetId = dropTargetId;
    this.currentDropTargetCanvasAncestorId = newParentNode.id;
    // Get parent if we're hovering at the border of the current node
    if (
      newParentNode.data.parent &&
      this.isNearBorders(getDOMInfo(newParentNode.dom), x, y) &&
      // Ignore if linked node because there's won't be an adjacent sibling anyway
      !this.store.query.node(newParentNode.id).isLinkedNode()
    ) {
      newParentNode = this.store.query.node(newParentNode.data.parent).get();
    }
    if (!newParentNode) {
      return;
    }
    this.currentTargetChildDimensions = this.getChildDimensions(newParentNode);
    this.currentTargetId = newParentNode.id;
    const position = findPosition(
      newParentNode,
      this.currentTargetChildDimensions,
      x,
      y
    );
    // Ignore if the position is similar as the previous one
    if (!this.isDiff(position)) {
      return;
    }
    let error = this.dragError;
    // Last thing to check for is if the dragged nodes can be dropped in the target area
    if (!error) {
      this.store.query.node(newParentNode.id).isDroppable(
        this.draggedNodes.map((sourceNode) => sourceNode.node),
        (dropError) => {
          error = dropError;
        }
      );
    }
    const currentNodeId = newParentNode.data.nodes[position.index];
    const currentNode =
      currentNodeId && this.store.query.node(currentNodeId).get();
    this.currentIndicator = {
      placement: _objectSpread2(
        _objectSpread2({}, position),
        {},
        {
          currentNode,
        }
      ),
      error,
    };
    return this.currentIndicator;
  }
  getIndicator() {
    return this.currentIndicator;
  }
}
_defineProperty(Positioner, 'BORDER_OFFSET', 10);

// Works partially with Linux (except on Chrome)
// We'll need an alternate way to create drag shadows
const createShadow = function (e, shadowsToCreate) {
  let forceSingleShadow =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (shadowsToCreate.length === 1 || forceSingleShadow) {
    const { width, height } = shadowsToCreate[0].getBoundingClientRect();
    const shadow = shadowsToCreate[0].cloneNode(true);
    shadow.style.position = 'absolute';
    shadow.style.left = '-100%';
    shadow.style.top = '-100%';
    shadow.style.width = ''.concat(width, 'px');
    shadow.style.height = ''.concat(height, 'px');
    shadow.style.pointerEvents = 'none';
    shadow.classList.add('drag-shadow');
    document.body.appendChild(shadow);
    e.dataTransfer.setDragImage(shadow, 0, 0);
    return shadow;
  }
  /**
   * If there's supposed to be multiple drag shadows, we will create a single container div to store them
   * That container will be used as the drag shadow for the current drag event
   */
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-100%';
  container.style.top = '-100%';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.classList.add('drag-shadow-container');
  shadowsToCreate.forEach((dom) => {
    const { width, height, top, left } = dom.getBoundingClientRect();
    const shadow = dom.cloneNode(true);
    shadow.style.position = 'absolute';
    shadow.style.left = ''.concat(left, 'px');
    shadow.style.top = ''.concat(top, 'px');
    shadow.style.width = ''.concat(width, 'px');
    shadow.style.height = ''.concat(height, 'px');
    shadow.classList.add('drag-shadow');
    container.appendChild(shadow);
  });
  document.body.appendChild(container);
  e.dataTransfer.setDragImage(container, e.clientX, e.clientY);
  return container;
};

/**
 * Specifies Editor-wide event handlers and connectors
 */
class DefaultEventHandlers extends CoreEventHandlers {
  constructor() {
    super(...arguments);
    _defineProperty(this, 'draggedElementShadow', void 0);
    _defineProperty(this, 'dragTarget', void 0);
    _defineProperty(this, 'positioner', null);
    _defineProperty(this, 'currentSelectedElementIds', []);
  }
  onDisable() {
    this.options.store.actions.clearEvents();
  }
  handlers() {
    const store = this.options.store;
    return {
      connect: (el, id) => {
        store.actions.setDOM(id, el);
        return this.reflect((connectors) => {
          connectors.select(el, id);
          connectors.hover(el, id);
          connectors.drop(el, id);
        });
      },
      select: (el, id) => {
        const unbindOnMouseDown = this.addCraftEventListener(
          el,
          'mousedown',
          (e) => {
            e.craft.stopPropagation();
            let newSelectedElementIds = [];
            if (id) {
              const { query } = store;
              const selectedElementIds = query.getEvent('selected').all();
              const isMultiSelect = this.options.isMultiSelectEnabled(e);
              /**
               * Retain the previously select elements if the multi-select condition is enabled
               * or if the currentNode is already selected
               *
               * so users can just click to drag the selected elements around without holding the multi-select key
               */
              if (isMultiSelect || selectedElementIds.includes(id)) {
                newSelectedElementIds = selectedElementIds.filter(
                  (selectedId) => {
                    const descendants = query
                      .node(selectedId)
                      .descendants(true);
                    const ancestors = query.node(selectedId).ancestors(true);
                    // Deselect ancestors/descendants
                    if (descendants.includes(id) || ancestors.includes(id)) {
                      return false;
                    }
                    return true;
                  }
                );
              }
              if (!newSelectedElementIds.includes(id)) {
                newSelectedElementIds.push(id);
              }
            }
            store.actions.setNodeEvent('selected', newSelectedElementIds);
          }
        );
        const unbindOnClick = this.addCraftEventListener(el, 'click', (e) => {
          e.craft.stopPropagation();
          const { query } = store;
          const selectedElementIds = query.getEvent('selected').all();
          const isMultiSelect = this.options.isMultiSelectEnabled(e);
          const isNodeAlreadySelected = this.currentSelectedElementIds.includes(
            id
          );
          let newSelectedElementIds = [...selectedElementIds];
          if (isMultiSelect && isNodeAlreadySelected) {
            newSelectedElementIds.splice(newSelectedElementIds.indexOf(id), 1);
            store.actions.setNodeEvent('selected', newSelectedElementIds);
          } else if (!isMultiSelect && selectedElementIds.length > 1) {
            newSelectedElementIds = [id];
            store.actions.setNodeEvent('selected', newSelectedElementIds);
          }
          this.currentSelectedElementIds = newSelectedElementIds;
        });
        return () => {
          unbindOnMouseDown();
          unbindOnClick();
        };
      },
      hover: (el, id) => {
        const unbindMouseover = this.addCraftEventListener(
          el,
          'mouseover',
          (e) => {
            e.craft.stopPropagation();
            store.actions.setNodeEvent('hovered', id);
          }
        );
        let unbindMouseleave = null;
        if (this.options.removeHoverOnMouseleave) {
          unbindMouseleave = this.addCraftEventListener(
            el,
            'mouseleave',
            (e) => {
              e.craft.stopPropagation();
              store.actions.setNodeEvent('hovered', null);
            }
          );
        }
        return () => {
          unbindMouseover();
          if (!unbindMouseleave) {
            return;
          }
          unbindMouseleave();
        };
      },
      drop: (el, targetId) => {
        const unbindDragOver = this.addCraftEventListener(
          el,
          'dragover',
          (e) => {
            e.craft.stopPropagation();
            e.preventDefault();
            if (!this.positioner) {
              return;
            }
            const indicator = this.positioner.computeIndicator(
              targetId,
              e.clientX,
              e.clientY
            );
            if (!indicator) {
              return;
            }
            store.actions.setIndicator(indicator);
          }
        );
        const unbindDragEnter = this.addCraftEventListener(
          el,
          'dragenter',
          (e) => {
            e.craft.stopPropagation();
            e.preventDefault();
          }
        );
        return () => {
          unbindDragEnter();
          unbindDragOver();
        };
      },
      drag: (el, id) => {
        if (!store.query.node(id).isDraggable()) {
          return () => {};
        }
        el.setAttribute('draggable', 'true');
        const unbindDragStart = this.addCraftEventListener(
          el,
          'dragstart',
          (e) => {
            e.craft.stopPropagation();
            const { query, actions } = store;
            let selectedElementIds = query.getEvent('selected').all();
            const isMultiSelect = this.options.isMultiSelectEnabled(e);
            const isNodeAlreadySelected = this.currentSelectedElementIds.includes(
              id
            );
            if (!isNodeAlreadySelected) {
              if (isMultiSelect) {
                selectedElementIds = [...selectedElementIds, id];
              } else {
                selectedElementIds = [id];
              }
              store.actions.setNodeEvent('selected', selectedElementIds);
            }
            actions.setNodeEvent('dragged', selectedElementIds);
            const selectedDOMs = selectedElementIds.map(
              (id) => query.node(id).get().dom
            );
            this.draggedElementShadow = createShadow(
              e,
              selectedDOMs,
              DefaultEventHandlers.forceSingleDragShadow
            );
            this.dragTarget = {
              type: 'existing',
              nodes: selectedElementIds,
            };
            this.positioner = new Positioner(
              this.options.store,
              this.dragTarget
            );
          }
        );
        const unbindDragEnd = this.addCraftEventListener(el, 'dragend', (e) => {
          e.craft.stopPropagation();
          this.dropElement((dragTarget, indicator) => {
            if (dragTarget.type === 'new') {
              return;
            }
            const index =
              indicator.placement.index +
              (indicator.placement.where === 'after' ? 1 : 0);
            store.actions.move(
              dragTarget.nodes,
              indicator.placement.parent.id,
              index
            );
          });
        });
        return () => {
          el.setAttribute('draggable', 'false');
          unbindDragStart();
          unbindDragEnd();
        };
      },
      create: (el, userElement, options) => {
        el.setAttribute('draggable', 'true');
        const unbindDragStart = this.addCraftEventListener(
          el,
          'dragstart',
          (e) => {
            e.craft.stopPropagation();
            let tree;
            if (typeof userElement === 'function') {
              const result = userElement();
              if (React__default.isValidElement(result)) {
                tree = store.query.parseReactElement(result).toNodeTree();
              } else {
                tree = result;
              }
            } else {
              tree = store.query.parseReactElement(userElement).toNodeTree();
            }
            const dom = e.currentTarget;
            this.draggedElementShadow = createShadow(
              e,
              [dom],
              DefaultEventHandlers.forceSingleDragShadow
            );
            this.dragTarget = {
              type: 'new',
              tree,
            };
            this.positioner = new Positioner(
              this.options.store,
              this.dragTarget
            );
          }
        );
        const unbindDragEnd = this.addCraftEventListener(el, 'dragend', (e) => {
          e.craft.stopPropagation();
          this.dropElement((dragTarget, indicator) => {
            if (dragTarget.type === 'existing') {
              return;
            }
            const index =
              indicator.placement.index +
              (indicator.placement.where === 'after' ? 1 : 0);
            store.actions.addNodeTree(
              dragTarget.tree,
              indicator.placement.parent.id,
              index
            );
            if (options && isFunction(options.onCreate)) {
              options.onCreate(dragTarget.tree);
            }
          });
        });
        return () => {
          el.removeAttribute('draggable');
          unbindDragStart();
          unbindDragEnd();
        };
      },
    };
  }
  dropElement(onDropNode) {
    const store = this.options.store;
    if (!this.positioner) {
      return;
    }
    const draggedElementShadow = this.draggedElementShadow;
    const indicator = this.positioner.getIndicator();
    if (this.dragTarget && indicator && !indicator.error) {
      onDropNode(this.dragTarget, indicator);
    }
    if (draggedElementShadow) {
      draggedElementShadow.parentNode.removeChild(draggedElementShadow);
      this.draggedElementShadow = null;
    }
    this.dragTarget = null;
    store.actions.setIndicator(null);
    store.actions.setNodeEvent('dragged', null);
    this.positioner.cleanup();
    this.positioner = null;
  }
}
/**
 * Note: Multiple drag shadows (ie: via multiselect in v0.2 and higher) do not look good on Linux Chromium due to way it renders drag shadows in general,
 * so will have to fallback to the single shadow approach above for the time being
 * see: https://bugs.chromium.org/p/chromium/issues/detail?id=550999
 */
_defineProperty(
  DefaultEventHandlers,
  'forceSingleDragShadow',
  isChromium() && isLinux()
);

function movePlaceholder(
  pos,
  canvasDOMInfo,
  // which canvas is cursor at
  bestTargetDomInfo
) {
  let thickness =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
  let t = 0,
    l = 0,
    w = 0,
    h = 0,
    where = pos.where;
  let mode = 'line';
  const elDim = bestTargetDomInfo;
  // Show block area for empty containers or when dropping into container
  if (!elDim) {
    mode = 'block';
    if (canvasDOMInfo) {
      t = canvasDOMInfo.top + canvasDOMInfo.padding.top;
      l = canvasDOMInfo.left + canvasDOMInfo.padding.left;
      w =
        canvasDOMInfo.outerWidth -
        canvasDOMInfo.padding.right -
        canvasDOMInfo.padding.left -
        canvasDOMInfo.margin.left -
        canvasDOMInfo.margin.right;
      h =
        canvasDOMInfo.outerHeight -
        canvasDOMInfo.padding.top -
        canvasDOMInfo.padding.bottom -
        canvasDOMInfo.margin.top -
        canvasDOMInfo.margin.bottom;
      // Minimum height for better visibility
      h = Math.max(h, 40);
    }
  } else {
    // Line indicator for before/after
    mode = 'line';
    // If it's not in flow (like 'float' element)
    if (!elDim.inFlow) {
      w = thickness;
      h = elDim.outerHeight;
      t = elDim.top;
      l = where === 'before' ? elDim.left : elDim.left + elDim.outerWidth;
    } else {
      w = elDim.outerWidth;
      h = thickness;
      t = where === 'before' ? elDim.top : elDim.bottom;
      l = elDim.left;
    }
  }
  return {
    top: ''.concat(t, 'px'),
    left: ''.concat(l, 'px'),
    width: ''.concat(w, 'px'),
    height: ''.concat(h, 'px'),
    mode,
  };
}

const RenderEditorIndicator = () => {
  const { indicator, indicatorOptions, enabled } = useInternalEditor(
    (state) => ({
      indicator: state.indicator,
      indicatorOptions: state.options.indicator,
      enabled: state.options.enabled,
    })
  );
  const handler = useEventHandler();
  useEffect(() => {
    if (!handler) {
      return;
    }
    if (!enabled) {
      handler.disable();
      return;
    }
    handler.enable();
  }, [enabled, handler]);
  if (!indicator) {
    return null;
  }
  const placeholderInfo = movePlaceholder(
    indicator.placement,
    getDOMInfo(indicator.placement.parent.dom),
    indicator.placement.currentNode &&
      getDOMInfo(indicator.placement.currentNode.dom),
    indicatorOptions.thickness
  );
  const isBlockMode = placeholderInfo.mode === 'block';
  const baseColor = indicator.error
    ? indicatorOptions.error
    : indicatorOptions.success;
  return React__default.createElement(RenderIndicator, {
    className: indicatorOptions.className,
    style: {
      top: placeholderInfo.top,
      left: placeholderInfo.left,
      width: placeholderInfo.width,
      height: placeholderInfo.height,
      // Apply different styles based on mode
      ...(isBlockMode
        ? {
            // Block area styles - subtle outline with corner accents
            backgroundColor: `${baseColor}08`, // 08 = ~3% opacity (very subtle)
            border: `2px solid ${baseColor}`,
            borderRadius: '6px',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            // Add subtle shadow for depth
            boxShadow: `0 0 0 4px ${baseColor}10, inset 0 0 20px ${baseColor}15`,
            // Smooth transition
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }
        : {
            // Line styles (existing behavior)
            backgroundColor: baseColor,
            borderWidth: 0,
          }),
      transition: indicatorOptions.transition || '0.2s ease-in',
      ...(indicatorOptions.style ?? {}),
    },
    parentDom: indicator.placement.parent.dom,
  });
};

const Events = ({ children }) => {
  const store = useContext(EditorContext);
  const handler = useMemo(() => store.query.getOptions().handlers(store), [
    store,
  ]);
  if (!handler) {
    return null;
  }
  return React__default.createElement(
    EventHandlerContext.Provider,
    { value: handler },
    React__default.createElement(RenderEditorIndicator, null),
    children
  );
};

const editorInitialState = {
  nodes: {},
  events: {
    dragged: new Set(),
    selected: new Set(),
    hovered: new Set(),
  },
  indicator: null,
  options: {
    onNodesChange: () => null,
    onRender: ({ render }) => render,
    onBeforeMoveEnd: () => null,
    resolver: {},
    enabled: true,
    indicator: {
      error: 'red',
      success: 'rgb(98, 196, 98)',
    },
    handlers: (store) =>
      new DefaultEventHandlers({
        store,
        removeHoverOnMouseleave: false,
        isMultiSelectEnabled: (e) => !!e.metaKey,
      }),
    normalizeNodes: () => {},
  },
};
const ActionMethodsWithConfig = {
  methods: ActionMethods,
  ignoreHistoryForActions: [
    'setDOM',
    'setNodeEvent',
    'selectNode',
    'clearEvents',
    'setOptions',
    'setIndicator',
  ],
  normalizeHistory: (state) => {
    /**
     * On every undo/redo, we remove events pointing to deleted Nodes
     */
    Object.keys(state.events).forEach((eventName) => {
      const nodeIds = Array.from(state.events[eventName] || []);
      nodeIds.forEach((id) => {
        if (!state.nodes[id]) {
          state.events[eventName].delete(id);
        }
      });
    });
    // Remove any invalid node[nodeId].events
    // TODO(prev): it's really cumbersome to have to ensure state.events and state.nodes[nodeId].events are in sync
    // Find a way to make it so that once state.events is set, state.nodes[nodeId] automatically reflects that (maybe using proxies?)
    Object.keys(state.nodes).forEach((id) => {
      const node = state.nodes[id];
      Object.keys(node.events).forEach((eventName) => {
        const isEventActive = !!node.events[eventName];
        if (
          isEventActive &&
          state.events[eventName] &&
          !state.events[eventName].has(node.id)
        ) {
          node.events[eventName] = false;
        }
      });
    });
  },
};
const useEditorStore = (options, patchListener) => {
  // TODO: fix type
  return useMethods(
    ActionMethodsWithConfig,
    {
      ...editorInitialState,
      options: {
        ...editorInitialState.options,
        ...options,
      },
    },
    QueryMethods,
    patchListener
  );
};

/**
 * A React Component that provides the Editor context
 */
const Editor = ({ children, ...options }) => {
  // we do not want to warn the user if no resolver was supplied
  if (options.resolver !== undefined) {
    invariant(
      typeof options.resolver === 'object' &&
        !Array.isArray(options.resolver) &&
        options.resolver !== null,
      ERROR_RESOLVER_NOT_AN_OBJECT
    );
  }
  const optionsRef = React.useRef(options);
  const context = useEditorStore(
    optionsRef.current,
    (state, previousState, actionPerformedWithPatches, query, normalizer) => {
      if (!actionPerformedWithPatches) {
        return;
      }
      const { patches, ...actionPerformed } = actionPerformedWithPatches;
      for (let i = 0; i < patches.length; i++) {
        const { path } = patches[i];
        const isModifyingNodeData =
          path.length > 2 && path[0] === 'nodes' && path[2] === 'data';
        let actionType = actionPerformed.type;
        if (
          [HISTORY_ACTIONS.IGNORE, HISTORY_ACTIONS.THROTTLE].includes(
            actionType
          ) &&
          actionPerformed.params
        ) {
          actionPerformed.type = actionPerformed.params[0];
        }
        if (
          ['setState', 'deserialize'].includes(actionPerformed.type) ||
          isModifyingNodeData
        ) {
          normalizer((draft) => {
            if (state.options.normalizeNodes) {
              state.options.normalizeNodes(
                draft,
                previousState,
                actionPerformed,
                query
              );
            }
          });
          break; // we exit the loop as soon as we find a change in node.data
        }
      }
    }
  );
  // sync enabled prop with editor store options
  React.useEffect(() => {
    if (!context) {
      return;
    }
    if (
      options.enabled === undefined ||
      context.query.getOptions().enabled === options.enabled
    ) {
      return;
    }
    context.actions.setOptions((editorOptions) => {
      editorOptions.enabled = options.enabled;
    });
  }, [context, options.enabled]);
  React.useEffect(() => {
    context.subscribe(
      (_) => ({
        json: context.query.serialize(),
      }),
      () => {
        context.query.getOptions().onNodesChange(context.query);
      }
    );
  }, [context]);
  if (!context) {
    return null;
  }
  return React.createElement(
    EditorContext.Provider,
    { value: context },
    React.createElement(Events, null, children)
  );
};

const _excluded = ['events', 'data'],
  _excluded2 = ['nodes'],
  _excluded3 = ['nodes'],
  _excluded4 = ['_hydrationTimestamp', 'rules'],
  _excluded5 = ['_hydrationTimestamp', 'rules'];
const getTestNode = (parentNode) => {
  const {
      events,
      data: { nodes: childNodes, linkedNodes },
    } = parentNode,
    restParentNode = _objectWithoutProperties(parentNode, _excluded);
  const validParentNode = createNode(cloneDeep(parentNode));
  parentNode = _objectSpread2(
    _objectSpread2(_objectSpread2({}, validParentNode), restParentNode),
    {},
    {
      events: _objectSpread2(
        _objectSpread2({}, validParentNode.events),
        events
      ),
      dom: parentNode.dom || validParentNode.dom,
    }
  );
  return {
    node: parentNode,
    childNodes,
    linkedNodes,
  };
};
const expectEditorState = (lhs, rhs) => {
  const { nodes: nodesRhs } = rhs,
    restRhs = _objectWithoutProperties(rhs, _excluded2);
  const { nodes: nodesLhs } = lhs,
    restLhs = _objectWithoutProperties(lhs, _excluded3);
  expect(restLhs).toEqual(restRhs);
  const nodesRhsSimplified = Object.keys(nodesRhs).reduce((accum, id) => {
    const _nodesRhs$id = nodesRhs[id],
      node = _objectWithoutProperties(_nodesRhs$id, _excluded4);
    accum[id] = node;
    return accum;
  }, {});
  const nodesLhsSimplified = Object.keys(nodesLhs).reduce((accum, id) => {
    const _nodesLhs$id = nodesLhs[id],
      node = _objectWithoutProperties(_nodesLhs$id, _excluded5);
    accum[id] = node;
    return accum;
  }, {});
  expect(nodesLhsSimplified).toEqual(nodesRhsSimplified);
};
const createTestNodes = (rootNode) => {
  const nodes = {};
  const iterateNodes = (testNode) => {
    const { node: parentNode, childNodes, linkedNodes } = getTestNode(testNode);
    nodes[parentNode.id] = parentNode;
    if (childNodes) {
      childNodes.forEach((childTestNode, i) => {
        const {
          node: childNode,
          childNodes: grandChildNodes,
          linkedNodes: grandChildLinkedNodes,
        } = getTestNode(childTestNode);
        childNode.data.parent = parentNode.id;
        nodes[childNode.id] = childNode;
        parentNode.data.nodes[i] = childNode.id;
        iterateNodes(
          _objectSpread2(
            _objectSpread2({}, childNode),
            {},
            {
              data: _objectSpread2(
                _objectSpread2({}, childNode.data),
                {},
                {
                  nodes: grandChildNodes || [],
                  linkedNodes: grandChildLinkedNodes || {},
                }
              ),
            }
          )
        );
      });
    }
    if (linkedNodes) {
      Object.keys(linkedNodes).forEach((linkedId) => {
        const {
          node: childNode,
          childNodes: grandChildNodes,
          linkedNodes: grandChildLinkedNodes,
        } = getTestNode(linkedNodes[linkedId]);
        parentNode.data.linkedNodes[linkedId] = childNode.id;
        childNode.data.parent = parentNode.id;
        nodes[childNode.id] = childNode;
        iterateNodes(
          _objectSpread2(
            _objectSpread2({}, childNode),
            {},
            {
              data: _objectSpread2(
                _objectSpread2({}, childNode.data),
                {},
                {
                  nodes: grandChildNodes || [],
                  linkedNodes: grandChildLinkedNodes || {},
                }
              ),
            }
          )
        );
      });
    }
  };
  iterateNodes(rootNode);
  return nodes;
};
const createTestState = function () {
  let state =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const { nodes: rootNode, events } = state;
  return _objectSpread2(
    _objectSpread2(_objectSpread2({}, editorInitialState), state),
    {},
    {
      nodes: rootNode ? createTestNodes(rootNode) : {},
      events: _objectSpread2(
        _objectSpread2({}, editorInitialState.events),
        events || {}
      ),
    }
  );
};

export {
  ActionMethodsWithConfig,
  Canvas,
  CoreEventHandlers,
  DefaultEventHandlers,
  DerivedCoreEventHandlers,
  Editor,
  Element$1 as Element,
  Events,
  Frame,
  NodeElement,
  NodeHelpers,
  NodeProvider,
  NodeSelectorType,
  Positioner,
  QueryMethods,
  connectEditor,
  connectNode,
  createShadow,
  createTestNodes,
  createTestState,
  defaultElementProps,
  deprecateCanvasComponent,
  editorInitialState,
  elementPropToNodeData,
  expectEditorState,
  serializeNode,
  useEditor,
  useEditorStore,
  useEventHandler,
  useNode,
};
//# sourceMappingURL=index.js.map
