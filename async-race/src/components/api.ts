import { stopRaceAnimation } from '../utils/raceAnimations';
import { state } from './store';

const url = 'http://127.0.0.1:3000/';
const garage = `${url}garage`;
const engine = `${url}engine`;
const winners = `${url}winners`;

export interface Car {
  id: number;
  name: string;
  color: string;
}

export const getCars = async (
  page: number,
): Promise<{
  items: Car[];
  count: number;
}> => {
  const response = await fetch(`${garage}?_page=${page}&_limit=7`);
  return {
    items: await response.json(),
    count: Number(response.headers.get('X-total-count')!), // If _limit param is passed api returns a header X-Total-Count that countains total number of records.
  };
};

export const getCar = async (id: number) => {
  return (await fetch(`${garage}/${id}`)).json();
};

export const createCar = async (body: Record<string, string>) => {
  return (
    await fetch(garage, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();
};

export const deleteCar = async (id: number) => {
  return (await fetch(`${garage}/${id}`, { method: 'DELETE' })).json();
};

export const updateCar = async (id: number, body: Record<string, string>) => {
  (
    await fetch(`${garage}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();
};

export const startRace = async (id: number): Promise<{ velocity: number; distance: number }> => {
  return (await fetch(`${engine}?id=${id}&status=started`, { method: 'PATCH' })).json();
};

export const stopRace = async (id: number) => {
  return (await fetch(`${engine}?id=${id}&status=stopped`, { method: 'PATCH' })).json();
};

export const setDrive = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`${engine}?id=${id}&status=drive`, { method: 'PATCH' });
  if (response.status === 500) {
    throw new Error('Car is broken');
  }
  const body = (await response.json()) as { success: boolean };
  return body;
};

const getSortOrder = (sort: string, order: string) => {
  return sort && order ? `&_sort=${sort}&_order=${order}` : '';
};

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

interface GetWinnersProps {
  page: number;
  sort: 'id' | 'wins' | 'time';
  order: 'ASC' | 'DESC';
}

export const getWinners = async ({
  page,
  sort,
  order,
}: GetWinnersProps): Promise<{
  items: { car: void; id: number; name: string; color: string }[];
  count: number;
}> => {
  const response = await fetch(`${winners}?_page=${page}&_limit=10${getSortOrder(sort, order)}`);
  const items = (await response.json()) as { car: void; id: number; name: string; color: string }[];
  return {
    items: await Promise.all(
      items.map(async (item: Car) => ({ ...item, car: await getCar(item.id) })),
    ),
    count: Number(response.headers.get('X-total-count')),
  };
};

export const getWinner = async (id: number): Promise<Winner> => {
  return (await fetch(`${winners}/${id}`)).json();
};

export const deleteWinner = async (id: number) => {
  return (await fetch(`${winners}/${id}`, { method: 'DELETE' })).json();
};

export const createWinner = async (body: Winner) => {
  const response = await fetch(winners, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 500) {
    throw new Error('Insert failed, duplicate id');
  }

  return response.json();
};

export const updateWinner = async (id: number, body: Winner) => {
  return (
    await fetch(`${winners}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();
};

interface SaveWinnerProps {
  id: number;
  time: number;
}

export const getWinnerStatus = async (id: number) => {
  return (await fetch(`${winners}/${id}`)).status;
};

export const saveWinner = async ({ id, time }: SaveWinnerProps) => {
  const winnerStatus = await getWinnerStatus(id);

  if (winnerStatus === 400) {
    await createWinner({
      id,
      wins: 1,
      time,
    });
  } else {
    const winner = await getWinner(id);
    await updateWinner(id, {
      id,
      wins: winner.wins + 1,
      time: time < winner.time ? time : winner.time,
    });
  }
};
