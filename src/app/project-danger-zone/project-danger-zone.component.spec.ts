import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDangerZoneComponent } from './project-danger-zone.component';

describe('ProjectDangerZoneComponent', () => {
  let component: ProjectDangerZoneComponent;
  let fixture: ComponentFixture<ProjectDangerZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDangerZoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectDangerZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
