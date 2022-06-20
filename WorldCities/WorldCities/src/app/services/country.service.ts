import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from './base.service';
import { Observable } from 'rxjs';
import { ICountry } from '../components/countries/country';
@Injectable({
  providedIn: 'root',
})
export class CountryService extends BaseService<ICountry> {
  constructor(http: HttpClient) {
    super(http);
  }
  getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<ICountry>> {
    var url = this.getUrl('api/Countries');
    var params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder);
    if (filterColumn && filterQuery) {
      params = params
        .set('filterColumn', filterColumn)
        .set('filterQuery', filterQuery);
    }
    return this.http.get<ApiResult<ICountry>>(url, { params });
  }
  get(id: number): Observable<ICountry> {
    var url = this.getUrl('api/Countries/' + id);
    return this.http.get<ICountry>(url);
  }
  put(item: ICountry): Observable<ICountry> {
    var url = this.getUrl('api/Countries/' + item.id);
    return this.http.put<ICountry>(url, item);
  }
  post(item: ICountry): Observable<ICountry> {
    var url = this.getUrl('api/Countries');
    return this.http.post<ICountry>(url, item);
  }
  isDupeField(
    countryId: number,
    fieldName: string,
    fieldValue: string
  ): Observable<boolean> {
    var params = new HttpParams()
      .set('countryId', countryId)
      .set('fieldName', fieldName)
      .set('fieldValue', fieldValue);
    var url = this.getUrl('api/Countries/IsDupeField');
    return this.http.post<boolean>(url, null, { params });
  }
}
