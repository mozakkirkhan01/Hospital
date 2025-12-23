import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOpdListComponent } from './manage-opd-list.component';

describe('ManageOpdListComponent', () => {
  let component: ManageOpdListComponent;
  let fixture: ComponentFixture<ManageOpdListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageOpdListComponent]
    });
    fixture = TestBed.createComponent(ManageOpdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
