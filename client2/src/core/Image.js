import React from 'react';
import { API } from '../config';

const ShowImage = ({ item, url }) => (

    <div className="product-img">
        <img src={`${API}/${url}/photo/${item._id}`} alt={item.name} className="card-img mb-2"
            style={{ maxHeight: '90%', maxWidth: '100%' }} />
    </div>
)
export default ShowImage;