package app.service;

import app.objects.Graph;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;
import java.util.Scanner;

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
}
