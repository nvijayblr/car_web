import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHazardComponent } from './view-hazard.component';

describe('ViewHazardComponent', () => {
  let component: ViewHazardComponent;
  let fixture: ComponentFixture<ViewHazardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHazardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
