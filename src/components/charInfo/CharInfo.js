import { useState, useEffect } from 'react';

import Spinner from '../spinner/Spinner';
import Error from '../error/error';
import Skeleton from '../skeleton/Skeleton'
import useMarvelService from '../../services/MarvelService';
import './charInfo.scss';

const CharInfo = (props) => {
	
	const [char, setChar] = useState(null);

	const {loading, error, getCharacter, clearError} = useMarvelService();

	useEffect(() => {
		updateChar()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.charId])

	const updateChar = () => {
		const {charId} = props;
		if (!charId) {
			return
		};

		clearError()
		getCharacter(charId)
			.then(onCharLoaded)
	}

	const onCharLoaded = (char) => {
		setChar(char);
	}

	const normal =  char || loading || error ? null : <Skeleton/>
	const errorMessage = error ? <Error/> : null;
	const spinner = loading ? <Spinner/> : null;
	const content = !(error || loading || !char) ? <View char={char}/> : null;

	return (
		<div className="char__info">
			{errorMessage}
			{spinner}
			{content}
			{normal}
		</div>
	)
}

const View = ({char}) => {
	const {name, thumbnail, description, homepage, wiki, comics} = char;

	let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} alt={name} style={imgStyle}/>
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">{description}</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
			{comics.length > 0 ? null : 'No comics mantion this character yet'}
				{
					comics.map((item, i) => {
						if (i < 10) {
							return (
								<li key={i} className="char__comics-item">
									{item.name}
								</li>
							)
						} else
						return ''

					})
				}
			</ul>
		</>
	)
}

export default CharInfo;