import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, of, map } from 'rxjs';
import { PostService } from '../services/post.service';
import { Post } from '../models/post';

export const postResolver: ResolveFn<Post | null> = (route: ActivatedRouteSnapshot) => {
  /*
  Decision points: Invalid Id, Valid id + service success & invalid id + service error
  */
  const postService = inject(PostService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('postId'));

  // If id is invalid, return null (so UI can show "no post found" / error state)
  if (Number.isNaN(id) || id <= 0) {
    router.navigateByUrl('/post/index');
    return of(null);
  }

  return postService.find(id).pipe(
    // IMPORTANT: swallow the error so navigation still completes
    // (otherwise Angular cancels navigation and your component never loads)

    map((post): Post =>({
      id: post.id,
      patientId: `P-${String(post.id).padStart(5, '0')}`,
      patientName: post.patientName ?? `Patient ${post.id}`,
      messageType: post.id % 3 === 0 ? 'ADT^A01' : post.id %3 === 1 ? 'ORU^R01' : 'ADT^A03',
      status: post.id % 5 === 0 ? 'Failed' : post.id % 2 === 0 ? 'Pending' : 'Processed',
      lastUpdated: new Date().toISOString()
    })),
    catchError(() => {
      // interceptor already toasts
      return of(null);
    })
  );

};
