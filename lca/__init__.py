class Node:
    def __init__(self, value):
        self.value = value

        self.parent = None
        self.left = None
        self.right = None

    def lca(self, a, b):
        # Base case
        if a == b:
            return a

        # Recurse
        return self.lca(a.parent, b.parent)

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
