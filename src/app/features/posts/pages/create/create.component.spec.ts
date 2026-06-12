
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateComponent } from './create.component';
import { PostService } from '../../services/post.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalLoadingService } from '../../../../core/services/global-loading.service';
import { CreatePostDto } from '../../models/post.dto';
import { PostFormStubComponent } from 'src/app/tests/helpers/stubs/post-form.stub';
import { PostFormComponent } from '../../components/post-form/post-form.component';


describe('CreateComponent (container)', () => {
  // Test variables
  let fixture: ComponentFixture<CreateComponent>;
  let component: CreateComponent;

  let postServiceSpy: jasmine.SpyObj<PostService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  // TestBed setup runs before each test
  beforeEach(async () => {
    postServiceSpy = jasmine.createSpyObj<PostService>('PostService', ['create']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    toastSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);

    await TestBed.configureTestingModule({
      // ⚠️ Only import the container
      imports: [CreateComponent],
      providers: [
        provideRouter([]),
        // These are the mocks
        { provide: PostService, useValue: postServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastSpy},
        { provide: GlobalLoadingService, useValue: { isLoading: () => false } },
      ]
    })
      // ✅ Replace CreateComponent's real import with the stub
      .overrideComponent(CreateComponent, {
        remove: { imports: [PostFormComponent] },
        add: { imports: [PostFormStubComponent]},
      })
      .compileComponents();

    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
  });
    afterEach(() => {
    toastSpy.showSuccess.calls.reset();
    toastSpy.showError.calls.reset();
  });

 /*
    Success path
    Test that verify normal user behaviour works
  */

  it('calls PostService.create(dto) when stub emits submitForm (success path)', () => {
     // Act run the lifecycle hook
    fixture.detectChanges();

    // Set up the form controls and add values
    component.form.controls['patientId'].setValue('P-00001');
    component.form.controls['patientName'].setValue('Patient 1');
    component.form.controls['messageType'].setValue('ADT^A01');
    component.form.controls['status'].setValue('Processed');
    component.form.controls['lastUpdated'].setValue('2026-06-11T15:03:40.033Z');

    // Inject the post service variables
    postServiceSpy.create.and.returnValue(of({ id: 1, patientId: 'P-00001', patientName: 'Patient 1', messageType: 'ADT^A01', status: 'Processed', lastUpdated: '2026-06-11T15:03:40.033Z' } as any));

    // emit submit from stub (simulates clicking submit in presentational component)
    const stubDe = fixture.debugElement.query(By.directive(PostFormStubComponent));
    const stub = stubDe!.componentInstance as PostFormStubComponent;
    stub.submitForm.emit();

    fixture.detectChanges();
    // Assert that the payload has been passed to the post service
    const expectedPayload: CreatePostDto = {
      patientId: 'P-00001',
      patientName: 'Patient 1',
      messageType: 'ADT^A01',
      status: 'Processed',
      lastUpdated: '2026-06-11T15:03:40.033Z'
    };

    expect(postServiceSpy.create).toHaveBeenCalledWith(expectedPayload);
    expect(toastSpy.showSuccess).toHaveBeenCalledWith('Record created successfully');
    expect(toastSpy.showError).not.toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/post/index');
  });

   /*
    Error path
    Tests that verify error handling behaviour
  */
  it('sets serverErrorMessage for 422/400 (local handling)', () => {
     // Act run the lifecycle hook
    fixture.detectChanges();

    // Set up the form controls and add values
    component.form.controls['patientId'].setValue('P-00001');
    component.form.controls['patientName'].setValue('Patient 1');
    component.form.controls['messageType'].setValue('ADT^A01');
    component.form.controls['status'].setValue('Processed');
    component.form.controls['lastUpdated'].setValue('2026-06-11T15:03:40.033Z');

    // Inject a post service error that fails validation
    postServiceSpy.create.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 422, error: { message: 'Please check the form. Some fields are invalid' } }))
    );

    // Submit
    component.submit();

    // Assert that the server returns validation failure message
    expect(component.serverErrorMessage()).toContain('Please check the form. Some fields are invalid');
    expect(component.form.errors?.['serverError']).toBeTrue();
    expect(toastSpy.showSuccess).not.toHaveBeenCalled();

  });

  /*
    Render / UI state
    Tests that verify the component renders correctly
    without user interaction
  */

   it('renders the post-form stub and passes expected inputs', () => {
    // Act run the lifecycle hook
    fixture.detectChanges();
    // Assert that the page is not null
    const stubDe = fixture.debugElement.query(By.directive(PostFormStubComponent));
    expect(stubDe).withContext(fixture.nativeElement.innerHTML).not.toBeNull();

    // Assert that the input create post has been passed to the stub
    const stub = stubDe!.componentInstance as PostFormStubComponent;

    expect(stub.submitLabel).toBe('Create Record');

    expect(stub.requireDirty).toBeFalse();
    expect(stub.form).toBeTruthy();

    expect(toastSpy.showSuccess).not.toHaveBeenCalled();
  });
});
