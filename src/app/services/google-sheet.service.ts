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
}