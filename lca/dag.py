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
        for v, a in self.__vertices.items():
            if v not in other.__vertices or not a <= other.__vertices[v]:
                return False
        return True
    def is_supergraph(self, other):
        if not isinstance(other, DAG):
            return False
        return other.is_subgraph(self)

    def remove_vertex(self, v):
        del self.__vertices[v]
        for adjacent in self.__vertices.values():
            adjacent.discard(v)

    def remove_edge(self, a, b):
        self.__vertices[a].remove(b)

    def __paths_impl(self, v, dst, path, paths):
        path.append(v)
        if v == dst:
            # Base case
            paths.add(tuple(path))

        for n in self.adjacent(v):
            self.__paths_impl(n, dst, path, paths)

        # We'll have to try something else (or give up)
        path.pop()
        return False
    def paths(self, a, b):
        if a not in self:
            raise KeyError(f'{a} is not in this graph')
        if b not in self:
            raise KeyError(f'{b} is not in this graph')

        paths = set()
        self.__paths_impl(a, b, [], paths)
        return paths

    def lca(self, root, a, b):
        paths_a = self.paths(root, a)
        paths_b = self.paths(root, b)

        lca_path_len = 0
        lca = None
        # Test all combinations of paths
        for pa in paths_a:
            for pb in paths_b:
                curr_len = 0
                curr_lca = None
                # Traverse along each until a divergence is found
                for l, r in zip(pa, pb):
                    if l != r:
                        # A divergence has been found at this point
                        break

                    curr_len += 1
                    curr_lca = l

                # Did we actually find anything in common between the two paths? If so, check that this path is actually
                # lower than the last one we found
                if curr_lca is not None and curr_len > lca_path_len:
                    lca_path_len = curr_len
                    lca = curr_lca
        return lca

    def __setitem__(self, v, adjacent):
        if v in self.__vertices or not adjacent:
            self.__vertices[v] = set()

        for a in adjacent:
            self.add_edge(v, a)

    def __getitem__(self, v):
        return self.adjacent(v)

    def __delitem__(self, item):
        if isinstance(item, tuple):
            self.remove_edge(*item)
        else:
            self.remove_vertex(item)

    def __contains__(self, item):
        if isinstance(item, tuple):
            return self.contains_edge(*item)
        return self.contains_vertex(item)

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

    def __str__(self):
        return str(self.__vertices)
    def __repr__(self):
        return f'DAG({self.__vertices})'
