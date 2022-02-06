import { useHTTP } from "../hooks/http.hook";


const useMarvelService = () => {

	const {loading, error, request, clearError} = useHTTP()

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/',
	_apiKey = 'apikey=4aaf0fccb59bf3db08d618e95927fb8e',
	_baseOffSet = 212;


	const getAllCharacters =  async (offset = _baseOffSet) => {
		const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`)
		return res.data.results.map(_transformChar)
	}
	const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformChar);
    }

	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
		return _transformChar(res.data.results[0]);
	}

	const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

	const _transformChar = (char) => {

		return {
			id: char.id,
			name: char.name,
			description: char.description ? char.description.slice(0, 120) + '...' : 'No info added by author. You may be the one who will fill it)',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items
		}

	}

	const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
        }
    }

	return {loading, error, getAllCharacters, getCharacter, clearError, getComic, getAllComics, getCharacterByName}
}

export default useMarvelService;