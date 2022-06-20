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
import { BaseFormComponent } from 'src/app/base-form.component';
import { CityService } from '../../../services/city.service';
import { ApiResult } from '../../../services/base.service';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss'],
})
export class CityEditComponent extends BaseFormComponent implements OnInit {
  // the view title
  title?: string;

  // the object to edit
  city?: ICity;

  id?: number;

  countries?: ICountry[];

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private cityService: CityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        lat: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/),
        ]),
        lon: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/),
        ]),
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

      return this.cityService.isDupeCity(city).pipe(
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
      this.cityService.get(this.id).subscribe(
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

    this.cityService.getCountries(0, 9999, 'name', 'asc', null, null).subscribe(
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
        this.cityService.put(city).subscribe(
          (result) => {
            console.log('City ' + city?.id + ' has been updated.');

            // go back to cities view
            this.router.navigate(['/cities']);
          },
          (error) => console.error(error)
        );
      } else {
        // add mode
        this.cityService.post(city).subscribe(
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
