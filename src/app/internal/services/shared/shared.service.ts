import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../../../utill/constants/constant'

@Injectable()
export class SharedService {
    public _bar: any = "HomeGet";
    constructor(
        private toastr: ToastsManager,
        private appConstants:Constant
    ) {
    }

    private emitChangeSource = new Subject<any>();
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

    // Toaster popup general method
    toasterMessage(args){
        console.log(args)
        let type:string = (args.type)?args.type:'info';
        let message:any = (args.message)?args.message:'';
        let title:string = (args.title)?args.title:'';
        let confg:any = (this.appConstants.toasterConfig)?this.appConstants.toasterConfig:{}
        switch (type) {
            case "success":
                title = (title)?title:'Success'
                this.toastr.success(message, title,confg);
                break;
            case "error":
                title = (title)?title:'Error'
                this.toastr.error(message, title,confg);
                break;
            case "warning":
                title = (title)?title:'Warning'
                this.toastr.warning(message, title,confg);
                break;
            case "info":
                this.toastr.info(message,confg);
                break;
            default:
                this.toastr.info(message,confg);
                break;
        }
    }
}
