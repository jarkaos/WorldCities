import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ICity } from '../city';
import { ICountry } from '../../countries/country';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss'],
})
export class CityEditComponent implements OnInit {
  // the view title
  title?: string;

  // the form model
  form!: FormGroup;

  // the object to edit
  city?: ICity;

  id?: number;

  countries?: ICountry[];

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        lat: new FormControl('', Validators.required),
        lon: new FormControl('', Validators.required),
        countryId: new FormControl('', Validators.required),
      },
      null,
      this.isDupeCity()
    );

    this.loadData();
  }
  isDupeCity(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      var city = <ICity>{};
      city.id = this.id ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.lat = this.form.controls['lat'].value;
      city.lon = this.form.controls['lon'].value;
      city.countryId = this.form.controls['countryId'].value;

      var url = environment.baseUrl + 'api/Cities/IsDupeCity';
      return this.http.post<boolean>(url, city).pipe(
        map((result) => {
          return result ? { isDupeCity: true } : null;
        })
      );
    };
  }

  loadData() {
    // load countries
    this.loadCountries();

    // retrieve ID from the id parameter
    var idParam = this.activatedRouter.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id) {
      // edit mode
      var url = environment.baseUrl + 'api/Cities/' + this.id;
      this.http.get<ICity>(url).subscribe(
        (result) => {
          this.city = result;
          this.title = 'Edit - ' + this.city.name;

          // update the form with the city name
          this.form.patchValue(this.city);
        },
        (error) => console.error(error)
      );
    } else {
      // add mode
      this.title = 'Create a new city';
    }
  }

  loadCountries() {
    var url = environment.baseUrl + 'api/Countries';
    var params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '9999')
      .set('sortColumn', 'name');

    this.http.get<any>(url, { params }).subscribe(
      (result) => {
        this.countries = result.data;
      },
      (error) => console.error(error)
    );
  }

  onSubmit() {
    var city = this.id ? this.city : <ICity>{};
    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = this.form.controls['lat'].value;
      city.lon = this.form.controls['lon'].value;
      city.countryId = this.form.controls['countryId'].value;

      if (this.id) {
        // edit mode
        var url = environment.baseUrl + 'api/Cities/' + city.id;
        this.http.put<ICity>(url, city).subscribe(
          (result) => {
            console.log('City ' + city?.id + ' has been updated.');

            // go back to cities view
            this.router.navigate(['/cities']);
          },
          (error) => console.error(error)
        );
      } else {
        // add mode
        var url = environment.baseUrl + 'api/Cities/';
        this.http.post<ICity>(url, city).subscribe(
          (result) => {
            console.log('City ' + result.id + ' has been created.');

            // go back to cities view
            this.router.navigate(['/cities']);
          },
          (error) => console.error(error)
        );
      }
    }
  }
}
