import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificaionRhComponent } from './notificaion-rh.component';

describe('NotificaionRhComponent', () => {
  let component: NotificaionRhComponent;
  let fixture: ComponentFixture<NotificaionRhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificaionRhComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificaionRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
