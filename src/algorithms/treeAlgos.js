/* ==========================================================================
   BST (BINARY SEARCH TREE) ALGORITHM GENERATORS
   ========================================================================== */

export const treeComplexity = {
  insert: { time: 'O(log n) avg', space: 'O(log n)', label: 'BST Insert' },
  delete: { time: 'O(log n) avg', space: 'O(log n)', label: 'BST Delete' },
  find: { time: 'O(log n) avg', space: 'O(1)', label: 'BST Search' },
  traverse: { time: 'O(n)', space: 'O(n)', label: 'BST Traversals' }
};

export const treePseudocode = {
  insert: {
    pseudocode: [
      'function insert(node, value) {',
      '  if (node == null) return new Node(value)',
      '  if (value < node.value) {',
      '    node.left = insert(node.left, value)',
      '  } else {',
      '    node.right = insert(node.right, value)',
      '  }',
      '  return node',
      '}'
    ],
    python: [
      'def insert(node, value):',
      '  if node is None: return Node(value)',
      '  if value < node.value:',
      '    node.left = insert(node.left, value)',
      '  else:',
      '    node.right = insert(node.right, value)',
      '  # end if',
      '  return node',
      '# end def'
    ],
    java: [
      'Node insert(Node node, int value) {',
      '  if (node == null) return new Node(value);',
      '  if (value < node.value) {',
      '    node.left = insert(node.left, value);',
      '  } else {',
      '    node.right = insert(node.right, value);',
      '  }',
      '  return node;',
      '}'
    ],
    cpp: [
      'Node* insert(Node* node, int value) {',
      '  if (node == nullptr) return new Node(value);',
      '  if (value < node->value) {',
      '    node->left = insert(node->left, value);',
      '  } else {',
      '    node->right = insert(node->right, value);',
      '  }',
      '  return node;',
      '}'
    ],
    c: [
      'Node* insert(Node* node, int value) {',
      '  if (node == NULL) return createNode(value);',
      '  if (value < node->value) {',
      '    node->left = insert(node->left, value);',
      '  } else {',
      '    node->right = insert(node->right, value);',
      '  }',
      '  return node;',
      '}'
    ]
  },
  delete: {
    pseudocode: [
      'function delete(node, value) {',
      '  if (node == null) return null',
      '  if (value < node.value) node.left = delete(node.left, value)',
      '  else if (value > node.value) node.right = delete(node.right, value)',
      '  else { // Found node to delete',
      '    if (node.left == null) return node.right',
      '    if (node.right == null) return node.left',
      '    successor = getMin(node.right)',
      '    node.value = successor.value',
      '    node.right = delete(node.right, successor.value)',
      '  }',
      '}'
    ],
    python: [
      'def delete(node, value):',
      '  if node is None: return None',
      '  if value < node.value: node.left = delete(node.left, value)',
      '  elif value > node.value: node.right = delete(node.right, value)',
      '  else: # Found node to delete',
      '    if node.left is None: return node.right',
      '    if node.right is None: return node.left',
      '    successor = get_min(node.right)',
      '    node.value = successor.value',
      '    node.right = delete(node.right, successor.value)',
      '  # end if',
      '# end def'
    ],
    java: [
      'Node delete(Node node, int value) {',
      '  if (node == null) return null;',
      '  if (value < node.value) node.left = delete(node.left, value);',
      '  else if (value > node.value) node.right = delete(node.right, value);',
      '  else { // Found node to delete',
      '    if (node.left == null) return node.right;',
      '    if (node.right == null) return node.left;',
      '    Node successor = getMin(node.right);',
      '    node.value = successor.value;',
      '    node.right = delete(node.right, successor.value);',
      '  }',
      '}'
    ],
    cpp: [
      'Node* deleteNode(Node* node, int value) {',
      '  if (node == nullptr) return nullptr;',
      '  if (value < node->value) node->left = deleteNode(node->left, value);',
      '  else if (value > node->value) node->right = deleteNode(node->right, value);',
      '  else { // Found node to delete',
      '    if (node->left == nullptr) return node->right;',
      '    if (node->right == nullptr) return node->left;',
      '    Node* successor = getMin(node->right);',
      '    node->value = successor->value;',
      '    node->right = deleteNode(node->right, successor->value);',
      '  }',
      '}'
    ],
    c: [
      'Node* deleteNode(Node* node, int value) {',
      '  if (node == NULL) return NULL;',
      '  if (value < node->value) node->left = deleteNode(node->left, value);',
      '  else if (value > node->value) node->right = deleteNode(node->right, value);',
      '  else { // Found node to delete',
      '    if (node->left == NULL) return node->right;',
      '    if (node->right == NULL) return node->left;',
      '    Node* successor = getMin(node->right);',
      '    node->value = successor->value;',
      '    node->right = deleteNode(node->right, successor->value);',
      '  }',
      '}'
    ]
  },
  find: {
    pseudocode: [
      'function search(node, value) {',
      '  if (node == null) return false',
      '  if (value == node.value) return true',
      '  if (value < node.value) {',
      '    return search(node.left, value)',
      '  } else {',
      '    return search(node.right, value)',
      '  }',
      '}'
    ],
    python: [
      'def search(node, value):',
      '  if node is None: return False',
      '  if value == node.value: return True',
      '  if value < node.value:',
      '    return search(node.left, value)',
      '  else:',
      '    return search(node.right, value)',
      '  # end if',
      '# end def'
    ],
    java: [
      'boolean search(Node node, int value) {',
      '  if (node == null) return false;',
      '  if (value == node.value) return true;',
      '  if (value < node.value) {',
      '    return search(node.left, value);',
      '  } else {',
      '    return search(node.right, value);',
      '  }',
      '}'
    ],
    cpp: [
      'bool search(Node* node, int value) {',
      '  if (node == nullptr) return false;',
      '  if (value == node->value) return true;',
      '  if (value < node->value) {',
      '    return search(node->left, value);',
      '  } else {',
      '    return search(node->right, value);',
      '  }',
      '}'
    ],
    c: [
      'bool search(Node* node, int value) {',
      '  if (node == NULL) return false;',
      '  if (value == node->value) return true;',
      '  if (value < node->value) {',
      '    return search(node->left, value);',
      '  } else {',
      '    return search(node->right, value);',
      '  }',
      '}'
    ]
  },
  traverse: {
    pseudocode: [
      'function inorder(node) {',
      '  if (node == null) return',
      '  inorder(node.left)',
      '  visit(node)',
      '  inorder(node.right)',
      '}'
    ],
    python: [
      'def inorder(node):',
      '  if node is None: return',
      '  inorder(node.left)',
      '  visit(node)',
      '  inorder(node.right)',
      '# end def'
    ],
    java: [
      'void inorder(Node node) {',
      '  if (node == null) return;',
      '  inorder(node.left);',
      '  visit(node);',
      '  inorder(node.right);',
      '}'
    ],
    cpp: [
      'void inorder(Node* node) {',
      '  if (node == nullptr) return;',
      '  inorder(node->left);',
      '  visit(node);',
      '  inorder(node->right);',
      '}'
    ],
    c: [
      'void inorder(Node* node) {',
      '  if (node == NULL) return;',
      '  inorder(node->left);',
      '  visit(node);',
      '  inorder(node->right);',
      '}'
    ]
  }
};

