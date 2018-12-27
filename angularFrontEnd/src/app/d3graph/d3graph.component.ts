// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-d3graph',
//   templateUrl: './d3graph.component.html',
//   styleUrls: ['./d3graph.component.css']
// })
// export class D3graphComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { Component, ElementRef, NgZone, OnInit, OnDestroy, ViewChild} from '@angular/core';

import {
  D3Service,
  D3,
  Selection,
} from 'd3-ng2-service';
import { IfStmt } from '@angular/compiler';
import { GraphService } from '../services/graph.service';
import { Subscription } from 'rxjs';
import { map, every } from 'rxjs/operators';


@Component({
  selector: 'app-d3graph',
   templateUrl: './d3graph.component.html',
  styleUrls: ['./d3graph.component.css']
//   template: `<svg width="200" height="200"> 
//   <defs>
//   <marker
//     id="arrow"
//     markerUnits="strokeWidth"
//     markerWidth="12"
//     markerHeight="12"
//     viewBox="0 0 12 12"
//     refX="6"
//     refY="6"
//     orient="auto">
//     <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: blue;"></path>
//   </marker>
// </defs></svg>`
})
export class D3graphComponent implements OnInit, OnDestroy {
  @ViewChild('svgRef', {read: ElementRef}) someComp;
  svgRef: ElementRef;
  childToDelete: string;
  private d3: D3;
  private parentNativeElement: any;
  private svg: any;
  
  private aaa = `{"1":[2,6],"2":[3,4,5],"3":[],"4":[],"5":[],"6":[7,8],"7":[9],"8":[9,10],"9":[],"10":[11,12],"11":[13],"12":[13],"13":[]}`;
  initalGraphSubscription: Subscription;


