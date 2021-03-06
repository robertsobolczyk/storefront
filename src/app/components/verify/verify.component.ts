import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Verify } from '../../../../codegen/generated-types';
import { DataService } from '../../providers/data.service';
import { StateService } from '../../providers/state.service';

import { VERIFY } from './verify.graphql';

@Component({
    selector: 'vsf-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyComponent {
    password = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private dataService: DataService,
                private stateService: StateService) { }

    verify() {
        const password = this.password;
        const token = this.route.snapshot.queryParamMap.get('token');

        if (password && token) {
            this.dataService.mutate<Verify.Mutation, Verify.Variables>(VERIFY, {
                password,
                token,
            }).subscribe(() => {
                this.stateService.setState('signedIn', true);
                this.router.navigate(['/account']);
            });
        }
    }
}
