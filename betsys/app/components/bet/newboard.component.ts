import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common'
import { Router } from '@angular/router';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { htmlTemplate } from './newboard.component.html';
import { BetService } 	from 'app/services/bet.service';

import { ListToObjectTransform, ObjectToArrayTransform, 
         ReturnTextColorRelativeToBackground, ArrayShuffle }  from 'app/pipes/bet.pipes';
 
@Component({
    selector : 'relative-path',
    template : htmlTemplate
})

export class NewBoardComponent {
	
    	components = [];
      componentsLen = 0;
      componentsAssoc = {
        'Off': {
          'bgColor': '#FFFFFF',
          'textColor': '#000000'
        }
      };

      recordsMeta = {};
      stylesMeta = {};

      // For bet box..
      cols = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];

      betCellCommonStyles = {
        tsize: 24,
        tstyle: "bold",
        font: "Book Antigua"
      };

      // Row condition 1..
      condCells = {
          "bottom2": [
              {color:"#000000", bgColor:"#FFFFFF", condID:12, text:"", orgText:""},
              {color:"#000000", bgColor:"#FFFFFF", condID:13, text:"", orgText:""}
          ],
          "bottom1": [
              {color:"#000000", bgColor:"#FFFFFF", condID:0, text:"", orgText:""},
              {color:"#000000", bgColor:"#FFFFFF", condID:2, text:"", orgText:""},
              {color:"#000000", bgColor:"#FFFFFF", condID:3, text:"", orgText:""},
              {color:"#000000", bgColor:"#FFFFFF", condID:7, text:"", orgText:""},
              {color:"#000000", bgColor:"#FFFFFF", condID:8, text:"", orgText:""},
              {color:"#000000", bgColor:"#FFFFFF", condID:9, text:"", orgText:""}
          ],
          "right1": [
              {color:"#000000", bgColor:"#FFFFFF", condID:4, text:"", orgText:""},
              {color:"#000000", bgColor:"#FFFFFF", condID:5, text:"", orgText:""},
              {color:"#000000", bgColor:"#FFFFFF", condID:-1, text:"", orgText:""}           
          ],
          "right2": [
              {color:"#000000", bgColor:"#FFFFFF", condID:-1, text:"", orgText:""},
              {color:"#000000", bgColor:"#FFFFFF", condID:-1, text:"", orgText:""},
              {color:"#000000", bgColor:"#FFFFFF", condID:-1, text:"", orgText:""}
          ]
      };

      selectedComponentInput : any;

      listToObjectPipe = new ListToObjectTransform();
      objectToArrayPipe = new ObjectToArrayTransform();
      returnTextColorRelativeToBackground = new ReturnTextColorRelativeToBackground(); 
      arrayShuffle = new ArrayShuffle();

    	pageMeta = {
        "pageSectionBackground": "",
        "colorDefaults": ['#BE0032', '#222222', '#4FF773', '#FFFF00', '#A1CAF1', '#C2B280',
                          '#E68FAC', '#F99379', '#F38400', '#848482', '#008856', '#0067A5', '#604E97',
                          '#B3446C', '#654522', '#EA2819'],
    		"colorSection": {
                          "title": "Create New Custom Board:",

    		                  "subtitle": "Click on the component box to choose the colors for the components you want to use. Once you are done click the save button. If you do not want to choose custom colors, click Auto-Select and save.",
                          
                          "buttons": [{
                                  "key": "auto-select",
                                  "label": "Auto-Select"
                                }, {
                                  "key": "reset",
                                  "label": "Reset"    
                                }, {
                                  "key": "save",
                                  "label": "Save"
                          }],

                          "errorText": ""
                        },
          "dragDropSection": {
                          "title": "Drag and drop components to blank boxes below. You may leave boxes blank.",

                          "subtitle": "",

                           "buttons": [{
                                  "key": "reset",
                                  "label": "Reset"
                                }],

                            "errorText": ""
                        },
           "blankBoardSection": {
                          "title": "",
                          
                          "subtitle": "",

                          "buttons": [{
                                  "key": "reset",
                                  "label": "Reset"
                                }, {
                                  "key": "save",
                                  "label": "Save"
                            }],

                           "errorText": "" 
           }                                   
    	};

      componentShorthands = {
        'Off' : 'Off',
        'RiskOn': 'RON',
        'RiskOff': 'ROFF',
        'LowestEquity': 'LE',
        'HighestEquity': 'HE',
        'AntiHighestEquity': 'AHE',
        'AntiLowestEquity': 'ALE',
        'Anti50/50': 'A50',
        'Seasonality': 'SEA',
        'Anti-Seasonality': 'ASEA',
        'Previous': 'PREV',
        'Anti-Previous': 'AP',
        'Custom': 'Custom',
        'Anti-Custom': 'AC',
        '50/50': '50/50'
      };

    	error: any;

      constructor(
          private router:Router,
          private betService: BetService
      ) {
        this.getRecords();
      	this.getComponentsList();
      }


      getRecords() {
        var _this = this;

        this.betService
            .getRecords()
            .then(function(response) {

              _this.recordsMeta = response.first;

              _this.customBoardStylesMeta = _this.listToObjectPipe.transform(response.first.customstyles);

              _this.assignPageMeta();

            })
            .catch(error => this.error = error);
      }

      assignPageMeta() {
        this.pageMeta.colorSection.buttons[0]['label'] = this.customBoardStylesMeta['b_auto_select']['text'];
        this.pageMeta.colorSection.buttons[1]['label'] = this.customBoardStylesMeta['b_reset_colors']['text'];
        this.pageMeta.colorSection.buttons[2]['label'] = this.customBoardStylesMeta['b_save_colors']['text'];

        this.pageMeta.blankBoardSection.buttons[0]['label'] = this.customBoardStylesMeta['b_reset_board']['text'];
        this.pageMeta.blankBoardSection.buttons[1]['label'] = this.customBoardStylesMeta['b_save_board']['text'];

        this.pageMeta.colorSection.errorText = this.customBoardStylesMeta['d_save_color_error']['text'];
        this.pageMeta.blankBoardSection.errorText = this.customBoardStylesMeta['d_save_board_error']['text'];
        this.pageMeta.pageSectionBackground = "#" + this.customBoardStylesMeta['background']['fill-Hex'];

        this.pageMeta.colorSection.subtitle = this.customBoardStylesMeta['text_choose_colors']['text'];
        this.pageMeta.dragDropSection.title = this.customBoardStylesMeta['text_place_components']['text'];

        this.pageMeta.colorDefaults = this.pushAutoSelectColors(this.customBoardStylesMeta['list_autoselect']);       

      }

      pushAutoSelectColors(colorsAry) {

        var colors = [];
        
        for(var i=0; i < colorsAry.length; i++) {
            var curColor = "#" + colorsAry[i].fill-Hex;
            colors.push(curColor);
        }

        return colors;
      }

      getComponentsList() {
        var _this = this;

      	this.betService
        		.getComponents()
        		.then(function(response) {
              _this.components = _this.objectToArrayPipe.transform(response.components);

              _this.componentsLen = _this.components.length;

              _this.addComponentMetadata();

              _this.generateComponentAssoc();

            })
        		.catch(error => this.error = error);
      }

      addComponentMetadata() {

        for(var i = 0; i < this.componentsLen; i++) {
            var curComp = this.components[i];

            this.setComponentDefaults(curComp, i);                
        }

      }


      generateComponentAssoc() {
        for(var i = 0; i < this.componentsLen; i++) {
          var curComp =  this.components[i];
          var curCompKey =  curComp['key'];
          this.componentsAssoc[curCompKey] = curComp;
        }
      } 

     setComponentDefaults(curComp, index) {
          curComp['bgColor'] = '#FFFFFF';
          curComp['textColor'] = '#000000';
          curComp['sectionIndex'] = 0;
          curComp['boardIndex'] =  '';
          
          //@TODO: Need to remove this if not used
          curComp['componentIndex'] = index;
     }

     colorSectionAction(type) {
          switch(type) {
            case "auto-select": this.applyAutoSelectColors(); break;
            //Need to group the resets of selectColor, dragDrop and blankBoard
            case "reset": this.applySelectColorReset(); break; 
            case "save": this.applySelectColorSave(); break;
            default: break;
          }
     }

     applyAutoSelectColors() {
          this.pageMeta.colorDefaults = this.arrayShuffle.transform(this.pageMeta.colorDefaults);
          var autoColorsAryLen = this.pageMeta.colorDefaults.length;
          for(var i = 0; i < this.componentsLen; i++) {
            var curComp = this.components[i];

            //Apply auto-select only for the components in select color section
            if(curComp['sectionIndex'] === 0) {
              var defaultColorIndex = i % autoColorsAryLen;
              curComp['bgColor'] = this.pageMeta.colorDefaults[defaultColorIndex];
              curComp['textColor'] = this.returnTextColorRelativeToBackground.transform(curComp['bgColor']);
            }
          
          }   
     }

     applySelectColorReset() {
        for(var i = 0; i < this.componentsLen; i++) {
            var curComp = this.components[i];

            //Apply reset to default colors
            if(curComp['sectionIndex'] === 0) {
              curComp['bgColor'] = '#FFFFFF';
              curComp['textColor'] = '#000000';
            }
        }    
     }

     applySelectColorSave() {
        for(var i = 0; i < this.componentsLen; i++) {
            var curComp = this.components[i];

            //Make the components draggable if their background color is changed(i.e.., not the default #FFFFFF)
            //Since Off is not a draggable component, dont allow it to be moved to draggable section
            if(curComp['sectionIndex'] === 0) {
                if(curComp['bgColor'] !== "#FFFFFF" && curComp['key'] !== "Off") {
                  curComp['sectionIndex'] = 1;    
                }
            }
        }    
     }

     openColorPicker(curComp, $event) {
      $event.stopPropagation();
      this.selectedComponentInput = $event.currentTarget.firstElementChild;
      this.selectedComponentInput.click();

     }

     updateComponentStyles(curComp) {
      curComp['bgColor'] = this.selectedComponentInput.value;
      curComp['textColor'] = this.returnTextColorRelativeToBackground.transform(curComp['bgColor']);
     }

     dragDropSectionAction(type) {
        switch(type) {
          case "reset": this.dragDropSectionReset(); break;
          default: break;
        }
     }

     dragDropSectionReset() {
        for(var i = 0; i < this.componentsLen; i++) {
            var curComp = this.components[i];

            //Move the components back to choose color section
            if(curComp['sectionIndex'] === 1) { 
                  curComp['sectionIndex'] = 0;    
            }
        }
     }

     droppedComponent(event, cellObj) {

        if(cellObj['orgText'] === '') {
            var draggedComponent = event.dragData;
            cellObj['bgColor'] = draggedComponent['bgColor'];
            cellObj['color'] = draggedComponent['textColor'];
            cellObj['text'] = this.componentShorthands[draggedComponent['key']];
            cellObj['orgText'] = draggedComponent['key'];

            draggedComponent['boardIndex'] =  'c' + cellObj['condID'];
            draggedComponent['sectionIndex'] = 2;
        } else {
          return;
        }
     }

    blankBoardAction(type) {
          switch(type) {
            case "reset": this.applyBlankBoardReset(); break; 
            case "save": this.saveBlankBoard(); break;
            default: break;
          }
     }

     applyBlankBoardReset() {

        for(var key in this.condCells) {
            var curCellGroup = this.condCells[key];

            for(var i=0; i < curCellGroup.length; i++) {
              var curCell = curCellGroup[i];
              var componentKey = curCell['orgText'];

              if(componentKey !== '') {
                  curCell['color'] = '#000000';
                  curCell['bgColor'] = '#FFFFFF';
                  curCell['text'] = '';
                  curCell['orgText'] = '';  
                
                  //Move the component from blank board to draggable section
                  var componentMeta = this.componentsAssoc[componentKey];
                  componentMeta['boardIndex'] =  '';
                  componentMeta['sectionIndex'] = 1;  
              }

            }
        }
     }

     saveBlankBoard() {

     }
}