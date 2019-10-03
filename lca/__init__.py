class Node:
    def __init__(self, value):
        self.value = value

        self.parent = None
        self.left = None
        self.right = None

    def path(self, root):
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
        a_path = a.path(self)
        b_path = b.path(self)
        if not a_path or not b_path:
            return None

        pairs = zip(reversed(a_path), reversed(b_path))

        lca = None
        for a, b in pairs:
            if a != b:
                break
            lca = a
        return lca

    def __setattr__(self, name, value):
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
