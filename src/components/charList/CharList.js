import { useState, useEffect, useRef } from 'react';

import Spinner from '../spinner/Spinner';
import Error from '../error/error';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {

	const [charList, setCharList] = useState([]);

	const [newItem, setNewItem] = useState(false);
	const [offset, setOffset] = useState(212);
	const [charEnded, setCharEnded] = useState(false);
    
    const {loading, error, getAllCharacters} = useMarvelService();

	useEffect(() => {
		onRequest(offset, true);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setNewItem(false) : setNewItem(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
	}

    const onCharListLoaded = (newcharList) => {
		let ended = false;
		if (newcharList.length < 9) {
			ended = true;
		}

		setCharList(charList => [...charList, ...newcharList]);
		setNewItem(newItem => false);
		setOffset(offset => offset + 9);
		setCharEnded(charEnded => ended)
    }

	const itemRef = useRef([]);

	const focusOnItem = (id) => {
		itemRef.current.forEach(i => i.classList.remove('char__item_selected'));
		itemRef.current[id].classList.add('char__item_selected');
		itemRef.current[id].focus();
	}

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
					tabIndex={0}
					ref={el => itemRef.current[i] = el}
                    key={item.id}
					onClick={() => {
						props.onCharSelected(item.id)
						focusOnItem(i)
					}}
					onKeyPress={(e) => {
						if (e.key === ' ' || e.key === 'Enter') {
							props.onCharSelected(item.id);
							focusOnItem(i);
						}
					}}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
	
	const items = renderItems(charList);

	const errorMessage = error ? <Error/> : null;
	const spinner = loading && !newItem ? <Spinner/> : null;

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{items}
			<button 
			className="button button__main button__long"
			disabled={newItem}
			style={{'display': charEnded ? 'none' : 'block' }}
			onClick={() => onRequest(offset)}>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

export default CharList;