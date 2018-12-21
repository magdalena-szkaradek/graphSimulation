package app.service;

import app.objects.Graph;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class GraphService {
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
            String neighboursAsString = "";
            for (Integer neighbour : neighboursList) {
                neighboursAsString += String.valueOf(neighbour) + " ";
            }
            String line = i + " " + graph.nodes.get(i).size() + " " + neighboursAsString;
            lines.add(line);
        }
        return lines;
    }

    private String createFile() throws FileNotFoundException, UnsupportedEncodingException {
        String fileName = LocalDateTime.now().toString() + ".txt";
        fileName = fileName.replaceAll(":", "");

        new PrintWriter(fileName, "UTF-8");
        return fileName;
    }
}
