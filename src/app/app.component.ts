import { Component,ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import 'mdn-polyfills/Object.assign';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    signIn: any = 'hello';
    title = 'App 567';
    theme:any = 'modern'; // classic, modern
    currentPage:any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public toastr: ToastsManager, vRef: ViewContainerRef
        ){
            console.log('AppComponent');
            this.route.fragment.subscribe((fragment: string) => {
            this.currentPage = fragment;
            this.toastr.setRootViewContainerRef(vRef);
        })
    }

    gotoLogin(): void {
        const link = ['/login'];
        this.router.navigate(link);
    }

    ngOnInit() {
    }
}
