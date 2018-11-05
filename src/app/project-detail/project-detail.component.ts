import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/mergeMap';
import { News } from '../models/news';
import { Project } from '../models/project';
import { Proponent } from '../models/proponent';
import { NewsHeadlineFilterPipe } from '../pipes/news-headline-filter.pipe';
import { NewsTypeFilterPipe } from '../pipes/news-type-filter.pipe';
import { Api } from '../services/api';
import { NewsService } from '../services/news.service';
import { ProjectService } from '../services/project.service';
import { CommentPeriodService } from '../services/comment-period.service';
import { CommentPeriod } from '../models/commentperiod';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project: Project;
  news: News[];
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
    this.loading = true;

    // const id = this.route.snapshot.params.id;
    // alert(id);
    // this.commentPeriodService.test();
    // get project data
    this.projectService
      .getByCode(projectCode)
      // .getByCodePcp(projectCode)
      .mergeMap((project: Project) => {
        this.project = new Project(project);
        if (!this.project.proponent) {
          this.project.proponent = new Proponent({ name: '' });
        }
        this.column = 'dateAdded';
        this.direction = -1;
        // get news for the project
        // alert(Object.keys(this.project));
        // alert(this.project.openCommentPeriod);
        // alert(Object.keys(this.newsService.getByProjectCode(projectCode)));
        return this.newsService.getByProjectCode(projectCode);
      })
      .subscribe(data => {
        this.news = data;
        this.setDocumentUrl(this.news);
        // alert('hey');
        this.filteredResults = this.news.length;
        this.loading = false;
      });


  }

  setDocumentUrl(news) {
    const regex = /http(s)?:\/\/(www.)?/;
    const code = this.route.snapshot.params.code;
    alert(code);
    news.forEach(activity => {
      if (!activity.documentUrl) {
        activity.documentUrl = '';
         alert(Object.keys(activity));
         alert(activity.headline);
         //const s = this.router.parseUrl(activity.contentUrl).root.children['primary'].segments;
         //const s = this.router.parseUrl(activity.contentUrl).root.children['primary'].segments;
         const c = activity.contentUrl.split('/');
         alert(c[4]);
         //alert(s[0].params.code);
         //alert(activity.id);
        // this.pcpPopup(activity.id);
        //this.commentPeriodService.test();
        //this.projectService.getByCode(code);
        this.projectService
      .getByCode(code)
      // .getByCodePcp(projectCode)
      .mergeMap((project: Project) => {
        alert("INDSF");
        return null;
        //this.project = new Project(project);
        //if (!this.project.proponent) {
         // this.project.proponent = new Proponent({ name: '' });
        //}
       // this.column = 'dateAdded';
       // this.direction = -1;
        // get news for the project
        // alert(Object.keys(this.project));
        // alert(this.project.openCommentPeriod);
        // alert(Object.keys(this.newsService.getByProjectCode(projectCode)));
        //return this.newsService.getByProjectCode(projectCode);
      })
        /*this.commentPeriodService.getByCode(c[4], code).mergeMap(
          (commentPeriod: CommentPeriod) => {
            alert("dfgdfjkgndfgjkdfjg");
            this.commentPeriod = commentPeriod;
            alert(this.commentPeriod);
            return this.commentPeriodService.getCommentsAndDocuments(this.commentPeriod);
          }
        );*/
      } else if (!regex.test(activity.documentUrl)) {
        // alert(Object.keys(activity));
         //alert(activity.id)
         //alert(activity.documentUrl);
        activity.documentUrl = `${this.api.hostnameEPIC}${activity.documentUrl}`;
        //alert(activity.documentUrl);
      }
    });
  }

  public getDocumentManagerUrl() {
    return `${this.api.hostnameEPIC}/p/${this.project.code}/docs`;
  }

  pcpPopup(id) {
    const projectCode = this.route.snapshot.params.code;
    // alert(this.getDocumentManagerUrl());
    // this.projectService.getByCodePcp(id, projectCode);
    // alert('this happens');

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
}
