import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICity } from '../components/cities/city';
import { ICountry } from '../components/countries/country';
import { ApiResult, BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class CityService extends BaseService<ICity> {
  constructor(http: HttpClient) {
    super(http);
  }

  getData(
    pageIndex: number,
    pageSize: number,
    sotColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<ICity>> {
    var url = this.getUrl('api/Cities');
    var params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('sortColumn', sotColumn)
      .set('sortOrder', sortOrder);

    if (filterColumn && filterQuery) {
      params = params
        .set('filterColumn', filterColumn)
        .set('filterQuery', filterQuery);
    }

    return this.http.get<ApiResult<ICity>>(url, { params });
  }

  get(id: number): Observable<ICity> {
    var url = this.getUrl('api/Cities/' + id);
    return this.http.get<ICity>(url);
  }

  put(item: ICity): Observable<ICity> {
    var url = this.getUrl('api/Cities/' + item.id);
    return this.http.put<ICity>(url, item);
  }

  post(item: ICity): Observable<ICity> {
    var url = this.getUrl('api/Cities');
    return this.http.post<ICity>(url, item);
  }

  getCountries(
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
  isDupeCity(item: ICity): Observable<boolean> {
    var url = this.getUrl('api/Cities/isDupeCity');
    return this.http.post<boolean>(url, item);
  }
}
