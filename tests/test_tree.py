from lca import Node

def test_assignment():
    root = Node(123)
    assert root.parent == None

    root.left = Node(456)
    assert root.left.parent == root

    root.left.right = Node(789)
    assert root.left.right.parent == root.left
    assert root.left.parent == root

def test_comparison():
    root = Node(123)
    root.left = Node(456)
    root.left.left = Node(456)
    root.right = Node(789)
    root.right.left = Node(456)
    root.right.left.left = Node(999)

    assert root.left > root
    assert root.left == root.left.left
    assert root.right > root.left.left
    assert root.right.left.left.parent == root.left
    assert root.left != root
    assert not root.left != root.left.left
