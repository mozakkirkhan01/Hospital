import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOpdComponent } from './manage-opd.component';

describe('ManageOpdComponent', () => {
  let component: ManageOpdComponent;
  let fixture: ComponentFixture<ManageOpdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageOpdComponent]
    });
    fixture = TestBed.createComponent(ManageOpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
