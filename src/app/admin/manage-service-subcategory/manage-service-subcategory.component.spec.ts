import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageServiceSubcategoryComponent } from './manage-service-subcategory.component';

describe('ManageServiceSubcategoryComponent', () => {
  let component: ManageServiceSubcategoryComponent;
  let fixture: ComponentFixture<ManageServiceSubcategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageServiceSubcategoryComponent]
    });
    fixture = TestBed.createComponent(ManageServiceSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
