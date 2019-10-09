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
