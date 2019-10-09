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

    def __contains__(self, item):
        if isinstance(item, tuple):
            return self.contains_edge(*item)
        return self.contains_vertex(item)
