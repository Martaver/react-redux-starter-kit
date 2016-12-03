/**
 * Created by sebas_000 on 27/11/2016.
 */
import io from 'socket.io-client'

import {receiveTick, receiveCompany, receiveProduct, receiveCompanyTone} from './socketActions'

export default function(store){
    let theStore = store
    var client = io()

    client.on('tick', function(tick){
      console.log('got tick');
      theStore.dispatch(receiveTick(tick));
    })

    client.on('company', function(company){
        // console.log('Got company:', company)
        theStore.dispatch(receiveCompany(company))
    })

    client.on('product', function(product){
        // console.log('Got product:', product)
        theStore.dispatch(receiveProduct(product))
    })

    client.on('company-tone', function(tone){
        // console.log('Got company tone:', tone)
        theStore.dispatch(receiveCompanyTone(tone))
    })
}
