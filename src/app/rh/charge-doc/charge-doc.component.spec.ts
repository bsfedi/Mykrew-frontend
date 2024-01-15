import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeDocComponent } from './charge-doc.component';

describe('ChargeDocComponent', () => {
  let component: ChargeDocComponent;
  let fixture: ComponentFixture<ChargeDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
