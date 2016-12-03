import { RECEIVE_COMPANIES, RECEIVE_PRODUCTS, RECEIVE_TONES } from './socketActions'

const initialState = {
    companies: []
}

export default function socketReducer(state=initialState, action) {

    switch(action.type) {
        case 'RECEIVE_COMPANY':
           console.log('got company');
           return state;
        case 'RECEIVE_PRODUCT':
            console.log('got product');
            return state
        case 'RECEIVE_COMPANY_TONE':
            console.log('got company tone');
            return state
      case 'TICK':
            console.log('got tick');
            return state;
        default:
            return state
    }
}
