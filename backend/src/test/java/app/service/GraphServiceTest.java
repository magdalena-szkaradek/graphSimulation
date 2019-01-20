package app.service;

import app.exception.WrongGraphStructureException;
import app.objects.Edge;
import app.objects.Graph;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.*;

public class GraphServiceTest {
    private GraphService graphService;
    private Graph graph;

    @Before
    public void setUp() {
        graphService = new GraphService();
        graph = graphService.buildGraph("graphExample.txt");
    }

    @Test
    public void removeNode() throws WrongGraphStructureException, IOException {
        graphService.getCurrentGraph();
        graphService.removeNode(3);
        Graph currentGraph = graphService.getCurrentGraph();
        assertFalse(currentGraph.nodes.values().contains(3));
        assertFalse(currentGraph.nodes.keySet().contains(3));
    }

    @Test
    public void getCurrentGraph() {
        Graph currentGraph = graphService.getCurrentGraph();
        assertEquals(13, currentGraph.numberOfNodes);
        assertEquals(13, currentGraph.nodes.size());
        assertTrue(currentGraph.nodes.containsKey(1));
        assertTrue(currentGraph.nodes.containsKey(5));
    }

    @Test
    public void buildGraph() {
        assertEquals(13, graph.numberOfNodes);
        assertEquals(13, graph.nodes.size());
        assertTrue(graph.nodes.containsKey(1));
        assertTrue(graph.nodes.containsKey(5));
    }

    @Test(expected = IllegalArgumentException.class)
    public void buildGraph_wrongFormatFile() {
        graphService.buildGraph("graphExample.pdf");
    }

    @Test(expected = NullPointerException.class)
    public void buildGraph_nonExistingFile() {
        graphService.buildGraph("graph.txt");
    }

    @Test(expected = WrongGraphStructureException.class)
    public void removeNode_notAllowed() throws WrongGraphStructureException, IOException {
        graphService.removeNode(2);
    }

    @Test
    public void removeEdge() throws WrongGraphStructureException {
        Edge edge = new Edge();
        edge.from = 8;
        edge.to = 9;
        graphService.removeEdge(edge);
        Graph currentGraph = graphService.getCurrentGraph();
        assertFalse(currentGraph.nodes.get(8).contains(9));
    }

    @Test(expected = WrongGraphStructureException.class)
    public void removeEdge_notAllowed() throws WrongGraphStructureException {
        Edge edge = new Edge();
        edge.from = 2;
        edge.to = 3;
        graphService.removeEdge(edge);
    }

    @Test
    public void addNode() {
        graphService.addNode(4);
        Graph currentGraph = graphService.getCurrentGraph();
        assertEquals(14, currentGraph.numberOfNodes);
        assertEquals(14, currentGraph.nodes.size());
        assertTrue(currentGraph.nodes.get(4).contains(14));
    }

    @Test
    public void addEdge() {
        Edge edge = new Edge();
        edge.from = 7;
        edge.to = 10;
        graphService.addEdge(edge);
        Graph currentGraph = graphService.getCurrentGraph();
        assertTrue(currentGraph.nodes.get(7).contains(10));
        assertEquals(2, currentGraph.nodes.get(7).size());
    }

    @Test
    public void replaceNodes() throws WrongGraphStructureException {
        Edge edge = new Edge();
        edge.from = 5;
        edge.to = 13;
        graphService.replaceNodes(edge);
        assertTrue(graphService.getCurrentGraph().nodes.get(2).contains(13));
        assertFalse(graphService.getCurrentGraph().nodes.get(2).contains(5));
        assertTrue(graphService.getCurrentGraph().nodes.get(12).contains(5));
        assertFalse(graphService.getCurrentGraph().nodes.get(12).contains(13));
    }

    @Test(expected = WrongGraphStructureException.class)
    public void replaceNodes_notAllowed() throws WrongGraphStructureException {
        Edge edge = new Edge();
        edge.from = 8;
        edge.to = 10;
        graphService.replaceNodes(edge);
    }
}