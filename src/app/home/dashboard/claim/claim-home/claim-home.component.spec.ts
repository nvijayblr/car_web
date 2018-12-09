import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimHomeComponent } from './claim-home.component';

describe('ClaimHomeComponent', () => {
  let component: ClaimHomeComponent;
  let fixture: ComponentFixture<ClaimHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
