class DAG:
    def __init__(self):
        self.__nodes = {}

    def vertex(self, v):
        self.__nodes[v] = []
        return self

    def edge(self, a, b):
        self.__nodes[a].append(b)

    def adjacent(self, v):
        return self.__nodes[v]
