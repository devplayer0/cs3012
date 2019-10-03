from lca import Node

def test_assignment():
    root = Node(123)
    assert root.parent == None

    root.left = Node(456)
    assert root.left.parent == root

    root.left.right = Node(789)
    assert root.left.right.parent == root.left
    assert root.left.parent == root
