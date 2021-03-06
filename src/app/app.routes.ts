import { Route } from '@angular/router';

import { AccountDashboardComponent } from './components/account-dashboard/account-dashboard.component';
import { CheckoutConfirmationComponent } from './components/checkout-confirmation/checkout-confirmation.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { CheckoutProcessComponent } from './components/checkout-process/checkout-process.component';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping.component';
import { CheckoutSignInComponent } from './components/checkout-sign-in/checkout-sign-in.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AccountGuard } from './providers/routing/account.guard';
import { CheckoutResolver } from './providers/routing/checkout-resolver';
import { CheckoutGuard } from './providers/routing/checkout.guard';
import { SignInGuard } from './providers/routing/sign-in.guard';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';

export const routes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'catalog',
    },
    {
        path: 'catalog',
        component: ProductListComponent,
        pathMatch: 'full',
    },
    {
        path: 'catalog/:id',
        component: ProductDetailComponent,
    },
    {
        path: 'sign-in',
        canActivate: [SignInGuard],
        component: SignInComponent,
    },
    {
        path: 'register',
        canActivate: [SignInGuard],
        component: RegisterComponent,
    },
    {
        path: 'verify',
        canActivate: [SignInGuard],
        component: VerifyComponent,
    },
    {
        path: 'account',
        canActivate: [AccountGuard],
        component: AccountDashboardComponent,
    },
    {
        path: 'checkout',
        component: CheckoutProcessComponent,
        resolve: {
            activeOrder: CheckoutResolver,
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: CheckoutSignInComponent,
                canActivate: [CheckoutGuard],
            },
            {
                path: 'shipping',
                component: CheckoutShippingComponent,
                canActivate: [CheckoutGuard],
            },
            {
                path: 'payment',
                component: CheckoutPaymentComponent,
                canActivate: [CheckoutGuard],
            },
            {
                path: 'confirmation/:code',
                component: CheckoutConfirmationComponent,
                canActivate: [CheckoutGuard],
            },
        ],
    },
];
