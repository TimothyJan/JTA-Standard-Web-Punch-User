import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchButtonComponent } from './punch-button.component';

describe('PunchButtonComponent', () => {
  let component: PunchButtonComponent;
  let fixture: ComponentFixture<PunchButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PunchButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PunchButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
