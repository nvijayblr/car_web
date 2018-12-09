import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatenewclaimComponent } from './createnewclaim.component';

describe('CreatenewclaimComponent', () => {
  let component: CreatenewclaimComponent;
  let fixture: ComponentFixture<CreatenewclaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatenewclaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatenewclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
