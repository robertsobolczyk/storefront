import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap, switchMap, take } from 'rxjs/operators';

import { GetOrderByCode, Register } from '../../../../codegen/generated-types';
import { notNullOrUndefined } from '../../common/utils/not-null-or-undefined';
import { DataService } from '../../providers/data.service';
import { StateService } from '../../providers/state.service';
import { REGISTER } from '../register/register.graphql';

import { GET_ORDER_BY_CODE } from './checkout-confirmation.graphql';

@Component({
    selector: 'vsf-checkout-confirmation',
    templateUrl: './checkout-confirmation.component.html',
    styleUrls: ['./checkout-confirmation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutConfirmationComponent implements OnInit {
    registrationSent = false;
    order$: Observable<GetOrderByCode.OrderByCode>;

    constructor(private stateService: StateService,
                private dataService: DataService,
                private changeDetector: ChangeDetectorRef,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.order$ = this.route.paramMap.pipe(
            map(paramMap => paramMap.get('code')),
            filter(notNullOrUndefined),
            switchMap(code => this.dataService.query<GetOrderByCode.Query, GetOrderByCode.Variables>(
                GET_ORDER_BY_CODE,
                { code },
            )),
            map(data => data.orderByCode),
            filter(notNullOrUndefined),
        );
    }

    register() {
        this.order$.pipe(
            take(1),
            mergeMap(order => {
                const { customer } = order;
                if (customer) {
                    return this.dataService.mutate<Register.Mutation, Register.Variables>(REGISTER, {
                        input: {
                            emailAddress: customer.emailAddress,
                            firstName: customer.firstName,
                            lastName: customer.lastName,
                        },
                    });
                } else {
                    return of({});
                }
            }),
        ).subscribe(() => {
            this.registrationSent = true;
            this.changeDetector.markForCheck();
        });
    }
}
