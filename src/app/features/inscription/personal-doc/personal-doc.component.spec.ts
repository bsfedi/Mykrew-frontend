import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDocComponent } from './personal-doc.component';

describe('PersonalDocComponent', () => {
  let component: PersonalDocComponent;
  let fixture: ComponentFixture<PersonalDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
