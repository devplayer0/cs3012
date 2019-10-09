class DAG:
    def __init__(self):
        self.__nodes = {}

    def vertex(self, v):
        self.__nodes[v] = set()
        return self

    def edge(self, a, b):
        if a not in self.__nodes:
            self.vertex(a)
        if b not in self.__nodes:
            self.vertex(b)

        self.__nodes[a].add(b)
        return self

    def adjacent(self, v):
        return self.__nodes[v]

    def contains_vertex(self, v):
        return v in self.__nodes

    def contains_edge(self, a, b):
        return self.contains_vertex(a) and b in self.__nodes[a]
