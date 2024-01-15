import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TjmrequestsComponent } from './tjmrequests.component';

describe('TjmrequestsComponent', () => {
  let component: TjmrequestsComponent;
  let fixture: ComponentFixture<TjmrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TjmrequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TjmrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
