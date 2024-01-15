import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPreinscriptionComponent } from './pending-preinscription.component';

describe('PendingPreinscriptionComponent', () => {
  let component: PendingPreinscriptionComponent;
  let fixture: ComponentFixture<PendingPreinscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingPreinscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingPreinscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
