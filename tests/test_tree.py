import pytest

from lca import Node

def test_assignment():
    root = Node(123)
    assert root.parent == None

    root.left = Node(456)
    assert root.left.parent == root

    root.left.right = Node(789)
    assert root.left.right.parent == root.left
    assert root.left.parent == root

def test_str():
    root = Node(123)

    assert str(root) == '123'
    assert repr(root) == 'Node(123)'

def test_comparison():
    root = Node(123)
    root.left = Node(456)
    root.left.left = Node(456)
    root.right = Node(789)
    root.right.left = Node(456)
    root.right.left.left = Node(999)

    assert root.left > root
    assert root < root.left
    assert root.left == root.left.left
    assert root.right > root.left.left
    assert root.right.left.left.parent == root.left
    assert root.left != root
    assert not root.left != root.left.left
    assert root.left.left >= root.left
    assert root.left <= root.left.left

    assert root != 123
    assert root.left != 456

def test_path():
    root = Node(0)
    root.right = Node(1)
    root.left = Node(2)
    root.left.right = Node(3)
    root.left.right.right = Node(4)

    assert root.right.path(root) == [Node(1), Node(0)]
    assert root.left.right.right.path(root) == [Node(4), Node(3), Node(2), Node(0)]
    assert not root.right.path(root.left)
    assert root.left.right.right.path(root.left) == [Node(4), Node(3), Node(2)]

#      0
#    /   \
#   1    2
#  / \  / \
# 8  5 3  9
#   / \ \
#  6  7 4
def test_lca():
    root = Node(0)
    root.left = Node(1)
    root.left.left = Node(8)
    root.left.right = Node(5)
    root.left.right.left = Node(6)
    root.left.right.right = Node(7)
    root.right = Node(2)
    root.right.left = Node(3)
    root.right.left.right = Node(4)
    root.right.right = Node(9)

    # Simple cases
    assert root.lca(root.left, root.right) == root
    assert root.lca(root.left.left, root.left.right) == root.left
    assert root.lca(root.right.right, root.right.left) == root.right

    # Differing heights
    assert root.lca(root.left.left, root.left.right.left) == root.left
    assert root.lca(root.right.right, root.right.left.right) == root.right
    assert root.lca(root.left.right.left, root.right.left.right) == root

    # Differing roots
    assert root.right.lca(root.right.left, root.right.right) == root.right
    assert root.left.lca(root.left.left, root.left.right.right) == root.left
