'use client'

import Image from "next/image";
import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios"; // Make sure to install axios if not already done

type CardProps = {
  avatar_url: string;
  login: string;
  blog: string;
};

const Card = (props: CardProps) => {
  return (
    <div className="m1">
      <img alt="avatar" style={{ width: '70px'}} src={props.avatar_url} />
      <div>
        <div style={{ fontWeight: 'bold' }}>{props.login}</div>
        <div>{props.blog}</div>
      </div>
    </div>
  );
};

type CardListProps = {
  cards: CardProps[];
};

const CardList = (props: CardListProps) => {
  return (
    <div>
      {props.cards.map((card, index) => (
        <Card key={index} {...card}  />
      ))}

    </div>
  );
};

type FormProps = {
  onSubmit: (cardInfo: CardProps) => void;
};

const Form = (props: FormProps) => {
  const [username, setUsername] = useState<string>('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.get(`https://api.github.com/users/${username}`).then(resp => {
      const { avatar_url, login, blog } = resp.data;
      console.log('resp data--------', resp.data)
      props.onSubmit({ avatar_url, login, blog });
      setUsername('');
    }).catch(error => console.error('Error fetching user:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
        placeholder="Github username"
        required
      />
      <button type="submit">Add Card</button>
    </form>
  );
};

export default function Home() {
  const [cards, setCards] = useState<CardProps[]>([]);

  const addNewCard = (cardInfo: CardProps) => {
    setCards(cards.concat(cardInfo));
    console.log(cards)
  };

  return (
    <div>
      <Form onSubmit={addNewCard} />
      <CardList cards={cards} />
    </div>
  );
}
