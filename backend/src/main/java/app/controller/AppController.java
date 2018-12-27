package app.controller;

import app.exception.WrongGraphStructureException;
import app.objects.Graph;
import app.service.GraphService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;


@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping(path = "/graph")
public class AppController {
    private static final Logger LOG = LoggerFactory.getLogger(AppController.class);
    @Autowired
    private GraphService graphService;

    @GetMapping
    public Map<Integer, ArrayList<Integer>> getGraph() {
        return graphService.getCurrentGraph().nodes;
    }

    @DeleteMapping("removeNode/{id}")
    public ResponseEntity removeNode(@PathVariable("id") int nodeId) {
        try {
            graphService.removeNode(nodeId);
        } catch (WrongGraphStructureException e) {
            LOG.error("", e);
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            LOG.error("", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("saveGraph")
    public ResponseEntity saveGraph(@RequestBody Graph graph) throws IOException {
        graphService.saveGraph(graph);
        return ResponseEntity.ok().build();

    }


}
