import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapaHomeComponent } from './capa-home.component';

describe('CapaHomeComponent', () => {
  let component: CapaHomeComponent;
  let fixture: ComponentFixture<CapaHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapaHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
