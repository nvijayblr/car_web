
import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[pasteNumberOnly]'
})
export class Numbers {

    constructor(public el: ElementRef) {
        this.el.nativeElement.onpaste = (evt) => {
            if(this.checkForNumberValue(evt.clipboardData.getData('text/plain')))
            evt.preventDefault();
        };
        // this.el.nativeElement.ondrop = (evt) => {
        //     var data = evt.dataTransfer.getData("text");
        //     data;
        //     // if(this.checkForNumberValue(evt.clipboardData.getData('text/plain')))
        //     // evt.preventDefault();
        // };       
   
    }
    checkForNumberValue(data){
        var temp : boolean;
        temp = isNaN(data);
        return temp;
    }
}