import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { GlobalLoadingService } from '../../../../core/services/global-loading.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { PostListTableComponent } from '../../components/post-list-table/post-list-table.component';

@Component({
    selector: 'app-index',
    imports: [CommonModule, RouterModule, PostListTableComponent],
    templateUrl: './index.component.html',
    styleUrl: './index.component.css'
})
export class IndexComponent {
  // ✅ template calls postList() and hasError()
  postList = signal<Post[]>([]);
  hasError = signal(false);
  searchTerm = signal('');
  totalPosts = computed(() => this.postList().length);
  totalRecords = computed(() => this.postList().length);
  processedCount = computed(() => this.postList().filter(record => record.status === 'Processed').length);
  pendingCount = computed(() => this.postList().filter(record => record.status === 'Pending').length);
  failedCount = computed(() => this.postList().filter(record => record.status === 'Failed').length);
  statusFilter = signal<'All' | 'Processed' | 'Pending' | 'Failed'>('All');
  sortDirection = signal<'desc' | 'asc'>('desc');
  messageTypeFilter = signal<'All' | 'ADT^A01' | 'ORU^R01' | 'ADT^A03'>('All');
  public loadingService = inject(GlobalLoadingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
  this.hasError.set(false);

  this.route.data.subscribe((data) => {
    const posts = data['postList'] as Post[] | null | undefined;

    // error state (resolver returned null/undefined)
    if (!Array.isArray(posts)) {
      this.postList.set([]);
      this.hasError.set(true);
      return;
    }

    // success state

    const patientRecords: Post[] = posts.map((post, index) => ({
        id: post.id,
        patientId: `P-${String(post.id).padStart(5, '0')}`,
        patientName: post.patientName ?? `Patient ${index + 1}`,
        messageType: index % 3 === 0 ? 'ADT^A01' : index % 3 === 1 ? 'ORU^R01' : 'ADT^A03',
        status: index % 5 === 0 ? 'Failed' : index % 2 === 0 ? 'Pending' : 'Processed',
        lastUpdated: new Date().toISOString()
      }));

      this.postList.set(patientRecords);
      this.hasError.set(false);
    });
  }

  // ✅ Use this for retry if you want resolver to re-run
  retry(): void {
    this.router.navigateByUrl(this.router.url);
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('All');
    this.sortDirection.set('desc');
    this.messageTypeFilter.set('All');
  }

  deletePost(id: number): void {
    this.postService.delete(id).subscribe({
      next: () => {
        this.postList.update(curr => curr.filter(p => p.id !== id));
        this.toast.showSuccess('Record deleted');
      }
    });
  }

  filteredAndSortedPosts = computed(() => {
        const records = this.postList().filter(post => {

          const matchesSearch =
            post.patientName.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
            post.patientId.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
            post.messageType.toLowerCase().includes(this.searchTerm().toLowerCase());

          const matchesStatus =
            this.statusFilter() === 'All' ||
            post.status === this.statusFilter();

          const matchesMessageType =
            this.messageTypeFilter() === 'All' ||
            post.messageType === this.messageTypeFilter();


          return matchesSearch && matchesStatus && matchesMessageType;
        });

        return [...records].sort((a, b) => {
          const aDate = new Date(a.lastUpdated).getTime();
          const bDate = new Date(b.lastUpdated).getTime();

          return this.sortDirection() === 'desc'
            ? bDate - aDate
            : aDate - bDate;
        });
  });

  failureRate = computed(() => {
    const total = this.postList().length;
    if(total === 0) return 0;

    return Math.round((this.failedCount() / total) * 100);
  });





  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  adtA01Count = computed(() => this.postList().filter(record => record.messageType === 'ADT^A01').length);
  oruR01Count = computed(() => this.postList().filter(record => record.messageType === 'ORU^R01').length);
  adtA03Count = computed(() => this.postList().filter(record => record.messageType === 'ADT^A03').length);

  criticalFailureCount = computed(() => this.postList().filter(record =>
    record.status === 'Failed' && record.messageType === 'ORU^R01').length);

}


