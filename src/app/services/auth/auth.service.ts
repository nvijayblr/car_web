
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Constant } from '../../utill/constants/constant';
@Injectable()
export class AuthService implements CanActivate, CanActivateChild {
  public authState:any;

  constructor(
    private router: Router,
    private constant: Constant
    ){}
  canActivate() {
    console.log('i am checking to see if you are logged in');
    return true;
  }

  getAccessLevels(_moduleName) {
    let ModuleTransactions = this.constant.userAuth ? this.constant.userAuth['ModuleTransactions']:[];
    if(!ModuleTransactions) {
      this.router.navigate(['/login']);
      return {};
    }
    this.constant.authState = ModuleTransactions.filter(item=>{
      return item.ModuleCode == _moduleName
    })[0];
    this.authState = this.constant.authState;
    if(!this.authState) {
      this.router.navigate(['/404']);
      return {};
    }
    this.constant.accessLevels.isLeveOne = false;
    this.constant.accessLevels.isLevelTwo = false;
    
    if(this.authState.TransactionWeightage >= this.constant.accessLevels.levelOne) {
      this.constant.accessLevels.isLeveOne = true;
    }else if(this.authState.TransactionWeightage >= this.constant.accessLevels.levelTwo) {
      this.constant.accessLevels.isLevelTwo = true;
    } 
    return {isLevelOne:this.constant.accessLevels.isLeveOne, isLevelTwo: this.constant.accessLevels.isLevelTwo};
  }

  getTransactionWeightage(_moduleName) {
    let ModuleTransactions = this.constant.userAuth ? this.constant.userAuth['ModuleTransactions']:[];
    if(!ModuleTransactions) {
      this.router.navigate(['/login']);
      return {};
    }
    this.constant.authState = ModuleTransactions.filter(item=>{
      return item.ModuleCode == _moduleName
    })[0];
    this.authState = this.constant.authState;
    if(!this.authState) {
      this.router.navigate(['/404']);
      return {};
    }
    return this.authState.TransactionWeightage;
  }


  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url:any = state.url;
  	let userData  = localStorage.getItem("userData");
  	let AuthToken  = localStorage.getItem("AuthToken");
  	if( !userData  || !AuthToken ) {
      if(url.indexOf("/dashboard/claim/Viewclaim/") == 0 || 
        url.indexOf("/dashboard/capa/CAPA/") == 0 || 
        url.indexOf("/dashboard/claim/Respond/") == 0) {
        sessionStorage.setItem("Redirectionlink", url);
      }
      this.constant.userAuth = {}; 
  		this.router.navigate(['/login']);
    	return false;
  	} else {
      this.constant.userAuth = JSON.parse(userData);
      sessionStorage.removeItem("Redirectionlink");
  		return true;
  	}
  }
}