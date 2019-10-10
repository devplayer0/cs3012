import pytest

from lca.dag import DAG

def test_construction():
    dag = DAG()
    dag\
        .add_vertex(0)\
        .add_vertex(1)\
        .add_vertex(2)
    assert not dag.adjacent(0)

    dag\
        .add_edge(0, 2)\
        .add_edge(0, 1)
    assert dag.adjacent(0) == {1, 2}
    assert not dag.adjacent(2)
    assert not dag.adjacent(1)

    dag.add_vertex(0)
    assert dag.adjacent(0) == {1, 2}

    dag\
        .add_edge(3, 0)\
        .add_edge(3, 2)\
        .add_edge(2, 3)\
        .add_edge(3, 4)

    assert dag.adjacent(3) == {0, 2, 4}
    assert dag.adjacent(2) == {3}
    assert dag.adjacent(4) == set()

def test_operator_construction():
    dag = DAG()
    dag[0] = [2, 1]
    dag[3] = [0, 2, 3, 4]

    assert dag.adjacent(0) == {1, 2}
    assert dag.adjacent(1) == set()
    assert dag.adjacent(2) == set()
    assert dag.adjacent(3) == {4, 3, 2, 0}

    dag[0] = [4, 5]
    assert dag.adjacent(0) == {4, 5}
    assert dag.adjacent(3) == {4, 3, 2, 0}

def test_contents():
    dag = DAG()
    dag\
        .add_edge(0, 1)\
        .add_edge(1, 0)\
        .add_edge(2, 1)

    assert dag.contains_vertex(0)
    assert dag.contains_vertex(2)
    assert dag.contains_vertex(1)
    assert not dag.contains_vertex(5)

    assert dag.contains_edge(0, 1)
    assert dag.contains_edge(2, 1)
    assert dag.contains_edge(1, 0)
    assert not dag.contains_edge(1, 2)
    assert not dag.contains_edge(5, 6)

def test_operator_contents():
    dag = DAG()
    dag[0] = [1]
    dag[1] = [0]
    dag[2] = [1]

    assert 0 in dag
    assert 2 in dag
    assert 1 in dag
    assert 5 not in dag

    assert (0, 1) in dag
    assert (2, 1) in dag
    assert (1, 0) in dag
    assert (1, 2) not in dag
    assert (5, 6) not in dag

def test_equality():
    dag_a = DAG()
    dag_a[2] = [0, 1]
    dag_a[0] = [2]

    dag_b = DAG()
    dag_b[0] = [2]
    dag_b[2] = [1, 0]

    assert dag_a == dag_b
    assert dag_b == dag_a

    dag_a[0].add(1)
    assert dag_a != dag_b
    assert dag_b != dag_a

def test_sub_super():
    dag_a = DAG()
    dag_a[2] = [0, 1]
    dag_a[0] = [2]

    dag_b = DAG()
    dag_b[0] = [2]
    dag_b[2] = [1, 0]

    dag_c = DAG()
    dag_c[0] = [2]
    dag_c[2] = [0]

    assert dag_a.is_subgraph(dag_b)
    assert dag_a <= dag_b
    assert dag_a.is_supergraph(dag_b)
    assert dag_a >= dag_b

    assert dag_c <= dag_a
    assert dag_c <= dag_b

    assert dag_a >= dag_c
    assert not dag_c >= dag_a
    assert dag_b >= dag_c
    assert not dag_c >= dag_b

def test_str():
    dag = DAG()
    dag[0] = [1]
    dag[1] = [0]

    assert str(dag) == '{0: {1}, 1: {0}}' or str(dag) == '{1: {0}, 0: {1}}'
    assert repr(dag) == 'DAG({0: {1}, 1: {0}})' or repr(dag) == 'DAG({1: {0}, 0: {1}})'

def test_deletion():
    dag = DAG()
    dag\
        .add_edge(0, 1)\
        .add_edge(1, 0)\
        .add_edge(2, 1)

    dag.remove_edge(0, 1)
    assert not dag.contains_edge(0, 1)
    assert dag.adjacent(0) == set()
    assert dag.contains_edge(1, 0)
    assert dag.contains_vertex(0)
    with pytest.raises(KeyError):
        dag.remove_edge(0, 1)

    dag.remove_vertex(1)
    assert not dag.contains_vertex(1)
    assert not dag.contains_edge(1, 0)
    assert not dag.contains_edge(2, 1)
    assert dag.adjacent(2) == set()
    assert dag.contains_vertex(2)
    with pytest.raises(KeyError):
        dag.adjacent(1)

#       0
#     ↙ ↓ ↘
#    1  2  3
#   ↙ ↘   / ↘
#  4  5 ←/   6
def test_path():
    dag = DAG()
    dag[0] = [1, 2, 3]
    dag[1] = [4, 5]
    dag[3] = [5, 6]

    assert dag.paths(0, 2) == {(0, 2)}
    assert not dag.paths(2, 0)
    assert dag.paths(0, 0) == {(0,)}
    assert dag.paths(0, 6) == {(0, 3, 6)}

    assert dag.paths(1, 5) == {(1, 5)}
    assert dag.paths(0, 5) == {(0, 1, 5), (0, 3, 5)}

    with pytest.raises(KeyError, match='.* is not in this graph'):
        dag.paths(0, 7)
    with pytest.raises(KeyError, match='.* is not in this graph'):
        dag.paths(8, 7)

#        7
#
#        0
#      ↙ ↓ ↘
#     1  2  3
#    ↙ ↘   / ↘
#   4  5 ←/   6
#  ↙  ↙
# 8  9
def test_lca():
    dag = DAG()
    dag[0] = [1, 2, 3]
    dag[1] = [4, 5]
    dag[3] = [5, 6]
    dag[7] = []
    dag[4] = [8]
    dag[5] = [9]

    # Basic tests
    assert dag.lca(0, 0, 0) == 0
    assert dag.lca(1, 1, 1) == 1
    assert dag.lca(0, 1, 2) == 0
    assert dag.lca(0, 1, 3) == 0
    assert dag.lca(0, 2, 3) == 0
    assert dag.lca(1, 4, 5) == 1

    # Differing heights
    assert dag.lca(0, 4, 2) == 0
    assert dag.lca(0, 8, 5) == 1

    # Multiple paths
    assert dag.lca(0, 5, 6) == 3

    # No common ancestors
    assert dag.lca(0, 1, 7) is None
