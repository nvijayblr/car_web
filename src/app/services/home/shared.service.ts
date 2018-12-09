import { Injectable } from '@angular/core';
import { Observable, Observer  } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { NullTemplateVisitor } from '@angular/compiler';

@Injectable()
export class SharedService {

    //name = "micronyks";

    public _bar: any = "HomeGet";

    private emitChangeSource = new Subject<any>();
    private previousURL: string[]=[];
    changeEmitted$ = this.emitChangeSource.asObservable();

    emitChange(data: {}) {
        this.emitChangeSource.next(data);
    }

    get breadCrumb(): any {
        return this._bar;
    }
    set breadCrumb(theBar: any) {
        this._bar = theBar;
    }

    resetPreviousURL() {
        this.previousURL=[];
        localStorage.removeItem("previousUrls");
    }

    setPreviousURL(url:any) {
        this.previousURL.push(url);
         localStorage.setItem("previousUrls", JSON.stringify(this.previousURL));

    }

    getPreviousURL() {
        if((localStorage.getItem("previousUrls") === null)) {
            return null;
        }
        else {
            if(this.previousURL.length==0)
                this.previousURL=  JSON.parse(localStorage.getItem('previousUrls'));         
            let url=this.previousURL.splice(-1,1)[0];
            localStorage.setItem("previousUrls", JSON.stringify(this.previousURL));
            return url;
        }   

    }

    /*data: any;
    dataChange: Observable<any>;

    constructor() {
        this.dataChange = new Observable((observer: Observer) {
            this.dataChangeObserver = observer;
        });
    }  

    setData(data: any) {
        this.data = data;
        this.dataChangeObserver.next(this.data);
    }*/
}
