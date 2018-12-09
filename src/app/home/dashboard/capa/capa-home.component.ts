import { Component, OnInit } from '@angular/core';
import {Constant} from '../../../utill/constants/constant'


@Component({
  selector: 'app-capa-home',
  templateUrl: './capa-home.component.html',
  styleUrls: ['./capa-home.component.css']
})
export class CapaHomeComponent implements OnInit {
	public isLeveOne: boolean;
	public isLevelTwo: boolean;
	public authState:any;
  constructor(
  	private constant:Constant
  	) { }

  ngOnInit() {
  }

}
