import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarydetailsComponent } from './beneficiarydetails.component';

describe('BeneficiarydetailsComponent', () => {
  let component: BeneficiarydetailsComponent;
  let fixture: ComponentFixture<BeneficiarydetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiarydetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiarydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
