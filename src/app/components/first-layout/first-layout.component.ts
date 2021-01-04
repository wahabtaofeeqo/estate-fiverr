import { Component, OnInit, Input, SecurityContext } from '@angular/core';
import { GoogleSheetService } from '../../services';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-first-layout',
  templateUrl: './first-layout.component.html',
  styleUrls: ['./first-layout.component.css']
})


export class FirstLayoutComponent implements OnInit {

	parameter: any;
	metaDataObj: any;
	btnText = "הצג מספר טלפון";

	colorsObj = {
		header: '',
		btnColor: '',
		headerFlag: '',
		headerTitle: '',
		QAFlag: '',
		numbers: '',
		flagOne: '',
		flagTwo: '',
		flagThree: '',
		flagFour: ''
	};

	propertyData = {
		d: '',
		phone: '',
		whatsapp: '',
		e: ''
	};

	waze = "https://www.waze.com/ul?q=";

	groupTwo = [];
	groupThree = [];

	propertyFAQ = [];
	mapURL: any;
	frameUrl: any;

	baseUrl = "https://docs.google.com/spreadsheets/d/";
	sheet_file_id = "1Z_QCBE2357CKv51adNFW1dtXGoWJWYrkqA14TC1lhUg";

  	constructor(private service: GoogleSheetService, 
  		private http: HttpClient, 
  		private sanitizer: DomSanitizer,
  		private activated: ActivatedRoute,
  		private router: Router) {
  	}

  	ngOnInit(): void {
  		this.metaDataObj = this.service.getMetaData();
  		this.activated.queryParams.subscribe(params => {
  			this.parameter = params.m;
  		});

  		if (!this.metaDataObj) {
  			this.loadMetaData(this.parameter); // Incase of page refresh
  		}
  		else {
  			this.setup();
  		}
  	}

  	setup() {

  		let url = "https://my.matterport.com/show?m=";
	  	this.frameUrl = url + this.metaDataObj.basic_params.matterport_scan_id + this.metaDataObj.basic_params.url_parameters;

	  	this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.frameUrl);
	  	
	  	this.loadProperties();
	  	this.loadColors(this.metaDataObj.basic_params.color_plate_id);
	  	this.loadFAQ();
  	}

  	loadMetaData(filter) {

	    let sheetName = "Master";  
	    let filterQuery = 'select * where B = "'+ filter +'"';
		let urlToFetch = this.baseUrl + this.sheet_file_id + "/gviz/tq?sheet=" + encodeURIComponent(sheetName) + "&headers=1&tq=" + encodeURIComponent(filterQuery);
		
		this.http.get<any>(urlToFetch).subscribe(response => {}, error => {
	      	let data = this.parseData(error);
	      	if (data.length > 0) {
	      		this.metaDataObj = data[0];
	      		this.setup();
	      	}
	    })
  	}

  	loadColors(filter) {

  		let sheetName = "Color_Plates";
  		let filterQuery = 'select * where A = ' + filter;
  		let urlToFetch = this.baseUrl + this.sheet_file_id + "/gviz/tq?sheet=" + encodeURIComponent(sheetName) + "&headers=1&tq=" + encodeURIComponent(filterQuery); // Filter  by  color_plate_id is missing
  		this.http.get<any>(urlToFetch).subscribe(success => {}, error => {

	      	let data = this.parseData(error);
	      	if (data.length > 0) {
		      	let colors = data[0].basic_params;
		      	this.colorsObj.header = colors['Header Background'];
		      	this.colorsObj.btnColor = colors['Phone Number Button'];
		      	this.colorsObj.flagOne = colors['Flag 1'];
		      	this.colorsObj.flagTwo = colors['Flag 2'];
		      	this.colorsObj.flagThree = colors['Flag 3']
		      	this.colorsObj.flagFour = colors['Flag 4'];
		      	this.colorsObj.headerFlag = colors['Header Flag'];
		      	this.colorsObj.headerTitle = colors['Header Title'];
		      	this.colorsObj.QAFlag = colors['QA Flag'];
		      	this.colorsObj.numbers = colors['Numbers Color']
	      	}
	    });
  	}


  	loadProperties() {
  		if (this.metaDataObj) {

  			let sheetName = this.metaDataObj.basic_params.sheet_name;
  			let sheetFileID = this.metaDataObj.basic_params.sheet_file_id;

	  		let urlToFetch = this.baseUrl + sheetFileID + "/gviz/tq?sheet=" + encodeURIComponent(sheetName) + "&headers=1";
	  		this.http.get<any>(urlToFetch).subscribe(success => {}, error => {
		      	let data = this.parseData(error);

		      	let properties = data[0];

				this.mapURL = this.sanitizer.bypassSecurityTrustResourceUrl( "https://maps.google.com/maps?q=" 
			  		+ encodeURIComponent(properties.additional_params['רחוב'] + ' '
			  		+ properties.additional_params['מס בית'] + ' ' + properties.additional_params['עיר']) 
			  		+ "&t=&z=17&ie=UTF8&iwloc=&output=embed&hl=iw");

				this.waze = this.waze + data[0].basic_params.waze;
		      	this.propertyData.d = data[0].basic_params.כותרת 
		      	this.propertyData.phone = data[0].basic_params.טלפון
		      	this.propertyData.e = data[0].basic_params.תיאור
		      	this.propertyData.whatsapp = "https://wa.me/972" + this.propertyData.phone + "?text=" + encodeURI(this.propertyData.d)
		      	
		      	// this.groupTwo = data[0].additional_params;
		      	// this.groupThree = data[0].additional_features;
		      	
		      	let two = [];
		      	let three = [];

		      	for(const prop in data[0].additional_features) {
		      		let temp = {
		      			prop: prop,
		      			value: data[0].additional_features[prop]
		      		};

		      		three.push(temp);
		      	}
		      	this.groupThree = three;

		      	for(const prop in data[0].additional_params) {
		      		let temp = {
		      			prop: prop,
		      			value: data[0].additional_params[prop]
		      		};

		      		two.push(temp);
		      	}
		      	this.groupTwo = two;
		    });
  		}
  	}

  	loadFAQ() {

  		if (this.metaDataObj) {

  			let sheetName = this.metaDataObj.basic_params.link_name + "_faq";
	  		let sheetFileID = this.metaDataObj.basic_params.sheet_file_id;
		  	let urlToFetch = this.baseUrl + sheetFileID + "/gviz/tq?sheet=" + encodeURIComponent(sheetName) + "&headers=1";

		  	this.http.get(urlToFetch).subscribe(success => {}, error => {

		  			let data = this.parseData(error);

		  			if (data.length > 0) {
		  				for (var i = 0; i < data.length; i++) {
		  					let faq = {
		  						q: data[i].basic_params.שאלה,
		  						a: data[i].basic_params.תשובה
		  					}
		  					this.propertyFAQ.push(faq);
		  				}
		  			}
		  		});
  		}
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

		return objects;
  	}

  	showPhoneNumber() {
  		this.btnText = this.propertyData.phone;
  		this.notify();
  	}

  	notify() {
  		this.service.notityGoogleAnalytics(this.metaDataObj['Google_Analytics'], 'Button clicks');
  		this.service.notityFacebookPixel(this.metaDataObj['Pixel_accounts'], 'Button clicks');
  	}


}