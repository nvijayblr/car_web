import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapaSearchComponent } from './capa-search.component';

describe('CapaSearchComponent', () => {
  let component: CapaSearchComponent;
  let fixture: ComponentFixture<CapaSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapaSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