// Deep copy helper for the tree structure to trigger React updates
export function cloneTree(node) {
  if (!node) return null;
  const copy = {
    id: node.id,
    val: node.val,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    x: node.x,
    y: node.y
  };
  return copy;
}

// Layout helper: computes (x, y) coordinates for each node in a grid
export function layoutTree(node, x = 400, y = 50, level = 1, widthOffset = 180) {
  if (!node) return;
  node.x = x;
  node.y = y;
  layoutTree(node.left, x - widthOffset / Math.pow(1.5, level - 1), y + 65, level + 1, widthOffset);
  layoutTree(node.right, x + widthOffset / Math.pow(1.5, level - 1), y + 65, level + 1, widthOffset);
}

// Generator for BST insertion
export function* treeInsertGen(root, newVal) {
  let tempRoot = cloneTree(root);
  let idCounter = Math.floor(Math.random() * 1000000);

  function* insertHelper(node, val, parent, dir) {
    if (!node) {
      const newNode = { id: idCounter, val, left: null, right: null };
      if (!parent) {
        tempRoot = newNode;
      } else {
        parent[dir] = newNode;
      }
      layoutTree(tempRoot);
      yield { type: 'success', activeId: newNode.id, tree: cloneTree(tempRoot), line: 1 };
      return newNode;
    }

    yield { type: 'compare', activeId: node.id, tree: cloneTree(tempRoot), line: 2 };
    
    if (val < node.val) {
      yield { type: 'compare', activeId: node.id, tree: cloneTree(tempRoot), line: 3 };
      node.left = yield* insertHelper(node.left, val, node, 'left');
    } else {
      yield { type: 'compare', activeId: node.id, tree: cloneTree(tempRoot), line: 5 };
      node.right = yield* insertHelper(node.right, val, node, 'right');
    }
    return node;
  }

  yield* insertHelper(tempRoot, newVal, null, null);
}

