class DAG:
    def __init__(self):
        self.__nodes = {}

    def vertex(self, v):
        self.__nodes[v] = []
        return self

    def edge(self, a, b):
        if a not in self.__nodes:
            self.vertex(a)
        if b not in self.__nodes:
            self.vertex(b)

        self.__nodes[a].append(b)
        return self

    def adjacent(self, v):
        return self.__nodes[v]
