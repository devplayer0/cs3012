from collections.abc import Iterable

class DAG:
    def __init__(self):
        self.__vertices = {}

    def add_vertex(self, v):
        if not v in self.__vertices:
            self.__vertices[v] = set()
        return self

    def add_edge(self, a, b):
        if a not in self.__vertices:
            self.add_vertex(a)
        if b not in self.__vertices:
            self.add_vertex(b)

        self.__vertices[a].add(b)
        return self

    def adjacent(self, v):
        return self.__vertices[v]

    def contains_vertex(self, v):
        return v in self.__vertices

    def contains_edge(self, a, b):
        return self.contains_vertex(a) and b in self.__vertices[a]

    def is_subgraph(self, other):
        if not isinstance(other, DAG):
            return False
        return other.__vertices <= self.__vertices
    def is_supergraph(self, other):
        if not isinstance(other, DAG):
            return False
        return other.__vertices >= self.__vertices

    def remove_vertex(self, v):
        del self.__vertices[v]
        for adjacent in self.__vertices.values():
            adjacent.discard(v)

    def remove_edge(self, a, b):
        self.__vertices[a].remove(b)

    def __setitem__(self, v, adjacent):
        if v in self.__vertices:
            self.__vertices[v] = set()

        for a in adjacent:
            self.add_edge(v, a)

    def __getitem__(self, v):
        return self.adjacent(v)

    def __contains_impl(self, item):
        if isinstance(item, tuple):
            return self.contains_edge(*item)
        return self.contains_vertex(item)
    def __contains__(self, item):
        if isinstance(item, tuple) or not isinstance(item, Iterable):
            return self.__contains_impl(item)

        for i in item:
            if not self.__contains_impl(i):
                return False
        return True

    def __eq__(self, other):
        if not isinstance(other, DAG):
            return NotImplemented
        # Will test equality for keys (vertices) and values (adjacency sets - `__eq__()` _will_ do a proper comparison)
        return other.__vertices == self.__vertices

    def __le__(self, other):
        if not isinstance(other, DAG):
            return NotImplemented
        return self.is_subgraph(other)
    def __ge__(self, other):
        if not isinstance(other, DAG):
            return NotImplemented
        return self.is_supergraph(other)
