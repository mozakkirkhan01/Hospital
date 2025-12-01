import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageServicechargeComponent } from './manage-servicecharge.component';

describe('ManageServicechargeComponent', () => {
  let component: ManageServicechargeComponent;
  let fixture: ComponentFixture<ManageServicechargeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageServicechargeComponent]
    });
    fixture = TestBed.createComponent(ManageServicechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
