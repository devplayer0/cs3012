class Node:
    def __init__(self, value):
        self.value = value

        self.parent = None
        self.left = None
        self.right = None

    def __setattr__(self, name, value):
        if name in ('left', 'right'):
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
