import React ,{ useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
// import { Link} from 'react-router-dom';
import { map ,size , sortBy , reverse } from 'lodash'
import { Promotions } from '../../service';
import moment from 'moment'

import { Wrap } from '../view/profile/';
import { withAuth } from "../util/";

import '../assets/scss/News.scss';


const News = () => {
    const [ load ,setLoad ] = useState(15)
    const [ list ,setList ] = useState(null)
    const [ key ,setKey ] = useState(null)
	const history = useHistory();

    useEffect( () =>{
		const q = Promotions.getAnnouncements({ num: load  });

        q.promise.then(r => {
            const sortDate = sortBy(r.info, (obj )=>{
                return obj.edit_time
            })

            setList(reverse(sortDate))

		}, e => {
			if (!e.is_aborted) {
				console.warn(e);
			}
		});

        return () => q.cancel();
        
    },[load])


    const onOpen = (i) =>{
        setKey(i)
        if(key === i){
            setKey(null)
        }
    }

     
	return (
		<Wrap
			className="news-wrap"
			centerName="最新公告"
			faq={false}
			sublevel={[ true, () => history.goBack() ]}>
			<div className="news-wrap-inner">
				{list && map(list , (obj , i) =>{
                    return  <div key={i} className="news-wrap-item">
                                <div className={`news-wrap-content ${key === i ? 'drop' : ''}`}>
                                    <div className="news-wrap-time">{obj.edit_time}</div>
                                    <div className="news-wrap-text">{obj.content}</div>
                                    <div className="news-wrap-arrow" onClick={() => onOpen(i)}/>
                                </div>
                            </div>
                })}
                {size(list) >= load &&  <div className="news-load more" onClick={() => setLoad(load + 15)}>load more</div> }
 
			</div>
		</Wrap>
	);

}

export default withAuth(News,1 );

