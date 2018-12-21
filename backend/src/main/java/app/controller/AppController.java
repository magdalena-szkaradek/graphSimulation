package app.controller;

import app.objects.Graph;
import app.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping(path = "/")
public class AppController {
    @Autowired
    GraphService graphService;

    @GetMapping("/graph")
    public Map<Integer, ArrayList<Integer>> getGraph() {
        Graph graph = graphService.buildGraph("graphExample.txt");
        return graph.nodes;
    }


}
