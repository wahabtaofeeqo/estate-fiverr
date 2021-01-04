import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root'
})

export class GoogleSheetService {

    private metaData: any;

  	constructor() { }

    setMetaData(data) {
      this.metaData = data;
    }

    getMetaData() {
      return this.metaData;
    }

    notityGoogleAnalytics(id, event) {
    	(<any>window).ga('create', id, 'auto');
    	(<any>window).ga('sent', 'event', 'Button', 'click', 'GA');
    }

    notityFacebookPixel(id, event) {
    	(window as any).fbq('init', id);
   		(<any>window).fbq('track', event);
    }
}