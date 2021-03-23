import { observable, action, makeObservable } from 'mobx';

export default class Payments {
    stripeFields = KaliFormsObject.stripeFields;
    stripePKey = KaliFormsObject.stripePKey;
    stripeSKey = KaliFormsObject.stripeSKey;
    stripePKeyLive = KaliFormsObject.stripePKeyLive;
    stripeSKeyLive = KaliFormsObject.stripeSKeyLive;
    stripePaymentRequestButton = KaliFormsObject.stripePaymentRequestButton;
    stripeCountry = KaliFormsObject.stripeCountry;

    constructor() {
        makeObservable(this, {
            stripeFields: observable,
            stripePKey: observable,
            stripeSKey: observable,
            stripePKeyLive: observable,
            stripeSKeyLive: observable,
            stripePaymentRequestButton: observable,
            stripeCountry: observable
        });
    }
}
