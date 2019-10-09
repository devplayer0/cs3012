class Node:
    """
    Class representing a node in a binary tree

    :attribute value: the value of the node
    :attribute parent: the parent of the node, if any
    :attribute left: the left child of the node, if any - assigning to this value will set the assigned Node's parent
    :attribute right: the right child of the node, if any - assigning to this value will set the assigned Node's parent
    """
    def __init__(self, value):
        """
        :param value: the value of this node
        """
        self.value = value

        self.parent = None
        self.left = None
        self.right = None

    def path(self, root):
        """
        Retrieve the path from this node to `root` (`root` must be above this Node)

        :param root: node at which the traversal of parents will stop
        :returns: a list representing the path of this Node to `root` (including this Node and `root`)
        """
        path = []
        n = self

        # Truthy until the root is reached
        while n:
            path.append(n)

            # Stop if we've reached the requested root
            if n == root:
                break
            n = n.parent

        # Ensure last element is the desired root
        if path[-1] != root:
            return None
        return path

    def lca(self, a, b):
        """
        Find the LCA (Lowest Common Ancestor) from within the tree whose root is this Node.

        :param a: first node below the given root
        :param b: second node below the given root
        :returns: the LCA of a and b (or None if no LCA exists)
        """
        a_path = a.path(self)
        b_path = b.path(self)
        # Ensure paths exist
        if not a_path or not b_path:
            return None

        # Traverse from the root
        pairs = zip(reversed(a_path), reversed(b_path))

        lca = None
        for a, b in pairs:
            if a != b:
                # At this point the previous pair is the LCA
                break
            lca = a
        return lca

    def __setattr__(self, name, value):
        # Automatically set the assigned node's `parent` to point to this Node
        if name in ('left', 'right'):
            if value:
                value.parent = self
            self.__dict__[name] = value
            return
        self.__dict__[name] = value

    def __lt__(self, other):
        if isinstance(other, Node):
            return self.value < other.value
        return NotImplemented
    def __le__(self, other):
        if isinstance(other, Node):
            return self.value <= other.value
        return NotImplemented
    def __eq__(self, other):
        if isinstance(other, Node):
            return self.value == other.value
        return NotImplemented
    def __ge__(self, other):
        if isinstance(other, Node):
            return self.value >= other.value
        return NotImplemented
    def __gt__(self, other):
        if isinstance(other, Node):
            return self.value > other.value
        return NotImplemented

    def __str__(self):
        return str(self.value)
    def __repr__(self):
        return f'Node({self.value})'
