import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "dataFilter"
})
export class DataFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            console.log(query,'query')
            return _.filter(array, row => row.name.indexOf(query) > -1);
        }
        return array;
    }
}

@Pipe({
    name: "spaceToHyphen"
})
export class SpaceToHyphen implements PipeTransform {
    transform(str: String): any {
        if(str) {
            return _.replace(str, / /g, '-').toLowerCase();
        }
        return '';
    }
}


@Pipe({
    name: 'InitiatorPhone'
 })

export class InitiatorPhone{
    transform(val, args) {
        if(val){
            let  value:string = val.replace(/-/g, "")
            value = value.substring(0, 10)
            let temp:string = '' ;
            let i:number = 0;
            let limit:number = Math.floor(value.length/3);
            let rem:number = value.length/3;
            for( ;i < limit; i++){
                if(i < 2){
                    temp = temp + value.substr(i*3, 3) + '-';
               
                }else{
                    temp = temp + value.substr(i*3, 3)
                }
            }

            let rtrn = (temp + value.substr(i*3)).substring(0, 12);
            if(rtrn.substr(rtrn.length - 1) =='-'){
                rtrn = rtrn.slice(0,-1)
            }

            return rtrn
        }
    }
}

