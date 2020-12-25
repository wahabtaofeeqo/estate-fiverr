import { Component, OnInit } from '@angular/core';
import { GoogleSheetService } from './services';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

	baseUrl = "https://docs.google.com/spreadsheets/d/";
	sheet_file_id = "1Z_QCBE2357CKv51adNFW1dtXGoWJWYrkqA14TC1lhUg";

	error: boolean = false;
	metaDataObj: any;
	parameter: any;
	
	constructor(private service:GoogleSheetService, 
		private router:Router, 
		private http: HttpClient,
		private activated: ActivatedRoute) {}

	ngOnInit() {

		this.activated.queryParams.subscribe(params => {
			this.parameter = params.m;
			if (this.parameter != null || this.parameter != undefined) {
				this.loadMetaData(this.parameter);
			}
			else {
				console.log("Parameter is missing");
				//alert("missing parameter")
			}
		})
	}

	loadMetaData(filter: any) {

	    let sheetName = "Master";
	    let filterQuery = 'select * where B = "' + filter +'"';
		let urlToFetch = this.baseUrl + this.sheet_file_id + "/gviz/tq?sheet=" + encodeURIComponent(sheetName) + "&headers=1&tq=" + encodeURIComponent(filterQuery);

		this.http.get<any>(urlToFetch).subscribe(response => {}, error => {
	      		
	      	let data = this.parseData(error);
	      	if (data.length > 0) {
	      		this.metaDataObj = data[0];
	      		this.service.setMetaData(this.metaDataObj);

	      		if (this.metaDataObj.basic_params.layout_id == 0) {
		  			this.router.navigate(['/one'], {queryParams: {m: this.parameter}});
		  		}
		  		else {
		  			this.router.navigate(['/two'], {queryParams: {m: this.parameter}});
		  		}
	      	}
	    })
  	}

  	parseData(error): any {

  		let objects = [];

		if (error.status == 200) {
			let jsonData = JSON.parse(error.error.text.substring(47, error.error.text.length - 2));
			
			jsonData.table.rows.forEach(row => {

				let rowObj = {
					basic_params: {},
					additional_params: {},
					additional_features: {}
				};

				let sub_category = "basic_params";

				for (var i = 0; i < row.c.length; i++) {
				    if (jsonData.table.cols[i].label == "divider1") {
						sub_category = "additional_params";
					}

					if (jsonData.table.cols[i].label == "divider2") {
						sub_category = "additional_features";
					}
							                
					const element = row.c[i];
					if (element && element.v) {
						rowObj[sub_category][jsonData.table.cols[i].label] = element.v;
					}
				}

				objects.push(rowObj);
			});
		}
		else {
			this.error = true;
		}

		return objects;
  	}
}