// Generator for BST search
export function* treeFindGen(root, findVal) {
  const tempRoot = cloneTree(root);
  
  function* searchHelper(node, val) {
    if (!node) {
      yield { type: 'fail', activeId: null, tree: tempRoot, line: 1 };
      return false;
    }

    yield { type: 'compare', activeId: node.id, tree: tempRoot, line: 2 };
    if (val === node.val) {
      yield { type: 'success', activeId: node.id, tree: tempRoot, line: 2 };
      return true;
    }

    if (val < node.val) {
      yield { type: 'compare', activeId: node.id, tree: tempRoot, line: 3 };
      return yield* searchHelper(node.left, val);
    } else {
      yield { type: 'compare', activeId: node.id, tree: tempRoot, line: 5 };
      return yield* searchHelper(node.right, val);
    }
  }

  yield* searchHelper(tempRoot, findVal);
}

// Generator for BST deletion
export function* treeDeleteGen(root, deleteVal) {
  let tempRoot = cloneTree(root);

  function getMin(node) {
    let curr = node;
    while (curr.left) {
      curr = curr.left;
    }
    return curr;
  }

  function* deleteHelper(node, val, parent, dir) {
    if (!node) {
      yield { type: 'fail', activeId: null, tree: cloneTree(tempRoot), line: 1 };
      return null;
    }

    yield { type: 'compare', activeId: node.id, tree: cloneTree(tempRoot), line: 2 };
    if (val < node.val) {
      node.left = yield* deleteHelper(node.left, val, node, 'left');
    } else if (val > node.val) {
      yield { type: 'compare', activeId: node.id, tree: cloneTree(tempRoot), line: 3 };
      node.right = yield* deleteHelper(node.right, val, node, 'right');
    } else {
      // Found the node
      yield { type: 'match', activeId: node.id, tree: cloneTree(tempRoot), line: 4 };

      if (!node.left) {
        yield { type: 'success', activeId: node.id, tree: cloneTree(tempRoot), line: 5 };
        if (!parent) tempRoot = node.right;
        else parent[dir] = node.right;
        layoutTree(tempRoot);
        return node.right;
      }
      if (!node.right) {
        yield { type: 'success', activeId: node.id, tree: cloneTree(tempRoot), line: 6 };
        if (!parent) tempRoot = node.left;
        else parent[dir] = node.left;
        layoutTree(tempRoot);
        return node.left;
      }

      // Two children: successor
      yield { type: 'successor', activeId: node.id, tree: cloneTree(tempRoot), line: 7 };
      const successor = getMin(node.right);
      yield { type: 'successor', activeId: successor.id, tree: cloneTree(tempRoot), line: 8 };

      node.val = successor.val;
      yield { type: 'overwrite', activeId: node.id, tree: cloneTree(tempRoot), line: 8 };
      
      node.right = yield* deleteHelper(node.right, successor.val, node, 'right');
    }
    layoutTree(tempRoot);
    return node;
  }

  yield* deleteHelper(tempRoot, deleteVal, null, null);
}

// Generator for tree traversals
export function* treeTraverseGen(root, mode) {
  const path = [];

  function* inorder(node) {
    if (!node) return;
    yield { type: 'compare', activeId: node.id, line: 1 };
    yield* inorder(node.left);
    path.push(node.val);
    yield { type: 'success', activeId: node.id, path: path.slice(), line: 3 };
    yield* inorder(node.right);
  }

  function* preorder(node) {
    if (!node) return;
    yield { type: 'compare', activeId: node.id, line: 1 };
    path.push(node.val);
    yield { type: 'success', activeId: node.id, path: path.slice(), line: 2 };
    yield* preorder(node.left);
    yield* preorder(node.right);
  }

  function* postorder(node) {
    if (!node) return;
    yield { type: 'compare', activeId: node.id, line: 1 };
    yield* postorder(node.left);
    yield* postorder(node.right);
    path.push(node.val);
    yield { type: 'success', activeId: node.id, path: path.slice(), line: 4 };
  }

  if (mode === 'inorder') {
    yield* inorder(root);
  } else if (mode === 'preorder') {
    yield* preorder(root);
  } else if (mode === 'postorder') {
    yield* postorder(root);
  }
}
