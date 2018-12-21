package app.controller;

import app.objects.Graph;
import app.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.*;


@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping(path = "/graph")
public class AppController {
    @Autowired
    GraphService graphService;

    @GetMapping
    public Map<Integer, ArrayList<Integer>> getGraph() {
        Graph graph = graphService.buildGraph("graphExample.txt");
        return graph.nodes;
    }

    @PostMapping
    public ResponseEntity saveGraph(@RequestBody Graph graph) throws IOException {
        graphService.saveGraph(graph);
        return ResponseEntity.ok().build();

    }


}
