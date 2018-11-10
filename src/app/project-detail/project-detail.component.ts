import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/mergeMap';
import { News } from '../models/news';
import { Project } from '../models/project';
import { CommentPeriod } from '../models/commentperiod';
import { Proponent } from '../models/proponent';
import { NewsHeadlineFilterPipe } from '../pipes/news-headline-filter.pipe';
import { NewsTypeFilterPipe } from '../pipes/news-type-filter.pipe';
import { Api } from '../services/api';
import { NewsService } from '../services/news.service';
import { ProjectService } from '../services/project.service';
import { CommentPeriodService } from '../services/comment-period.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project: Project;
  news: News[];
  pcps: CommentPeriod[];
  commentPeriod: CommentPeriod;
  public loading: boolean;
  public isDesc: boolean;
  public column: string;
  public direction: number;
  public showFilters: boolean;
  public projectFilter: boolean;
  public filter = '';
  public NewsTypeFilter = '';
  public filterType = '';
  public filteredResults: number;

  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 25,
    currentPage: 1
  };

  private subscription: Subscription;
  NewsTypeFilterPipe: NewsTypeFilterPipe;
  NewsHeadlineFilterPipe: NewsHeadlineFilterPipe;

  constructor(
    private api: Api,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private newsService: NewsService,
    private commentPeriodService: CommentPeriodService
  ) {
    this.NewsTypeFilterPipe = new NewsTypeFilterPipe();
    this.NewsHeadlineFilterPipe = new NewsHeadlineFilterPipe();
  }

  ngOnInit() {
    this.loading = true;
    const projectCode = this.route.snapshot.params.code;
    const projectID = Object.keys(this.route.snapshot.params);
    alert(projectCode);
    alert(projectID);
    this.loading = true;

    // get project data
    this.projectService
      .getByCode(projectCode)
      .mergeMap((project: Project) => {
        this.project = new Project(project);
       alert(Object.keys(this.project));
       alert(this.project._id);
        if (!this.project.proponent) {
          this.project.proponent = new Proponent({ name: '' });
        }
        this.column = 'dateAdded';
        this.direction = -1;
        // get news for the project
        return this.newsService.getByProjectCode(projectCode);
      })
      .subscribe(data => {
        alert('any');
        this.news = data;
        this.setDocumentUrl(this.news);
        this.filteredResults = this.news.length;
        this.loading = false;
        // alert('in');
      });
      alert('before');

      this.projectService
      .getByCode(projectCode)
      .mergeMap((project: Project) => {
        this.project = new Project(project);
        // get news for the project
        alert('in');
        alert(this.project._id);
        return this.commentPeriodService.getByProjectCode(this.project._id);
      })
      .subscribe(data => {
        alert(' in in');
        data
        .map((res: Response) => res.json())
        .map((pcps: any) => {
          alert('ppp');
          alert(pcps);
        });
        // this.pcps = data;
        // this.pcps.forEach(item => {
        //  alert(item);
        // });
        //this.setDocumentUrl(this.news);
        //cthis.filteredResults = this.news.length;
        //c this.loading = false;
        // alert('in');
      });


    // get pcpBanner data
    /*this.newsService.getByProjectCode(projectCode)
      .mergeMap((news: News[]) => {
        const allPCP = [];
        //const projectCode = this.route.snapshot.params.code;
        news.forEach(item => {
          if (item.contentUrl) {
            const contentID = item.contentUrl.split('/');
            //this.getPCPSimple(contentID[4], code).map(() => this.pcp);
            //alert(this.pcp);
            //alert(Object.keys(this.commentPeriodService.getByCode(contentID[4], code)));

              //data.comments = this.filterRejectedDocuments(data.comments);
              // this.loading = false;
            //allPCP.push(this.commentPeriodService.getByCode(contentID[4], projectCode));
            const contentIDOrdinal = 4;
            this.commentPeriodService.getByCode(contentID[contentIDOrdinal], projectCode).mergeMap(
              (commentPeriod: CommentPeriod ) => {
                this.commentPeriod = commentPeriod;
                this.column = 'dateAdded';
                this.direction = -1;
                alert('insidaaa');
                // get comments and documents for comment period
                return this.commentPeriodService.getCommentsAndDocuments(this.commentPeriod);
              }
            ).subscribe(data => {
               alert(data.dateStarted);
            });
            alert('push');
            // allPCP.push(this.getByCode(contentID[4], code));
          }
        });
        allPCP.push(2);
        allPCP.push(3);
        return allPCP;
        // return this.commentPeriodService.getByCode(id, projectCode);
      })
      .subscribe(data => {
        // currently gets an array back
        // const pcps = [];
        // alert(Object.keys(data[0]));
        // this.commentPeriodService.get
        // data.map((x: number) => alert(x));
        alert(data);



        alert('inside subscribe of top level');
      });*/
  }

  setBanner(pcp) {
    // pcps.forEach(item => {
      alert(pcp.dateStarted);
      if (pcp.status === 'Pending' || pcp.status === 'Open') {
        alert('there should be a banner');
      }
    // });
  }

  setDocumentUrl(news) {
    const regex = /http(s)?:\/\/(www.)?/;
    news.forEach(activity => {
      alert(activity.headline);
      if (!activity.documentUrl) {
        activity.documentUrl = '';
      } else if (!regex.test(activity.documentUrl)) {
        activity.documentUrl = `${this.api.hostnameEPIC}${activity.documentUrl}`;
      }
    });
  }

  public getDocumentManagerUrl() {
    return `${this.api.hostnameEPIC}/p/${this.project.code}/docs`;
  }

  sort(property) {
    this.isDesc = !this.isDesc;
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

  clearAllNewsFilters() {
    this.filter = undefined;
    this.NewsTypeFilter = undefined;
    this.filterType = undefined;
    this.config.currentPage = 1;
  }

  gotoMap(): void {
    // pass along the id of the current project if available
    // so that the map component can show the popup for it.
    const projectId = this.project ? this.project.code : null;
    this.router.navigate(['/map', { project: projectId }]);
  }

  readmore(item): void {
    item.readmore = !item.readmore;
  }

  getDisplayedElementCountMessage(pageNumber) {
    // TODO: fix counting of non-visible items
    let message = '';
    let items = this.news;
    if (this.filter) {
      items = this.NewsHeadlineFilterPipe.transform(items, this.filter);
    }
    if (this.filterType) {
      items = this.NewsTypeFilterPipe.transform(items, this.filterType);
    }
    if (items.length > 0) {
      const startRange = (pageNumber - 1) * this.config.itemsPerPage + (items.length === 0 ? 0 : 1);
      const endRange = Math.min((pageNumber - 1) * this.config.itemsPerPage + this.config.itemsPerPage, items.length);
      message = `Viewing <strong>${startRange}-${endRange}</strong> of <strong>${items.length}</strong> Results`;
    }
    this.filteredResults = items.length;
    return message;
  }

  /*setStatus(start, end) {
    const curr = new Date();
    const weekAgo = new Date(start.getDate() - 7);
    // a public comment period is in a pending state when the date is a week before it opens
    if ( curr < start && curr >= weekAgo ) {
      this.pcp.status = 'Pending';
    } else if ( curr > end ) {
      this.pcp.status = 'Closed';
    } else {
      this.pcp.status = 'Open';
    }
  }*/
}
