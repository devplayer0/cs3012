from lca.dag import DAG

def test_construction():
    dag = DAG()
    dag\
        .vertex(0)\
        .vertex(1)\
        .vertex(2)
    assert not dag.adjacent(0)

    dag\
        .edge(0, 2)\
        .edge(0, 1)
    assert dag.adjacent(0) == [2, 1]
    assert not dag.adjacent(2)
    assert not dag.adjacent(1)

    dag\
        .edge(3, 0)\
        .edge(3, 2)\
        .edge(2, 3)

    assert dag.adjacent(3) == [0, 2]
    assert dag.adjacent(2) == [3]
