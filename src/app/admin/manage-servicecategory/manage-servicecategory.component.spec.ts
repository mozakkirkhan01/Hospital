import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageServicecategoryComponent } from './manage-servicecategory.component';

describe('ManageServicecategoryComponent', () => {
  let component: ManageServicecategoryComponent;
  let fixture: ComponentFixture<ManageServicecategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageServicecategoryComponent]
    });
    fixture = TestBed.createComponent(ManageServicecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
