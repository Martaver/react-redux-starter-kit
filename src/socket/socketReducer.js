import Immutable from 'immutable'
import update from 'react-addons-update'
import { RECEIVE_COMPANIES, RECEIVE_PRODUCTS, RECEIVE_TONES } from './socketActions'

const initialState = {
    companies: []
}

export default function socketReducer(state=initialState, action) {
    switch(action.type) {
        case 'RECEIVE_COMPANY':
            let payload = {
                ...action.payload.company,
                products: [],
                emotions: []
            }
            return update(state, {
                companies: {$push: [payload]}
            })
        case 'RECEIVE_PRODUCT':
            let idx = action.payload.product.companyId
            state.companies[idx] = update(state.companies[idx], {
                products: {$push: [action.payload.product]}
            })
            return state
        case 'RECEIVE_COMPANY_TONE':
            idx = action.payload.tone.companyId
            state.companies[idx] = update(state.companies[idx], {
                emotions: {$push: [action.payload.tone]}
            })
            return state
        default:
            return state
    }
}