  constructor(element: ElementRef,private d3Service: D3Service, private graphServiceService: GraphService) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }
  drawTree(nodesMatrix: any){
               let d3 = this.d3;
            let data: {name: string, yVal: number}[] = [];
            let width: number = 100;
            let height: number = 1000;

    if (this.parentNativeElement !== null) {
      this.svg = d3.select('#chart')
          .append('svg')        
          .attr('width', width) 
          .attr('height', height);
let jsonRes = `{"1":[2,6],"2":[3,4,5],"3":[],"4":[],"5":[],"6":[7,8],"7":[9]}`;
let bbb = `{"1":[2,6],"2":[3,4,5]}`;
//var aaa = `{"1":[2,6],"2":[3,4,5],"3":[],"4":[15,16],"5":[],"6":[7,8],"7":[9],"8":[9,10],"9":[],"10":[11,12],"11":[13],"12":[13],"13":[]}`;
let allNodesMatrix = nodesMatrix;
let splitted = allNodesMatrix.split("]"); 
console.log("First splitted element: " + splitted[0] + splitted[0].length);
console.log(splitted[0][2]);
var root = splitted[0][2];
var countChildren = 0
var rootChildrenArray = [];
for(var i = 6;i < splitted[0].length; i+=2){
console.log("children: " + splitted[0][i])
rootChildrenArray.push(splitted[0][i]);
countChildren +=1;
}

let nodesWithCoordinates = new Map();
nodesWithCoordinates.set(root, "600,100");

if(countChildren == 1){
  nodesWithCoordinates.set(rootChildrenArray[0], "500,200");
}else if(countChildren == 2){
  nodesWithCoordinates.set(rootChildrenArray[0], "500,200");
  nodesWithCoordinates.set(rootChildrenArray[1], "700,200");
}else if(countChildren == 3){
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
    let parent = jsonRes[2];
    var jsonCircles = [];

    for(var i = 1; i< splitted.length - 1; i++){
      console.log("/////////////////////////" + splitted[i] + " " + "parent: " + splitted[i][2]);

      nodesWithCoordinates.forEach((value: string, key: string) => {
       var parentInThisLoopRotation = splitted[i][2];
       if(splitted[i][3] != `"`){
        parentInThisLoopRotation +=splitted[i][3];
         console.log("I FOUND TEEEN " + " " + parentInThisLoopRotation + parentInThisLoopRotation.length);
       }
        //look for parent coordinates 
        if(key == parentInThisLoopRotation){
          console.log("PPPPPPPPPPP " + parentInThisLoopRotation.length);

         console.log("-------------------------------- " + key  + " " + parentInThisLoopRotation + "-------- " + value);
         var countGrandChildren = 0;
         var childrenArray = [];
            let allSplittedChildren = splitted[i].split("["); 
            console.log("ALL CHILDREN: " + allSplittedChildren[1] + " size: " + allSplittedChildren[1].length)
            if(allSplittedChildren[1].length > 0){
            let tableWithSplittedChildrenByComa = allSplittedChildren[1].split(",");
            for(var m = 0; m < tableWithSplittedChildrenByComa.length; m++){
              console.log("EACH CHILD: " + tableWithSplittedChildrenByComa[m] )
              childrenArray.push(tableWithSplittedChildrenByComa[m]);
              countGrandChildren +=1;
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
          console.log("''''''''''''''''''''" + `"${fromParentX -40}"`);
           if(countGrandChildren == 1){
            nodesWithCoordinates.set(childrenArray[0], `${fromParentX - 60  + numberOfLoopCircuits * 15},${fromParentY + 100}`);
          }else if(countGrandChildren == 2){
            nodesWithCoordinates.set(childrenArray[0], `${fromParentX - 60 + numberOfLoopCircuits * 15},${fromParentY + 100}`);
            nodesWithCoordinates.set(childrenArray[1], `${fromParentX + 60 - numberOfLoopCircuits * 15},${fromParentY + 100}`);
          }else if(countGrandChildren == 3){
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
      console.log("KEY: " + key +  " Splitted: " + splitted1[0] + " " + splitted1[1]);
      jsonCircles.push( { "x_axis":splitted1[0], "y_axis": splitted1[1], "radius": 10, "color" : "green" , "label" : key});
      
    });
    // var jsonCircles = [
    //   { "x_axis":200, "y_axis": 100, "radius": 15, "color" : "green" },
    //   { "x_axis": 240, "y_axis": 150, "radius": 15, "color" : "purple"},
    //   { "x_axis": 160, "y_axis": 150, "radius": 15, "color" : "red"}];
      
      var svgContainer = d3.select("svg");
      svgContainer.selectAll("circle").remove();
      svgContainer.selectAll("text").remove();
      svgContainer.selectAll("line").remove();
      
     var circles = svgContainer.selectAll("circle")
                               .data(jsonCircles)
                               .enter()
                               .append("circle");
     
     var circleAttributes = circles
                            .attr("cx", function (d) { return d.x_axis; })
                            .attr("cy", function (d) { return d.y_axis; })
                            .attr("r", function (d) { return d.radius; })
                            .attr("stroke","black")
                            .style("fill", function(d) { return "white"; })
                           
    var text = svgContainer.selectAll("text")
                        .data(jsonCircles)
                        .enter()
                        .append("text");

var textLabels = text
                 .attr("x", function(d) { return d.x_axis-6; })
                 .attr("y", function(d) { return d.y_axis - (-5); })
                 .text( function (d) { return d.label; })
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "15px")
                 .attr("fill", "blue");
               console.log("Root is: " + root);

               var rootXCor;
               var rootYCor;
               nodesWithCoordinates.forEach((value: string, key: string) => {
               
                 if(key == root){
                  var splittedRootCoordinates = value.split(",");
                  rootXCor = splittedRootCoordinates[0];
                  rootYCor = splittedRootCoordinates[1];
                  console.log("============================" + splittedRootCoordinates[0] + " " + splittedRootCoordinates[1]);
                 }
                });
               for(var i = 0; i< rootChildrenArray.length; i++){
                 console.log("Root children are: " + rootChildrenArray[i]);
                 nodesWithCoordinates.forEach((value: string, key: string) => {
               
                  if(key == rootChildrenArray[i]){
                   var splittedChildCoordinates = value.split(",");
                   console.log("============================" + splittedChildCoordinates[0] + " " + splittedChildCoordinates[1]);

                   var ychild = parseInt(splittedChildCoordinates[1]);
                   var xchild = parseInt(splittedChildCoordinates[0]);
                   var line = svgContainer.append("line")
                   .attr("x1",`${rootXCor}`)  
                   .attr("y1",`${rootYCor - (-10)}`)  
                   .attr("x2", `${xchild}`)  
                   .attr("y2",`${ychild - 15}`)  
                   .attr("stroke","blue")  
                   .attr("stroke-width",2)  
                   .attr("marker-end","url(#arrow)"); 
                  }
                 });
               }
                 for(var i = 1; i< splitted.length - 1; i++){

                  var parentInThisLoopRotation = splitted[i][2];
                    if(splitted[i][3] != `"`){
                      parentInThisLoopRotation +=splitted[i][3];
                      // console.log("I FOUND TEEEN " + " " + parentInThisLoopRotation + " " + parentInThisLoopRotation.length);
                    }
                    nodesWithCoordinates.forEach((value: string, key: string) => {
               
                      if(key == parentInThisLoopRotation){
                       var splittedRootCoordinates = value.split(",");
                       rootXCor = splittedRootCoordinates[0];
                       rootYCor = splittedRootCoordinates[1];
                       console.log("============================" + splittedRootCoordinates[0] + " " + splittedRootCoordinates[1]);
                      }
                     });

                    let allSplittedChildren = splitted[i].split("["); 
                     // console.log("ALL CHILDREN: " + allSplittedChildren[1] + " size: " + allSplittedChildren[1].length)
                      if(allSplittedChildren[1].length > 0){
                      let tableWithSplittedChildrenByComa = allSplittedChildren[1].split(",");
                      for(var m = 0; m < tableWithSplittedChildrenByComa.length; m++){
                        console.log("EACH CHILD: " + tableWithSplittedChildrenByComa[m] )

                        nodesWithCoordinates.forEach((value: string, key: string) => {
               
                          if(key == tableWithSplittedChildrenByComa[m]){
                           var splittedChildCoordinates = value.split(",");
                           console.log("============================" + splittedChildCoordinates[0] + " " + splittedChildCoordinates[1]);
        
                           var ychild = parseInt(splittedChildCoordinates[1]);
                           var xchild = parseInt(splittedChildCoordinates[0]);
                           var line = svgContainer.append("line")
                           .attr("x1",`${rootXCor}`)  
                           .attr("y1",`${rootYCor - (-10)}`)  
                           .attr("x2", `${xchild}`)  
                           .attr("y2",`${ychild - 15}`)  
                           .attr("stroke","blue")  
                           .attr("stroke-width",2)  
                           .attr("marker-end","url(#arrow)"); 
                          }
                         });
                      }
                 }

          }
      }
  };

  ngOnInit() {
    this.initalGraphSubscription = this.graphServiceService.getInitialGraph().subscribe(initGraph => {
      this.aaa = initGraph;
      this.drawTree(this.aaa);
    });
   }

  ngOnDestroy() {
    this.initalGraphSubscription.unsubscribe();
  }


  //  myFunc(){

  //   this.drawTree(this.aaa);
  //  }

   deleteNode({form, value, valid}) {
    this.graphServiceService.removeNode(value.childToDelete).subscribe((currentGraph) => {
      let d3 = this.d3;
      this.svg.remove();
      // d3.select(this.parentNativeElement).remove();
      // d3.select("svg")
      this.aaa = currentGraph;
      this.drawTree(this.aaa);
    });


    //   var finalMatrix = "";
    //   console.log("Delete node: " + value.childToDelete);
    //   let aaa = this.aaa;
    //   let splitted = aaa.split("]"); 
    // //  console.log("aaa is: " + aaa);

    //   for(var i = 1; i< splitted.length - 1; i++){
    //   if(i == 1){
    //     finalMatrix += splitted[0];
    //     finalMatrix += `]`;
    //   }

      
    //     //znajdz w tablicy ten wierzcholek
    //   console.log("SplittedL " + splitted[i]);
    //   var parentNode = splitted[i][2];

    //   if(splitted[i][3] != `"`){
    //     parentNode += splitted[i][3];
    //   }

    //   console.log(parentNode);

    //   let nextsplit = splitted[i].split("[");

        
    // // usun cos takiego "5":[]
    //   if(parentNode == value.childToDelete && nextsplit[1].length == 0){
    //     console.log("This node can be deleted ++++++++" + parentNode + splitted[i]);
      
    //   }else{
    //     if(finalMatrix.length > 0){
    //       for(var p = 0; p < finalMatrix.length; p++){
    //         console.log(" MATRIX SIZE:[[[[[[[[[[ " + finalMatrix.length);
    //         var childWithTwoNumbers = finalMatrix[p]+finalMatrix[p+1];
    //         if(finalMatrix[p] == value.childToDelete){
    //           console.log("Parent node: " + value.childToDelete);
    //           console.log(" OOOOOOOOOOOO " + finalMatrix[p] + " " + finalMatrix[p+1] + "child ;" + childWithTwoNumbers + " OOOOOOOOOOOOO " + p);
    
    //         //finalMatrix =  finalMatrix.slice(p, p+1);
    //         // finalMatrix -= finalMatrix[p];
    //         console.log("2222222222222222222222: " + finalMatrix[p+1]);

    //         if(finalMatrix[p-1] == `,` || finalMatrix[p-1] == `[`){ //nie usuwaj np 3 z 13
    //           if(finalMatrix[p+1] == `]` && finalMatrix[p-1] == `,`){
    //               finalMatrix = finalMatrix.replace( `,` + finalMatrix[p], "");

    //             }else if(finalMatrix[p+1] == `,` && finalMatrix[p-1] == `,`){
    //               finalMatrix = finalMatrix.replace(finalMatrix[p] + `,`, "");
    //             }else if(finalMatrix[p+1] == `,` && finalMatrix[p-1] != `,`){
    //               finalMatrix = finalMatrix.replace(finalMatrix[p] + `,`, "");
    //             }else if(finalMatrix[p+1] == `]`){
    //               finalMatrix = finalMatrix.replace(finalMatrix[p], "");

    //             }

    //         }
    //         //finalMatrix = finalMatrix.replace(finalMatrix[p] +1, ""); 
    //         // finalMatrix.slice(p -1 , p + 1);
    //         //  continue;
    //         // }else if(childWithTwoNumbers == value.childToDelete){
    //         //   //while(childWithTwoNumbers == value.childToDelete){
    //         //  // finalMatrix = finalMatrix.split(childWithTwoNumbers);

    //         //  console.log("SSSSSSSS: " + finalMatrix[p+2]);
    //         //   if(finalMatrix[p+2] == `,`){
    //         //     childWithTwoNumbers = childWithTwoNumbers + `,`;
    //         //     finalMatrix = finalMatrix.split(childWithTwoNumbers);

    //         //     // finalMatrix = finalMatrix.replace(finalMatrix[childWithTwoNumbers], "");
    //         //     // finalMatrix = finalMatrix.replace(finalMatrix[p+1] + `,`, "");
    //         //  }else if(finalMatrix[p+2] == `]`){
    //         //   // finalMatrix = finalMatrix.replace(finalMatrix[p], "");
    //         //   // finalMatrix = finalMatrix.replace(finalMatrix[p+1], "");
    //         //   finalMatrix = finalMatrix.split(childWithTwoNumbers);


    //         //  }
    //       // }
    //         }
    //       }
    //   }
    //     finalMatrix += splitted[i];
    //     finalMatrix += `]`;
    //   }

    // //   if(finalMatrix.length > 0){
    // //     for(var p = 0; p < finalMatrix.length; p++){
    // //       console.log(" MATRIX SIZE:[[[[[[[[[[ " + finalMatrix.length);
    // //       if(finalMatrix[p] == value.childToDelete){
    // //         console.log("Parent node: " + value.childToDelete);
    // //         console.log(" OOOOOOOOOOOO " + finalMatrix[p] + " OOOOOOOOOOOOO " + p);

          
    // //         //finalMatrix -= finalMatrix[p];
    // //         finalMatrix.replace(finalMatrix[p], ""); 
    // //         //finalMatrix.slice(p -1 , p + 1);
    // //         continue;
    // //       }
    // //     }
    // // }
    // //  console.log("FINAL MATRIX: ----- " + finalMatrix );
    // // let nextsplit = splitted[i].split("["); 

    // //  console.log("Next split: " + nextsplit[0] + " ---" +  nextsplit[1]);

    //   if(nextsplit[1].length == 0){
    //     console.log("No children");
    //   }

    //   }


      
    //     finalMatrix += `}`;

    //   // this.d3.select("svg").remove();

    //     console.log("FINAL MATRIX: ----- " + finalMatrix );
    //   //window.location.reload();
    //     this.aaa= `${finalMatrix}`;
    //     console.log(this.aaa);
    //     this.drawTree(this.aaa);
    // });
  }
}