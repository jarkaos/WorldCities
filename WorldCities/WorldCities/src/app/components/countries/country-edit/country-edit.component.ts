import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BaseFormComponent } from 'src/app/base-form.component';
import { environment } from 'src/environments/environment';
import { ICountry } from '../country';
import { CountryService } from '../../../services/country.service';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.css'],
})
export class CountryEditComponent extends BaseFormComponent implements OnInit {
  title?: string;
  country?: ICountry;
  id?: number;
  countries?: ICountry[];

  constructor(
    private fb: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private countryService: CountryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required, this.isDoupeField('name')],
      iso2: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]{2}$/)],
        this.isDoupeField('iso2'),
      ],
      iso3: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]{2}$/)],
        this.isDoupeField('iso3'),
      ],
    });

    this.loadData();
  }

  isDoupeField(fieldName: string): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this.countryService
        .isDupeField(this.id ?? 0, fieldName, control.value)
        .pipe(
          map((result) => {
            return result ? { isDupeField: true } : null;
          })
        );
    };
  }

  loadData() {
    var idParam = this.activatedRouter.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id) {
      this.countryService.get(this.id).subscribe(
        (result) => {
          this.country = result;
          this.title = 'Edit - ' + this.country.name;
          this.form.patchValue(this.country);
        },
        (error) => console.error(error)
      );
    } else {
      this.title = 'Create new country';
    }
  }

  onSubmit() {
    var country = this.id ? this.country : <ICountry>{};
    if (country) {
      country.name = this.form.controls['name'].value;
      country.iso2 = this.form.controls['iso2'].value;
      country.iso3 = this.form.controls['iso3'].value;

      if (this.id) {
        this.countryService.put(country).subscribe(
          (result) => {
            console.log('Country ' + country!.id + ' has been updated');

            this.router.navigate(['/countries']);
          },
          (error) => console.error(error)
        );
      }
    } else {
      this.countryService.post(country!).subscribe(
        (result) => {
          console.log('Country ' + result.id + ' has been created');

          this.router.navigate(['/countries']);
        },
        (error) => console.error(error)
      );
    }
  }
}
