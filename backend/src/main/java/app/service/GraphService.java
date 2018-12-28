package app.service;

import app.exception.WrongGraphStructureException;
import app.objects.Edge;
import app.objects.Graph;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class GraphService {
    private static final AtomicReference<Graph> CACHE = new AtomicReference<>();
    private String graphExampleFilename = "graphExample.txt";

    public Graph getCurrentGraph() {
        CACHE.compareAndSet(null, buildGraph(graphExampleFilename));
        return CACHE.get();
    }

    public Graph buildGraph(String fileName) {
        Graph graph = null;
        if (!fileName.contains(".txt")) {
            throw new IllegalArgumentException();
        }
        File file = new File(Objects.requireNonNull(getClass().getClassLoader().getResource(fileName)).getPath());
        Scanner sc;
        try {
            sc = new Scanner(file);
            int numberOfNodes = getNumberOfNodes(sc);
            graph = buildListOfNeighborhoods(sc, numberOfNodes);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return graph;
    }

    private int getNumberOfNodes(Scanner sc) {
        String firstLine = sc.nextLine();
        return Integer.parseInt(firstLine);
    }

    private Graph buildListOfNeighborhoods(Scanner sc, int numberOfNodes) {
        Graph graph = new Graph();
        graph.numberOfNodes = numberOfNodes;
        for (int i = 0; i < numberOfNodes; i++) {
            ArrayList<Integer> nodes = new ArrayList<>();
            String line = sc.nextLine();
            String[] graphValue = line.split(" ");
            Integer nodeNumber = Integer.parseInt(graphValue[0]);
            Arrays.stream(graphValue)
                    .skip(2)
                    .map(Integer::parseInt)
                    .forEach(nodes::add);
            graph.nodes.put(nodeNumber, nodes);
        }
        return graph;
    }

    public void saveGraph(Graph graph) throws IOException {
        String fileName = createFile();
        List<String> lines = createContentToSave(graph);

        Path file = Paths.get(fileName);
        Files.write(file, lines, Charset.forName("UTF-8"));
    }

    private List<String> createContentToSave(Graph graph) {
        List<String> lines = new ArrayList<>();

        lines.add(String.valueOf(graph.numberOfNodes));
        for (int i = 1; i < graph.nodes.size() + 1; i++) {
            ArrayList<Integer> neighboursList = graph.nodes.get(i);
            if (neighboursList != null) {
                String neighboursAsString = "";
                for (Integer neighbour : neighboursList) {
                    neighboursAsString += String.valueOf(neighbour) + " ";
                }
                String line = i + " " + graph.nodes.get(i).size() + " " + neighboursAsString;
                lines.add(line);
            }
        }
        return lines;
    }

    private String createFile() throws FileNotFoundException, UnsupportedEncodingException {
        String fileName = LocalDateTime.now().toString() + ".txt";
        fileName = fileName.replaceAll(":", "");

        new PrintWriter(fileName, "UTF-8");
        return fileName;
    }

    public void removeNode(int nodeId) throws WrongGraphStructureException, IOException {
        try {
            CACHE.getAndUpdate((graph) -> {
                if (graph == null) {
                    graph = buildGraph(graphExampleFilename);
                }
                Graph ret = new Graph();
                ret.nodes = new HashMap<>();
                ret.numberOfNodes = graph.numberOfNodes - 1;
                graph.nodes.forEach((k, v) -> {
                    ArrayList<Integer> retValues = new ArrayList<Integer>(v);
                    ret.nodes.put(k, retValues);
                    retValues.remove(Integer.valueOf(nodeId));
                });
                ret.nodes.forEach((k, v) -> {
                    v.remove(Integer.valueOf(nodeId));
                });
                ArrayList<Integer> toRemove = ret.nodes.remove(nodeId);
                if (toRemove != null && !toRemove.isEmpty()) {
                    throw new IllegalStateException("not_valid_tree");
                }
                try {
                    this.saveGraph(ret);
                } catch (IOException e) {
                    throw new IllegalStateException("io_exception");
                }
                return ret;
            });
        } catch (IllegalStateException ex) {
            if ("not_valid_tree".equals(ex.getMessage())) {
                throw new WrongGraphStructureException();
            } else if ("io_exception".equals(ex.getMessage())) {
                throw new IOException(ex);
            }
        }
    }

    public void removeEdge(Edge edge) throws WrongGraphStructureException {
        try {
            CACHE.getAndUpdate((graph) -> {
                AtomicBoolean canBeRemoved = new AtomicBoolean(false);

                if (graph == null) {
                    graph = buildGraph(graphExampleFilename);
                }
                graph.nodes.forEach((key, value) -> {
                    if (value.contains(edge.to) && !key.equals(edge.from)) {
                        canBeRemoved.set(true);
                    }
                });
                if (canBeRemoved.get()) {
                    graph.nodes.get(edge.from).remove(edge.to);
                }
                if (!canBeRemoved.get()) {
                    throw new IllegalStateException();
                }
                return graph;
            });
        } catch (Exception e) {
            throw new WrongGraphStructureException();
        }
    }

    public void addNode(Integer sourceNode) {
        CACHE.getAndUpdate((graph) -> {

            if (graph == null) {
                graph = buildGraph(graphExampleFilename);
            }
            graph.numberOfNodes += 1;
            graph.nodes.get(sourceNode).add(graph.numberOfNodes);
            ArrayList<Integer> nodeList = new ArrayList<>();
            graph.nodes.put(graph.numberOfNodes, nodeList);
            return graph;
        });
    }

    public void addEdge(Edge edge) {
        CACHE.getAndUpdate((graph) -> {

            if (graph == null) {
                graph = buildGraph(graphExampleFilename);
            }

            if(!graph.nodes.get(edge.from).contains(edge.to)){
                graph.nodes.get(edge.from).add(edge.to);
            }
            return graph;
        });
    }
}
