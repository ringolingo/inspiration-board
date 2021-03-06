import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Board.css';
import Card from './Card';
import NewCardForm from './NewCardForm';
import CARD_DATA from '../data/card-data.json';

const Board = ({url, boardName}) => {
  const [cardList, setCardList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${url}boards/${boardName}/cards`)
      .then((response) => {
        const fetchCards = [];
        response.data.forEach((hash) => {
          fetchCards.push(hash.card);
        });
        setCardList(fetchCards);
        setError('');
      })
      .catch((error) => {
        setError(error.response.data.cause);
      })
  }, []);

  const deleteCard = (cardId) => {
    axios.delete(`${url}cards/${cardId}`)
      .then((response) => {
        const stillCards = [];
        cardList.forEach((card) => {
          if (card.id != response.data.card.id) {
            stillCards.push(card)
          }
        });
        setCardList(stillCards);
        setError('');
      })
      .catch((error) => {
        setError(error.response.data.cause);
      })
  };

  const addCard = (cardHash) => {
    const newId = Math.max(...cardList.map((hash) => hash.id)) + 1

    axios.post(`${url}boards/${boardName}/cards`, {
        id: newId,
        text: cardHash.text,
        emoji: cardHash.emoji,
      })
      .then((response) => {
        setCardList([...cardList, cardHash]);
        setError('');
      })
      .catch((error) => {
        setError(error.response.data.cause);
      })
  };

  const cardComponents = cardList.map((hash) => {
    return <Card text={ hash.text } emoji={ hash.emoji } id={ hash.id } onDeleteCallback={ deleteCard } />
  });

  return (
    <div className="board">
      <NewCardForm onFormSubmit={ addCard} />
      { error ? <p className='validation-errors-display'>{ error }</p> : null }
      { cardComponents }
    </div>
  )
};
Board.propTypes = {
  url: PropTypes.string.isRequired,
  boardName: PropTypes.string.isRequired,
};

export default Board;
