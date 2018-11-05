import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Project } from '../models/project';
import { CommentPeriod } from '../models/commentperiod';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Api } from './api';

@Injectable()
export class ProjectService {
  pcp: CommentPeriod;
  comment: Object;
  constructor(private api: Api) {}

  getAll(): Observable<Array<Project>> {
    return this.api.getAllProjects().map((res: Response) => res.json());
  }

  getByCode(code: string): Observable<Project> {
    // this.getByCodePcp(code);
    alert("fvfj");
    return this.api.getProjectByCode(code).map((res: Response) => res.json());
    // return this.api.getProjectByCode(code).map((res: Response) => {
      // alert(res);
      // return null;
    // });
  }

  getByCodePcp(code: string): Observable<Project> {
    alert('this function');
    console.log(code);
    return this.api.getProjectByCode(code).map((res: Response) => res.json())
      .map((pcp: any) => {
        alert(Object.keys(pcp));
        return null;
      });
      // alert(res);
      // alert('innnn');

      // return null;
      // this.pcp.project = new Project(res.json());
      // alert(Object.keys(this.pcp));
      // return this.pcp;
    }
    // alert('inside');
    // alert(this.api.getPCPByCode(id));
    /*return this.api.getPCPByCode(id)
      .map((res: Response) => res.json())
      .map((pcp: any) => {
        if (!pcp) {
          alert("ERRR");
          throw new Error('PCP not found');
        }
        this.pcp = new CommentPeriod(pcp);
        alert('yo');
      });*/
     // Grab the project data first
    // alert(id);
    // alert(code);
   // return this.api.getPCPByCode(id)
     // .map((res: Response) => {
      //  alert(res);
        // if (!pcp) {
          // throw new Error('PCP not found');
       // }
        // this.pcp = new CommentPeriod(pcp);
       // alert('in the middle of this');
       // this.pcp.relatedDocuments.forEach((document, index ) => {
         // document = new Document(document);
         // this.processDocuments(this.pcp.relatedDocuments, document, index);
        // });
        // this.setStatus(new Date(this.pcp.dateStarted), new Date(this.pcp.dateCompleted));
       // return this.pcp;
     // });
      // get what project the public comment period is associated with
      // .switchMap(() => this.getProjectByCode(code))
      // .map(() => this.pcp);


  private getProjectByCode(code) {
    return this.api.getProjectByCode(code)
      .map((res: Response) => {
        this.pcp.project = new Project(res.json());
        alert(Object.keys(this.pcp));
        return this.pcp;
      });
  }
}
