import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {D3, D3Service,} from 'd3-ng2-service';
import {GraphService} from '../services/graph.service';
import {Subscription} from 'rxjs';
import {saveAs as importedSaveAs} from "file-saver";


@Component({
  selector: 'app-d3graph',
  templateUrl: './d3graph.component.html',
  styleUrls: ['./d3graph.component.css']
})
export class D3graphComponent implements OnInit, OnDestroy {
  @ViewChild('svgRef', {read: ElementRef}) someComp;
  childToDelete: string;
  firstNode: string;
  secondNode: string;
  sourceNode: string;
  sourceNodeForEdge: string;
  destinationNodeForEdge: string;
  private d3: D3;
  private parentNativeElement: any;
  private svg: any;

  private graph;
  initialGraphSubscription: Subscription;
  private showAlert: boolean;
  firstNodeForReplace: string;
  secondNodeForReplace: string;


  constructor(element: ElementRef, private d3Service: D3Service, private graphService: GraphService) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    this.initialGraphSubscription = this.graphService.getInitialGraph().subscribe(initGraph => {
      this.graph = initGraph;
      this.drawTree(this.graph);
    });
  }

  ngOnDestroy() {
    this.initialGraphSubscription.unsubscribe();
  }

  drawTree(nodesMatrix: any) {
    let d3 = this.d3;
    let width: number = 100;
    let height: number = 1000;

    if (this.parentNativeElement !== null) {
      this.svg = d3.select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
      let allNodesMatrix = nodesMatrix;
      let splitted = allNodesMatrix.split("]");
      console.log("First splitted element: " + splitted[0] + splitted[0].length);
      console.log(splitted[0][2]);
      var root = splitted[0][2];
      var countChildren = 0;
      var rootChildrenArray = [];
      for (var i = 6; i < splitted[0].length; i += 2) {
        console.log("children: " + splitted[0][i]);
        rootChildrenArray.push(splitted[0][i]);
        countChildren += 1;
      }

      let nodesWithCoordinates = new Map();
      nodesWithCoordinates.set(root, "600,100");

      if (countChildren == 1) {
        nodesWithCoordinates.set(rootChildrenArray[0], "500,200");
      } else if (countChildren == 2) {
        nodesWithCoordinates.set(rootChildrenArray[0], "500,200");
        nodesWithCoordinates.set(rootChildrenArray[1], "700,200");
      } else if (countChildren == 3) {
        nodesWithCoordinates.set(rootChildrenArray[0], "500,200");
        nodesWithCoordinates.set(rootChildrenArray[1], "600,200");
        nodesWithCoordinates.set(rootChildrenArray[2], "700,200");
      }
      nodesWithCoordinates.forEach((value: String, key: BigInteger) => {
        console.log(key, value);
        var splitted1 = value.split(",");
        console.log("Splitted: " + splitted1[0] + splitted1[1]);

      });

      console.log(splitted)
      var jsonCircles = [];

      for (var i = 1; i < splitted.length - 1; i++) {
        console.log("/////////////////////////" + splitted[i] + " " + "parent: " + splitted[i][2]);

        nodesWithCoordinates.forEach((value: string, key: string) => {
          var parentInThisLoopRotation = splitted[i][2];
          if (splitted[i][3] != `"`) {
            parentInThisLoopRotation += splitted[i][3];
          }
          //look for parent coordinates
          if (key == parentInThisLoopRotation) {
            console.log("-------------------------------- " + key + " " + parentInThisLoopRotation + "-------- " + value);
            var countGrandChildren = 0;
            var childrenArray = [];
            let allSplittedChildren = splitted[i].split("[");
            console.log("ALL CHILDREN: " + allSplittedChildren[1] + " size: " + allSplittedChildren[1].length);
            if (allSplittedChildren[1].length > 0) {
              let tableWithSplittedChildrenByComa = allSplittedChildren[1].split(",");
              for (var m = 0; m < tableWithSplittedChildrenByComa.length; m++) {
                console.log("EACH CHILD: " + tableWithSplittedChildrenByComa[m])
                childrenArray.push(tableWithSplittedChildrenByComa[m]);
                countGrandChildren += 1;
              }
            }
            var splittedParentCoordinates = value.split(",");
            console.log("============================" + splittedParentCoordinates[0] + " " + splittedParentCoordinates[1]);

            //how much another generation must be located closer to each other
            var numberOfLoopCircuits = 0;

            var fromParentX = parseInt(splittedParentCoordinates[0]);
            var fromParentY = parseInt(splittedParentCoordinates[1]);
            numberOfLoopCircuits = (fromParentY - 100) / 100;
            //numberOfLoopCircuits +=1;
            console.log("*******************************Loop circuits: " + numberOfLoopCircuits)
            console.log("''''''''''''''''''''" + `"${fromParentX - 40}"`);
            if (countGrandChildren == 1) {
              nodesWithCoordinates.set(childrenArray[0], `${fromParentX - 60 + numberOfLoopCircuits * 15},${fromParentY + 100}`);
            } else if (countGrandChildren == 2) {
              nodesWithCoordinates.set(childrenArray[0], `${fromParentX - 60 + numberOfLoopCircuits * 15},${fromParentY + 100}`);
              nodesWithCoordinates.set(childrenArray[1], `${fromParentX + 60 - numberOfLoopCircuits * 15},${fromParentY + 100}`);
            } else if (countGrandChildren == 3) {
              nodesWithCoordinates.set(childrenArray[0], `${fromParentX - 60 + numberOfLoopCircuits * 15},${fromParentY + 100}`);
              nodesWithCoordinates.set(childrenArray[1], `${fromParentX},${fromParentY + 100}`);
              nodesWithCoordinates.set(childrenArray[2], `${fromParentX + 60 - numberOfLoopCircuits * 15},${fromParentY + 100}`);
            }
          }


        });
      }

      nodesWithCoordinates.forEach((value: String, key: BigInteger) => {
        console.log(key, value);
        var splitted1 = value.split(",");
        console.log("KEY: " + key + " Splitted: " + splitted1[0] + " " + splitted1[1]);
        jsonCircles.push({
          "x_axis": splitted1[0],
          "y_axis": splitted1[1],
          "radius": 10,
          "color": "green",
          "label": key
        });

      });

      var svgContainer = d3.select("svg");
      svgContainer.selectAll("circle").remove();
      svgContainer.selectAll("text").remove();
      svgContainer.selectAll("line").remove();

      var circles = svgContainer.selectAll("circle")
        .data(jsonCircles)
        .enter()
        .append("circle");

      var circleAttributes = circles
        .attr("cx", function (d) {
          return d.x_axis;
        })
        .attr("cy", function (d) {
          return d.y_axis;
        })
        .attr("r", function (d) {
          return d.radius;
        })
        .attr("stroke", "black")
        .style("fill", function (d) {
          return "white";
        });

      var text = svgContainer.selectAll("text")
        .data(jsonCircles)
        .enter()
        .append("text");

      var textLabels = text
        .attr("x", function (d) {
          return d.x_axis - 6;
        })
        .attr("y", function (d) {
          return d.y_axis - (-5);
        })
        .text(function (d) {
          return d.label;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "blue");
      console.log("Root is: " + root);

      var rootXCor;
      var rootYCor;
      nodesWithCoordinates.forEach((value: string, key: string) => {

        if (key == root) {
          var splittedRootCoordinates = value.split(",");
          rootXCor = splittedRootCoordinates[0];
          rootYCor = splittedRootCoordinates[1];
          console.log("============================" + splittedRootCoordinates[0] + " " + splittedRootCoordinates[1]);
        }
      });
      for (var i = 0; i < rootChildrenArray.length; i++) {
        console.log("Root children are: " + rootChildrenArray[i]);
        nodesWithCoordinates.forEach((value: string, key: string) => {

          if (key == rootChildrenArray[i]) {
            var splittedChildCoordinates = value.split(",");
            console.log("============================" + splittedChildCoordinates[0] + " " + splittedChildCoordinates[1]);

            var ychild = parseInt(splittedChildCoordinates[1]);
            var xchild = parseInt(splittedChildCoordinates[0]);
            var line = svgContainer.append("line")
              .attr("x1", `${rootXCor}`)
              .attr("y1", `${rootYCor - (-10)}`)
              .attr("x2", `${xchild}`)
              .attr("y2", `${ychild - 15}`)
              .attr("stroke", "blue")
              .attr("stroke-width", 2)
              .attr("marker-end", "url(#arrow)");
          }
        });
      }
      for (var i = 1; i < splitted.length - 1; i++) {

        var parentInThisLoopRotation = splitted[i][2];
        if (splitted[i][3] != `"`) {
          parentInThisLoopRotation += splitted[i][3];
        }
        nodesWithCoordinates.forEach((value: string, key: string) => {

          if (key == parentInThisLoopRotation) {
            var splittedRootCoordinates = value.split(",");
            rootXCor = splittedRootCoordinates[0];
            rootYCor = splittedRootCoordinates[1];
            console.log("============================" + splittedRootCoordinates[0] + " " + splittedRootCoordinates[1]);
          }
        });

        let allSplittedChildren = splitted[i].split("[");
        if (allSplittedChildren[1].length > 0) {
          let tableWithSplittedChildrenByComa = allSplittedChildren[1].split(",");
          for (var m = 0; m < tableWithSplittedChildrenByComa.length; m++) {
            console.log("EACH CHILD: " + tableWithSplittedChildrenByComa[m])

            nodesWithCoordinates.forEach((value: string, key: string) => {

              if (key == tableWithSplittedChildrenByComa[m]) {
                var splittedChildCoordinates = value.split(",");
                console.log("============================" + splittedChildCoordinates[0] + " " + splittedChildCoordinates[1]);

                var ychild = parseInt(splittedChildCoordinates[1]);
                var xchild = parseInt(splittedChildCoordinates[0]);
                var line = svgContainer.append("line")
                  .attr("x1", `${rootXCor}`)
                  .attr("y1", `${rootYCor - (-10)}`)
                  .attr("x2", `${xchild}`)
                  .attr("y2", `${ychild - 15}`)
                  .attr("stroke", "blue")
                  .attr("stroke-width", 2)
                  .attr("marker-end", "url(#arrow)");
              }
            });
          }
        }

      }
    }
  };

  deleteNode({form, value, valid}) {
    this.showAlert = false;

    this.graphService.removeNode(value.childToDelete).subscribe((currentGraph) => {
      this.svg.remove();
      this.graph = currentGraph;
      this.drawTree(this.graph);
    });
  }

  deleteEdge(firstNode: string, secondNode: string) {
    this.showAlert = false;
    let nodes = {from: Number(firstNode), to: Number(secondNode)};
    this.graphService.removeEdge(nodes).subscribe((graph) => {
      this.svg.remove();
      this.graph = graph;
      this.drawTree(this.graph);
    },
    () => this.showAlert = true
    )
  }

  addNode(sourceNode: string){
    let node = {from: Number(sourceNode)};
    this.graphService.addNode(node).subscribe( (graph) => {
      this.svg.remove();
      this.graph = graph;
      this.drawTree(this.graph);
    });
  }

  addEdge(sourceNode: string, destinationNode: string) {
    let nodes = {from: Number(sourceNode), to: Number(destinationNode)};
    this.graphService.addEdge(nodes).subscribe( (graph) => {
      this.svg.remove();
      this.graph = graph;
      this.drawTree(this.graph);
    });
  }

  getFile() {
    this.graphService.getFile().subscribe(data => {
      var blob = new Blob([data.blob()],{ type: 'text/plain' });
      importedSaveAs(blob, "Graph");
    });
  }


  replaceNodes(firstNodeForReplace: string, secondNodeForReplace: string) {
    this.showAlert = false;
    let nodes = {from: Number(firstNodeForReplace), to: Number(secondNodeForReplace)};
    this.graphService.replaceNodes(nodes).subscribe( (graph) =>{
      this.svg.remove();
      this.graph = graph;
      this.drawTree(this.graph);
    },
      () => this.showAlert = true)
  }
}
