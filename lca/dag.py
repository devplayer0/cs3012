class DAG:
    '''
    Class representing a Directed Acyclic Graph.

    Note: it is up to the user to ensure the graph contains no cycles
    '''
    def __init__(self):
        self.__vertices = {}

    def add_vertex(self, v):
        '''
        Add a new vertex to the graph.

        Does nothing if the vertex is already in the graph.

        :param v: the new vertex to add
        :returns: this object (for method chaining)
        '''
        if not v in self.__vertices:
            self.__vertices[v] = set()
        return self

    def add_edge(self, a, b):
        '''
        Add a new directed edge to the graph.

        Adds vertices to the graph if they are not already present.

        :param a: the starting vertex
        :param b: the ending vertex
        :returns: this object (for method chaining)
        '''
        # Create vertices if they are not already present
        if a not in self.__vertices:
            self.add_vertex(a)
        if b not in self.__vertices:
            self.add_vertex(b)

        self.__vertices[a].add(b)
        return self

    def adjacent(self, v):
        '''
        Obtain the set of vertices adjacent (connected by an edge of which this vertex is the start) to this vertex

        :param v: a vertex in the graph
        :returns: the set of adjacent vertices
        '''
        return self.__vertices[v]

    def contains_vertex(self, v):
        '''
        Check if the vertex is present in the graph.

        :returns: True if the vertex is in the graph
        '''
        return v in self.__vertices

    def contains_edge(self, a, b):
        '''
        Check if the directed edge is present in the graph.

        :param a: the starting vertex
        :param b: the ending vertex
        :returns: True if the directed edge is in the graph
        '''
        return self.contains_vertex(a) and b in self.__vertices[a]

    def is_subgraph(self, other):
        '''
        Check if this graph is a subgraph of another.

        :param other: the supergraph
        :returns: True if this graph is a subgraph of another graph
        '''
        if not isinstance(other, DAG):
            raise TypeError('not a graph')

        # Have to do a manual outer loop, `<=` with `dict.items()` doesn't go deep enough
        for v, a in self.__vertices.items():
            if v not in other.__vertices or not a <= other.__vertices[v]:
                return False
        return True
    def is_supergraph(self, other):
        '''
        Check if this graph is a supergraph of another.

        :param other: the subgraph
        :returns: True if this graph is a supergraph of another graph
        '''
        if not isinstance(other, DAG):
            raise TypeError('not a graph')
        return other.is_subgraph(self)

    def remove_vertex(self, v):
        '''
        Remove a vertex (and any connected edges) from the graph.

        :param vertex: the vertex to remove from the graph
        '''
        del self.__vertices[v]
        for adjacent in self.__vertices.values():
            # `remove() will raise `KeyError`
            adjacent.discard(v)

    def remove_edge(self, a, b):
        '''
        Remove a directed edge from the graph.

        Vertices will never be removed, even if they become pendant.

        :param a: the starting vertex
        :param b: the ending vertex
        '''
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
        '''
        Find paths from vertex `a` to vertex `b` in the graph.

        A set of tuples (each tuple representing a single path) is returned.

        :param a: the starting vertex
        :param b: the ending vertex
        :returns: a set of paths
        '''
        if a not in self:
            raise KeyError(f'{a} is not in this graph')
        if b not in self:
            raise KeyError(f'{b} is not in this graph')

        paths = set()
        self.__paths_impl(a, b, [], paths)
        return paths

    def lca(self, root, a, b):
        '''
        Find the lowest common ancestor of `a` and `b` below `root`.

        If multiple lowest common ancestors are valid (same depth), the one which is returned is non-deterministic.

        :param a: the starting vertex
        :param b: the ending vertex
        :returns: the lowest common ancestor, if any
        '''
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
        '''
        Set the adjacency list for a vertex.

        If the vertex is not present, it will be added to the graph

        This allows you to create vertices and edges in a more Pythonic manner:

        - :code:`dag[1] = []        # inserts vertex 1 into the graph`
        - :code:`dag[0] = [1, 2, 3] # creates edges (0, 1), (0, 2) and (0, 3)`

        :param a: the starting vertex
        :param b: the ending vertex
        :returns: the lowest common ancestor, if any
        '''
        if v in self.__vertices or not adjacent:
            self.__vertices[v] = set()

        for a in adjacent:
            self.add_edge(v, a)

    def __getitem__(self, v):
        '''
        Obtain the set of vertices adjacent to this one.

        A more Pythonic version of :func:`adjacent()`.

        :returns: the set of adjacent vertices
        '''
        return self.adjacent(v)

    def __delitem__(self, item):
        '''
        Remove an edge or vertex from the graph.

        A more Pythonic version of :func:`remove_edge()` and :func:`remove_vertex()`.

        - To delete a vertex, do :code:`del dag[vertex]`
        - To delete an edge, do :code:`del dag[(a, b)]`
        '''
        if isinstance(item, tuple):
            self.remove_edge(*item)
        else:
            self.remove_vertex(item)

    def __contains__(self, item):
        '''
        Check if the directed edge or vertex is present in the graph.

        A more Pythonic version of :func:`contains_edge()` and :func:`contains_vertex()`.

        - To check a vertex, do :code:`vertex in dag`
        - To check for an edge, do :code:`(a, b) in dag`

        :returns: True if the directed edge or vertex is in the graph
        '''
        if isinstance(item, tuple):
            return self.contains_edge(*item)
        return self.contains_vertex(item)

    def __eq__(self, other):
        '''
        Check if the nodes and edges in this :class:`DAG` are equal to those in another :class:`DAG`.

        :returns: False if `other` is not a :class:`DAG`
        '''
        if not isinstance(other, DAG):
            return NotImplemented
        # Will test equality for keys (vertices) and values (adjacency sets - `__eq__()` _will_ do a proper comparison)
        return other.__vertices == self.__vertices

    def __le__(self, other):
        '''Check if this graph is a subgraph of another, Pythonic-ally. (:code:`sub <= super_`)'''
        if not isinstance(other, DAG):
            return NotImplemented
        return self.is_subgraph(other)
    def __ge__(self, other):
        '''Check if this graph is a supergraph of another, Pythonic-ally. (:code:`super_ >= sub`)'''
        if not isinstance(other, DAG):
            return NotImplemented
        return self.is_supergraph(other)

    def __str__(self):
        '''Get the string representation of this :class:`DAG`'s nodes and edges.'''
        return str(self.__vertices)
    def __repr__(self):
        '''Get the debuggable string representation of this :class:`DAG`'s nodes and edges.'''
        return f'DAG({self.__vertices})'
