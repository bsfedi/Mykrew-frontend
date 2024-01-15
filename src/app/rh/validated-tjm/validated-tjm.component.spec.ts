import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedTjmComponent } from './validated-tjm.component';

describe('ValidatedTjmComponent', () => {
  let component: ValidatedTjmComponent;
  let fixture: ComponentFixture<ValidatedTjmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatedTjmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatedTjmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
