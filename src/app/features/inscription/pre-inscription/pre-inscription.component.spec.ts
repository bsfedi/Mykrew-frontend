import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreInscriptionComponent } from './pre-inscription.component';

describe('PreInscriptionComponent', () => {
  let component: PreInscriptionComponent;
  let fixture: ComponentFixture<PreInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreInscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
