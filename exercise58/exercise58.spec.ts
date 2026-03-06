import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exercise58 } from './exercise58';

describe('Exercise58', () => {
  let component: Exercise58;
  let fixture: ComponentFixture<Exercise58>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Exercise58]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exercise58);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
